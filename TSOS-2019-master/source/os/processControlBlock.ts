module TSOS{
    export class ProcecControlBlock{
        constructor(
            public ProgramCounter: number = 0,
            public ProcesState = "",
            public ProcessNumber: number = 0,
            public Xreg = "",
            public YReg = ""
          ) {
        }//constructor

        public init(): void{

        }//init



        
    }//MemoryAccessor
}//TSOS