module TSOS{
    export class ProcessControlBlock{
        constructor(
            public PID: number = 0,
            public ProgramCounter: number = 0,
            public ProcesState = "Resident",
            public Xreg = "",
            public YReg = ""
          ) {
        }//constructor

        public init(): void{

        }//init



        
    }//MemoryAccessor
}//TSOS