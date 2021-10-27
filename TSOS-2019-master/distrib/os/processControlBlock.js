var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(PID = 0, ProcesState = "Resident", PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, IR = "", isExecuting = false) {
            this.PID = PID;
            this.ProcesState = ProcesState;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.isExecuting = isExecuting;
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