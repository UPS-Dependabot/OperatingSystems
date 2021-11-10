/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            


            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            //update the Log for Scheduling events
            var switched: string  = "NO"
            var segNum: string = "...";
            if(_switched){
                switched = "CONTEXT SWITCH!!!!";
                _switched = false;
                segNum = _RunningPCB.segment;
            }//if
            var scheduleStr: string  = "({Context switch: "+switched+"})" + "\n";
            
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + scheduleStr + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            //NOTE TO SELF: Had create some of my own inits here
            _Mem = new Memory();
            _Mem.init();
            _MemAcc	= new MemoryAccessor();

            _Scheduler = new Scheduler();
            _Scheduler.init();

            _Dispatcher = new Dispatcher();
            _Dispatcher.init();
            
            _readyQueue = new Queue();         
            
            _RunningPCB = new ProcessControlBlock();
            _RunningPCB.init();

            _Files = new Queue();
            //----------END OF MY INTIS-----------//

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            
            //location.reload(true);
            location.reload();

            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static update_PCB_GUI(pcBlock, createNewPCB){
            var tableBody = document.getElementById("pcbBody");

            // If this class doesn't exist then create a new class
            if(createNewPCB){
                //Create a new class to contain the PCB
                var row = document.createElement("tr");
                row.className += String(+pcBlock.PID);
                //update the PCB
                this.updatePCB(pcBlock, tableBody, createNewPCB);
                //Update PIDNumber
                _PIDNumber++;
                //Inserts the row
                // tableBody.appendChild(row); 
            }//if
            else{//update existing pcb
                 this.updatePCB(pcBlock, tableBody, createNewPCB);
            }
            
        }//update_PCB_GUI

        public static updatePCB(pcb, tb, create) : void{
            if(create){
                //creates the new row for the  PCB
                var row = document.createElement("tr");

                //row.className += " "+String(+_PCBs[pcb].PID);
                row.id += " "+String(+ _PCBs[pcb].PID);
                
                //Inserts all of the PCB data into the GUI
                var td = document.createElement("td");
                td.innerHTML = String(_PCBs[pcb].PID);
                row.appendChild(td);

                //Convert to Hex
                //  got rid of the PC.toString(16) because it was breaking

                td = document.createElement("td");
                td.className = "PC";
                td.innerHTML = String(parseInt(_PCBs[pcb].PC));
                row.appendChild(td);

                td = document.createElement("td");
                td.innerHTML = _PCBs[pcb].ProcesState;
                row.appendChild(td);

                td = document.createElement("td");
                td.className = "Acc";
                td.innerHTML = String(parseInt(_PCBs[pcb].Acc));
                row.appendChild(td);

                td = document.createElement("td");
                td.className = "Xreg";
                td.innerHTML = String(parseInt(_PCBs[pcb].Xreg));
                row.appendChild(td);

                td = document.createElement("td");
                td.className = "Yreg";
                td.innerHTML = String(parseInt(_PCBs[pcb].Yreg));
                row.appendChild(td);

                td = document.createElement("td");
                td.className = "Zflag";
                td.innerHTML = String(_PCBs[pcb].Zflag);
                row.appendChild(td);

                td = document.createElement("td");
                td.className = "IR";
                td.innerHTML = _PCBs[pcb].IR;
                row.appendChild(td);

                
                //Inserts the row
                tb.appendChild(row);
            }//if create
            else{//update
                //fetches the row of the PCB in the GUI
                var pcbRow  = document.getElementById(" "+pcb);
                //List of all headers
                var headers = new Array(8);
                headers = ["PID", "PC" , "ProcesState", "Acc", "Xreg", "Yreg", "Zflag", "IR"];

                //All feilds in the pcb
                var feilds = new Array(8); 
                feilds = [pcb, _PCBs[pcb].PC, _PCBs[pcb].ProcesState, _PCBs[pcb].Acc, _PCBs[pcb].Xreg, _PCBs[pcb].Yreg,
                             _PCBs[pcb].Zflag, _PCBs[pcb].IR];

                //Inserts each header from the PCB into the GUI
                for(var header: number = 0; header < headers.length; header++){
                    var feild = headers[header];
                    if(feild != "ProcesState"){//Inserts all headers as hex except for the State & Segment
                    //  PCB GUI = PCB Object values
                    //  Ex:   row-ID.PC = pcb.PC;
                    pcbRow.children[header].innerHTML = String(feilds[header].toString(16));
                    }
                    else{//inserts the state/seg in plain text
                        pcbRow.children[header].innerHTML = String(feilds[header]);
                    }
                }//for       
            }//else

       }//updatePCB
        
        //Takes in the current PCB and updates the CPU accordingly
        public static update_CPU_GUI(){
            document.getElementById("cpuPC").innerHTML = String(_CPU.PC.toString(16));
            document.getElementById("cpuAcc").innerHTML = String(_CPU.Acc.toString(16));
            document.getElementById("cpuX").innerHTML = String(_CPU.Xreg.toString(16));
            document.getElementById("cpuY").innerHTML = String(_CPU.Yreg.toString(16));
            document.getElementById("cpuZ").innerHTML = String(_CPU.Zflag.toString(16));
            document.getElementById("cpuIR").innerHTML = String(_CPU.IR);
        }//update_CPU_GUI

        

        //Inserts memory into the GUI
        public static update_Mem_GUI() : void{
        
            //Initialize the GUI so the user can see memory 
            var memGUI = document.getElementById("memTable");
            
            //Clear the old memory so we don't see every iteration when someone loads.
            this.removeAllChildNodes(memGUI);

            //Makes the code in the loop look cleaner
            var byteLength = 8;
            
            //multipled by 3 to allocate space for each program
            for(var tableRow = 0; tableRow < (Segment_Length*3/8) ; tableRow++){
                var row = document.createElement("tr");
                //Loops 8 times because we know this is for each individual byte and the label
                for(var rowCell = 0; rowCell < byteLength; rowCell++){
                    var cell = document.createElement("td");
                    if(rowCell == 0){//Adds the label
                        var labelCell= document.createElement("td");
                        labelCell.setAttribute("style", "color:black; background: white");
                        labelCell.innerHTML = (tableRow*8).toString(16); //converts the row number to hex for the label
                        row.appendChild(labelCell);
                    }
                    //This is definately a weird way of fetching the data from the Memory array but it works
                    cell.innerHTML = _MemAcc.read(tableRow*byteLength + rowCell);
                    
                    //Inserts each byte into the row
                    row.appendChild(cell);
                }//for
                //Inserts the row into the memory GUI
                memGUI.appendChild(row);
            }//for
        }//memoryInsert

        //Removes all childeren
        public static removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
        

    }
}
