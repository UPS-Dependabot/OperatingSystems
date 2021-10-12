module TSOS{
    export class ProcessControlBlock{
        constructor(
            public PID: number = 0,
            public ProgramCounter = "00",
            public ProcesState = "Resident",
            public Xreg = "00",
            public Yreg = "00",
            public Acc =  "00",
            public Zflag : number,
            public IR = ""
          ) {
        }//constructor

        public init(): void{
             this.PID = 0;
             this.ProgramCounter = "00",
             this.ProcesState = "Resident",
             this.Xreg = "00",
             this.Yreg = "00",
             this.Acc =  "00",
             this.Zflag  = 0,
             this.IR = ""
        }//init

        public getPID(){
            return this.PID;
        }//getPID
        
        public setPID(newPID){
            this.PID = newPID;
        }//setPID
        
    }//Process Control Block
}//TSOS