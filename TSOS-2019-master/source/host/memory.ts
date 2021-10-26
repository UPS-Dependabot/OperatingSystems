module TSOS{
    export class Memory{
        constructor(
            public Mem = new Array(Segment_Length * 3)
            ) {
        }//constructor

        public init(): void{
            //init to false so Memory reconizes that there are no programs currently running
            _RunningPrograms = [false, false, false];

            //initialize all memory to be 0
            for (var i = 0; i < _RunningPrograms.length; i++){
                this.clearMem(i);
            }//for
        }//init

        getMem(){
            return this.Mem;
        }//getMem

        clearMem(base){
            var start = Segment_Length*base;
            var end = start + Segment_Length-1;
            for(var i = start; end > i; i++){
                this.Mem[i] = "00";// Everything begins at 00 in hex
            }//for
        }//clearMem
        
    }//Memory
}//TSOS