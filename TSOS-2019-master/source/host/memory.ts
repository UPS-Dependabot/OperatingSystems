module TSOS{
    export class Memory{
        constructor(
            public Mem = new Array(256)
            ) {
        }//constructor

        public init(): void{
            //initialize all memory to be 0
            this.clearMem();
        }//init

        getMem(){
            return this.Mem;
        }//getMem

        clearMem(){
            for(var i = 0; Segment_Length > i; i++){
                this.Mem[i] = "00";// Everything begins at 00 in hex
            }//for
        }//clearMem
        
    }//Memory
}//TSOS