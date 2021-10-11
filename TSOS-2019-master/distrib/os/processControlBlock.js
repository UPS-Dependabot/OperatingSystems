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