var TSOS;
(function (TSOS) {
    class ProcecControlBlock {
        constructor(ProgramCounter = 0, ProcesState = "", ProcessNumber = 0, Xreg = "", YReg = "") {
            this.ProgramCounter = ProgramCounter;
            this.ProcesState = ProcesState;
            this.ProcessNumber = ProcessNumber;
            this.Xreg = Xreg;
            this.YReg = YReg;
        } //constructor
        init() {
        } //init
    } //MemoryAccessor
    TSOS.ProcecControlBlock = ProcecControlBlock;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=processControlBlock.js.map