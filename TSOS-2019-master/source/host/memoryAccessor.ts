module TSOS{
    export class MemoryAccessor{
        constructor(

            ) {
        }//constructor

        public init(): void{

        }//init

         //loads the user's program into memory
         loadIn(newOPs){
             //clears memory every time you load so none of the last program lingers in memory
             _Mem.clearMem();

            for(var i in newOPs){
                _Mem.Mem[i] = newOPs[i];
            }//for
        }//load in
        
    }//MemoryAccessor
}//TSOS