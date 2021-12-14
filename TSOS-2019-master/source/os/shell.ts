/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            
            //status
            sc = new ShellCommand(this.shellStatus,
                                "status",
                                "<string> - Tell me your status");
            this.commandList[this.commandList.length] = sc;
            //whereami
            sc  = new ShellCommand(this.shellWhereami,
                                    "whereami",
                                    "- Informs you about your current where abouts.");
            this.commandList[this.commandList.length]  = sc;

            sc  = new ShellCommand(this.shellDate,
                                    "date",
                                    "- Tells you the current date");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellFerb,
                                    "ferb",
                                    "- Ferb I know what we are going to do today");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                                    "load",
                                    "- validates user code in the User Program Input. Only hex digits and spaces are valid");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellCSOD,
                                    "csod",
                                    " - crashes the console and displays the Chark screen of Death :)");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRun,
                                "run",
                                " - Runs the program that is currently loaded into memory");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellclearMem,
                                "clearmem",
                                " - Clears all memory");
            this.commandList[this.commandList.length] = sc;
            
            sc = new ShellCommand(this.shellKill,
                                    "kill",
                                    "<id> - kills the specified process id");
            this.commandList[this.commandList.length] = sc;

            sc =  new ShellCommand(this.shellQuantum,
                                    "quantum",
                                    "<number> - sets the quantum for RR context switch");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRunAll,
                                "runall",
                                " - runs all programs in memory");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellKillAll,
                                "killall",
                                " - kill all programs in memory");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellPS,
                                "ps",
                                " - display the PID and the state of all processes");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellFormat,
                                    "format",
                                    " - formats the Disk Drive");
            this.commandList[this.commandList.length] = sc;
                                    
            sc = new ShellCommand(this.shellCreate,
                                    "create",
                                    " - creates a new file in the system");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWrite,
                                    "write",
                                    " - writes new data to a file");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRead,
                                    "read",
                                    " - reads from file");
            this.commandList[this.commandList.length] = sc;
                                
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION + " authored by Brian Coppola");
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            
             //Ensure that the Cpu is no longer executing
            _CPU.isExecuting = false;
            
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "ver":
                        _StdOut.putText("Provides version info");
                        break;
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "shutdown":
                        _StdOut.putText("It's the off button mate.");
                        break;
                    case "cls":
                        _StdOut.putText("Makes all of your problems vanish.");
                        break;
                    case "man":
                        _StdOut.putText("Is suppose to tell you what <command> means.");
                        break;
                    case "trace":
                        _StdOut.putText("Pauses and unpauses the host log.");
                        break;
                    case "rot13":
                        _StdOut.putText("Cypher that rotates each letter by 13 letters.");
                        break;
                    case "prompt":
                        _StdOut.putText("Resets the prompt of where you begin typing the command line.");
                    case "status":
                        _StdOut.putText("User can enter their status");
                        break;
                    case "whereami":
                        _StdOut.putText("Tells you your location");
                        break;
                    case "date":
                        _StdOut.putText("Prints the current date");
                        break;
                    case "ferb":
                        _StdOut.putText("Phineas tell you what you are going to do today");
                        break;
                    case "load":
                        _StdOut.putText("Validates program input");
                        break;
                    case "csod":
                        _StdOut.putText("Crashes the OS and displays screen of death");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        public shellStatus(args: string[]){
             var userStatus = <HTMLInputElement> document.getElementById("status");
             var input = ""; 

             var usrStatus = _StdOut.buffer.split(" ");
             if (args.length > 0) {
                for(var i in args){
                    input += args[i]+" "; //user input from the shell
                }//for 
                
               userStatus.innerText = input;
             }//if
        }

        public shellWhereami(args: string[]){
            _StdOut.putText("Chark Town DAAWG");
        }//whereami

        public shellDate(args: string[]){
            _StdOut.putText(Date());
        }//date

        //Phineas tells Ferb what they are going to do today based off of the day of the week!
        //
        //Phineas and Ferb is a cartoon show on Disney if you don't understand the reference
        public shellFerb(args: string[]){
            var activity = "poop";
             switch (Date().slice(0, 3)) {
                 case "Mon":
                    activity = "build a rocket!";
                     break;
                case "Tue":
                    activity = "fight a mummy!";
                    break;
                case "Wed":
                    activity = "climb up the Effel Tower!";
                    break;
                case "Thu":
                    activity = "discover something that doesn't exist!";
                    break;
                case "Fri":
                    activity = "give a monkey a shower!";
                    break;
                case "Sat":
                    activity = "locate Frankenstein's brain!";
                    break;
                case "Sun":
                    activity = ".. Wait! Where's Perry?";
                    break;
                default:
                    activity = "take a break.";
             }
             _StdOut.putText("Hey Ferb! Lets " + activity);
        }//ferb


        public shellLoad(args: string[]){
            // Initialize the _UserInput
            var userProgramInput = <HTMLInputElement> document.getElementById("taProgramInput");
            var userInput = userProgramInput.value.trim();  //gets rid of the trailing white space
            
            //removes all spaces
            userInput = userInput.replace(/\s/g, '');

            //Finds if the program is valid
            var valid = true;
            var characterIndex = 0;

            /*
            // I Originally tried to implement a regular expression to execute this command
            // but when I tried to use the test() command to validate whether or not the user input was valid hex 
            // it would always say it was valid as long as there was a single valid character withiin the user program.
            // I have never used regular expressions before this class so I decided to stick with what I know. 
            // Unfortuanately, I know how to make long switch statements so here you go!
            */
            while(valid && characterIndex < userInput.length ){
                switch(userInput[characterIndex]){
                    case "0":
                        break;
                    case "1":
                        break;
                    case "2":
                        break;
                    case "3":
                        break;
                    case "4":
                        break;
                    case "5":
                        break;
                    case "6":
                        break;
                    case "7":
                        break;
                    case "8":
                        break;
                    case "9":
                        break;
                    case "a":
                        break;
                    case "b":
                        break;
                    case "c":
                        break;
                    case "d":
                        break;
                    case "e":
                        break;
                    case "f":
                        break;
                    case "A":
                        break;
                    case "B":
                        break;
                    case "C":
                        break;
                    case "D":
                        break;
                    case "E":
                        break;
                    case "F":
                        break;
                    case " ":
                        break;
                    default:
                        valid = false;
                }//switch

                characterIndex++;
            }//while

            //formats the user input
            var noSpaceLength= userInput.length
            if(noSpaceLength > 2){ //no need to format input if the size is less than 2
                var formattedUserInput = "";
                for(var i = 2; noSpaceLength >= i; i++){
                   if(i % 2 == 0){
                    formattedUserInput +=  userInput.substr(i-2,2) +" ";
                   }//if
                }//for
                if(noSpaceLength % 2 == 1){// Adds the last character if odd
                    formattedUserInput +=userInput.substr(noSpaceLength-1,1);
                }
                //inserts the formatted user input in to back into the program
                userProgramInput.value = formattedUserInput;
            }//if
            else{// strips any extra spaces when there are 2 or less characters in the user program
                userProgramInput.value = userInput;
            }
            
            if(valid){
                //Splits so the array generated by spaces
                
                //The list is set to an approriate size and has all the elements inserted into it
                var validProgram = new Array(userProgramInput.value.split(" ").length);
                validProgram = userProgramInput.value.split(" ");

                if(userProgramInput.value == "")
                    _StdOut.putText("There is no program inputted");
                else{
                    //Tests to see if there is room in memory
                    var segmentNum = _MemoryManager.segmentAllocation();
                    if(segmentNum >= 3){
                        _StdOut.putText("There is no room for this program. :(");

                        //LOAD PROGRAM INTO DISK DRIVE

                    }//if
                    else{
                        _StdOut.putText("Valid Program :)");

                        //Send to Memory Accessor to store in Memory  
                        _MemAcc.loadIn(validProgram, segmentNum);
                        

                        //Creates new PCB
                        var pcb  = new ProcessControlBlock();
                        pcb.init();

                        pcb.PID = _PIDNumber;
                        pcb.segment = segmentNum;
                        pcb.offset = segmentNum*Segment_Length;
                        pcb.limit = pcb.offset + Segment_Length-1;

                        //stores the new process control block
                        _PCBs[_PIDNumber] = pcb;
                        _readyQueue.enqueue(pcb);

                        _StdOut.advanceLine();
                        _StdOut.putText("Process ID: "+pcb.PID);

                        //Note to self: The _PIDNumber is incremented in the update_PCB_GUI()
                        //
                        //Update: Memory GUI
                        //        PCB GUI
                        //  
                        //  Boolean determines wether or not to create a new block in the GUI
                        TSOS.Control.update_PCB_GUI(_PIDNumber, true);  
                        TSOS.Control.update_Mem_GUI();     
                    }//else 
                }//else No program inputted
            }//valid
            else{
                _StdOut.putText("Invalid Program :( Only usee 0-9, A-F, a-f");
            }//else    
        }//load


        public shellCSOD(args: string[]){
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            //Crash the OS
            _Kernel.krnTrapError("Chark Screen of Death");
        }//CSOD

        //Runs the program loaded into memory
        public shellRun(args: string[]){
            var userPCB = args[0];
            var runPCB: TSOS.ProcessControlBlock;
            var found = false;
            var index = 0;
            
            //Find if the id the user entered exists
            if(_PCBs[userPCB] != null){
                _StdOut.putText("Process "+userPCB+": Ready");
                _PCBs[userPCB].ProcesState = "Ready";
                _readyQueue.dequeue();//takes off the ready Ready Queue
                
                var pcbIndex = parseInt(userPCB);
                //sets the offset in the CPU so the PC is starting in the right segment in memory
                _CPU.offset =  _PCBs[pcbIndex].offset;
                _CPU.PC = _PCBs[pcbIndex].PC;

                //saves the running PCB for later when we context switch in the scheduler
                _RunningPCB = _PCBs[pcbIndex];
                //TSOS.Control.update_PCB_GUI(pcbIndex, false);
                
                _PCBs[userPCB].ProcesState = "Running";
                _PCBs[userPCB].isExecuting = true;
                _CPU.isExecuting = true; //begins the program execution
                
            }//if
            else{
                _StdOut.putText("There is no program associated with this PID");
            }
        }//Run

        //Clears all memory in the OS
        public shellclearMem(args: string[]){
            //clears all memory
            for(var i = 0; i < _RunningPrograms.length; i++){
                _Mem.clearMem(i);
                //Indicates that there is now room for a new program
                _RunningPrograms[i] = false;
            }//for
            
            //Update the GUI
            TSOS.Control.update_Mem_GUI();       
        }//Clear Mem

        //Kills a program
        public shellKill (args: string[]){
            var executePID = parseInt(args[0]);

            //checks if the PID exists
            //if(_PCB[executePID] != null){

                
                _Mem.clearMem(_PCBs[executePID].segment);  
                _RunningPrograms[_PCBs[executePID].segment] = false;     //Opens a space in memory
        
                _PCBs[executePID].ProcesState = "Terminated";
                _PCBs[executePID].isExecuting = false;
                

                //Update the GUI
                TSOS.Control.update_PCB_GUI(executePID, false);
                TSOS.Control.update_Mem_GUI();

                
            //}//if
        }//kill
        
        //User Sets Quantum
        public shellQuantum(args: string[]){
            var q = parseInt(args[0]);
            //sets the quantum in the scheduler
            _Scheduler.setQuantum(q);
        }//quantum


        public shellRunAll(args: string[]){
            for(var i in _PCBs){
                if(_PCBs[i].ProcesState == "Resident"){
                    _PCBs[i].ProcesState = "Ready"; //Sets the state to Ready (Basically just for the GUI)
                    //TSOS.Control.update_PCB_GUI(_PCBs[i], false);// updates the GUI                    
                    _PCBs[i].isExecuting = true;    
                }//if
            }//for
            _RunningPCB = _readyQueue.dequeue(); //Takes the first process of the queue. 
            _RunningPCB.ProcesState = "Running"; //Sets the state Running

            _Scheduler.decide(); //Starts the scheduler
            _CPU.isExecuting = true; //begins program execution
        }//runall

        public shellKillAll(args: string[]){
            var index = 0;
            while( _readyQueue.getSize() >= index){
                _PCBs[index].isExecuting = false;
                _Mem.clearMem(_PCBs[index].segment);
                _RunningPrograms[index] = false;
                _PCBs[index].ProcesState = "Terminated";
                TSOS.Control.update_PCB_GUI(index, false);
                _PCBs[index].isExecuting = false;
                index++;
            }//for
            //Update the GUI
            TSOS.Control.update_Mem_GUI();
        }//kill all
        
        public shellPS(args: string[]){
            var index = 0;
            while(index < _PIDNumber){
                _StdOut.putText("PID: " + String(_PCBs[index].PID) + " State: " + _PCBs[index].ProcesState);
                _StdOut.advanceLine();
                index++;
            }//while
        }//shellPS

        //Outputs waittime and turnaround time when a process completes
        public helperWaitTurnTime(pcb){
            _StdOut.putText("PID "+pcb.PID+" Complete!");
            _StdOut.advanceLine();
            _StdOut.putText("TurnAroundTime: "+pcb.turnTime);
            _StdOut.advanceLine();
            _StdOut.putText("WaitTime: "+pcb.waitTime);
            _StdOut.advanceLine();
            _StdOut.putText(this.promptStr);
        }//helperWaitTurnTime

        //Returns all of the user input in the shell
        public helperfetchArgs(args: string[]){
            var input = "";
            for(var i in args){
                input += args[i]+" "; //user input from the shell
            }//for 
            return input;
        }//helperfetchArgs

        public shellFormat(args: string[]){
          _krnDiskDriver.format();
               
        }
        //Attempts to create file and informs the user of the result
        public shellCreate(args: string[]){

            if(_krnDiskDriver.create(args)){
                _StdOut.putText("File "+ args +" Created :)");
            }
            else{
                _StdOut.putText("File "+ args +" not created :(");
            }
        }//create

        public shellWrite(args: string[]){
            if(args.length == 2){// Make sure that there are only two parameters in the shell
                if(_krnDiskDriver.write(args[0],args[1], false )){
                    _StdOut.putText("Successfully wrote to file");
                }//if
                else{
                    _StdOut.putText("There is not enough space to store the program on the disk");
                }//else
            }//if
            else{
                _StdOut.putText("format incorrect: write <filename> <\"data\"> ");
            }//else
        }//write


        public shellRead(args: string[]){
            if(_krnDiskDriver.format){
                if(args.length == 1){
                    var fileData = _krnDiskDriver.read(args[0]);
                    _StdOut.putText(fileData);
                }//if
                else{
                    _StdOut.putText("read incorrect: read <filename> ");
                }//else
            }//if
            else{
                _StdOut.putText(" Disk not formatted ");
            }
        }//read
    }//Shell
}
