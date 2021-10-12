var TSOS;
(function (TSOS) {
    class PCB {
        constructor(ProgramCounter = 0, ProcesState = "", ProcessNumber = 0, Xreg = "", YReg = "") {
            this.ProgramCounter = ProgramCounter;
            this.ProcesState = ProcesState;
            this.ProcessNumber = ProcessNumber;
            this.Xreg = Xreg;
            this.YReg = YReg;
        } //constructor
    } //PCB
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=pcb.js.map