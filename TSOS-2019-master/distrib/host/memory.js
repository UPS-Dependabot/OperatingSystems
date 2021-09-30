var TSOS;
(function (TSOS) {
    class Memory {
        constructor(Mem = new Array(256)) {
            this.Mem = Mem;
        } //constructor
        init() {
            //initialize all memory to be 0
            this.clearMem();
        } //init
        getMem() {
            return this.Mem;
        } //getMem
        clearMem() {
            for (var i = 0; Segment_Length > i; i++) {
                this.Mem[i] = "00"; // Everything begins at 00 in hex
            } //for
        } //clearMem
    } //Memory
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=memory.js.map