module TSOS{
    export class MemoryAccessor{
        constructor(

            ) {
        }//constructor

        public init(): void{

        }//init

         //loads the user's program into memory
         loadIn(newCode){
             //clears memory every time you load so none of the last program lingers in memory
             _Mem.clearMem();
            for(var i in newCode){
                _Mem.Mem[i] = newCode[i];
            }//for
        }//load in

        //Returns the hex at the specified address
        read(address){
             
            var opCodeString = _Mem.Mem[parseInt(address)];
            return opCodeString;
        }//read

        write(address, value){
            _Mem.Mem[address] = value;
            TSOS.Control.update_Mem_GUI();
            TSOS.Control.update_CPU_GUI();
            TSOS.Control.update_PCB_GUI();
        }//write

        store(){
            
        }
        
    }//MemoryAccessor
}//TSOS