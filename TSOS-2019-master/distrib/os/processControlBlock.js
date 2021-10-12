var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(PID = 0, ProgramCounter = "00", ProcesState = "Resident", Xreg = "00", Yreg = "00", Acc = "00", Zflag, IR = "") {
            this.PID = PID;
            this.ProgramCounter = ProgramCounter;
            this.ProcesState = ProcesState;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Acc = Acc;
            this.Zflag = Zflag;
            this.IR = IR;
        } //constructor
        init() {
            this.PID = 0;
            this.ProgramCounter = "00",
                this.ProcesState = "Resident",
                this.Xreg = "00",
                this.Yreg = "00",
                this.Acc = "00",
                this.Zflag = 0,
                this.IR = "";
        } //init
        getPID() {
            return this.PID;
        } //getPID
        setPID(newPID) {
            this.PID = newPID;
        } //setPID
    } //Process Control Block
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=processControlBlock.js.map