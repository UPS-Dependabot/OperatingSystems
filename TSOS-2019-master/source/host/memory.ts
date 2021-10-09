module TSOS{
    export class Memory{
        constructor(
            public Mem = new Array(Segment_Length)
            ) {
        }//constructor

        public init(): void{
            //initialize all memory to be 0
            this.clearMem();
            //Inserts memory into the GUI
            //this.memoryInsert();

        }//init

        getMem(){
            return this.Mem;
        }//getMem

        clearMem(){
            for(var i = 0; Segment_Length > i; i++){
                this.Mem[i] = "00";// Everything begins at 00 in hex
            }//for
        }//clearMem

        //Inserts memory into the GUI TBH not sure if this is the proper area for this function but idk where else to put it
        public memoryInsert() : void{

            //Initialize the GUI so the user can see memory 
            var memGUI: HTMLTableElement = <HTMLTableElement> document.getElementById("memTable");
            //Makes the code in the loop look cleaner
            var byteLength = 8;
            for(var tableRow = 0; tableRow < (Segment_Length/8) ; tableRow++){
                var row = memGUI.insertRow(tableRow);
                //Loop 8 times because we know this is for each individual byte
                for(var rowCell = 0; rowCell < byteLength; rowCell++){
                    //This is definately a weird way of fetching the data from the Memory array but it works
                    var cell = row.insertCell(rowCell);
                    cell.innerHTML = _MemAcc.read(tableRow*byteLength + rowCell);
                }//for
            }//for
        }//memoryInsert
        
    }//Memory
}//TSOS