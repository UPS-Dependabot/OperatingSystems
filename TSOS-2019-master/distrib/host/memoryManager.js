var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor(space = false) {
            this.space = space;
        } //constructor
        init() {
        } //init
        //Determines wether or not there is space in memory
        isSpace(programLength) {
            if (programLength <= Segment_Length) {
                this.space = true;
            } //if
            return this.space;
        } //isSpace
    } //MemoryManager
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=memoryManager.js.map