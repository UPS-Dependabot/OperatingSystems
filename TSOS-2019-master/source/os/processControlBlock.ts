module TSOS{
    export class ProcessControlBlock{
        constructor(
            public PID: number = 0,
            public PC: number = 0,
            public ProcesState = "Resident",
            public Acc: number = 0,
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public IR: String = "",
            public isExecuting: boolean = false,
            public offset: number = 0,
            public segment: number = 0
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