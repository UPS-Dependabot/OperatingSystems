var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        } //constructor
        init() {
        } //init
        //loads the user's program into memory
        loadIn(newCode, base) {
            //Determines where the program will start so it will begin in the right place in the segment
            var offset = base * 256;
            //clears memory every time you load so none of the last program lingers in memory
            _Mem.clearMem(base);
            for (var i = 0; i < newCode.length; i++) {
                _Mem.Mem[i + offset] = newCode[i];
            } //for
        } //load in
        //Returns the hex at the specified address
        read(address) {
            var opCodeString = _Mem.Mem[parseInt(address)];
            return opCodeString;
        } //read
        write(address, value) {
            _Mem.Mem[address] = value;
        } //write
    } //MemoryAccessor
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=memoryAccessor.js.map