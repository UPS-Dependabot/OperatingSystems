module TSOS{
    export class ProcessControlBlock{
        constructor(
            public PID: number = 0,
            public ProgramCounter = "00",
            public ProcesState = "Resident",
            public Xreg = "00",
            public Yreg = "00",
          ) {
        }//constructor

        public init(): void{

        }//init

        public getPID(){
            return this.PID;
        }//getPID
        
        public setPID(newPID){
            this.PID = newPID;
        }//setPID
        
    }//Process Control Block
}//TSOS