var TSOS;
(function (TSOS) {
    class Swapper {
        constructor() {
        } //constructor
        init() {
        } //init
        //Rolls a file out of memory and into the disk
        //  invoked in the dispatcher when you context switch
        rollOut(data, pcb) {
            // Put the PCB onto the disk
            var fileName = "*file_" + pcb.PID;
            _krnDiskDriver.create(fileName);
            _krnDiskDriver.write(fileName, data, true);
            pcb.location = "Disk";
            // clear mem segment so that a new file from the disk can rollIn to Memory
            _Mem.clearMem(pcb.segment);
        } //rollout
        //Rolls a process from Disk into Memory
        rollIn(pcb) {
            // read data from disk
            var fileName = "*file_" + pcb.PID;
            var data = _krnDiskDriver.read(fileName);
            // load it into mem
            for (var i = 0; i < data.length; i++) {
                _MemAcc.write(pcb.offset + i, data[i]);
            } //for
            // delete the file that held the data on the disk
            _krnDiskDriver.delete(fileName);
        } //rollin
    } //Swapper
    TSOS.Swapper = Swapper;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=swapper.js.map