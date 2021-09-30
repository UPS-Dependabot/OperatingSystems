var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        } //constructor
        init() {
        } //init
        //loads the user's program into memory
        loadIn(newOPs) {
            for (var i in newOPs)
                _Mem.Mem[i] = newOPs[i];
        } //load in
    } //MemoryAccessor
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=memoryAccessor.js.map