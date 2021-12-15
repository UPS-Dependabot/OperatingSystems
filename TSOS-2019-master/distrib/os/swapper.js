var TSOS;
(function (TSOS) {
    class Swapper {
        constructor() {
        } //constructor
        init() {
        } //init
        //RollIn and Roll Out are invoked at the dispatcher when there 
        //Rolls a file out of Memory and into Disk
        rollOut(data, pcb) {
            _MostRecentlyUsedPCB = pcb;
            // Put the PCB onto the disk
            var fileName = "*file_" + pcb.PID;
            _krnDiskDriver.create(fileName);
            _krnDiskDriver.write(fileName, data, true, true);
            pcb.location = "Disk";
            // clear mem segment so that a new file from the disk can rollIn to Memory
            _Mem.clearMem(pcb.segment);
            TSOS.Control.update_Mem_GUI();
            //Indicaates that there is a free segment when Memory reassigns
            // the segment to the next pcb
            _RunningPrograms[pcb.segment] = false;
        } //rollout
        //Rolls a process from Disk into Memory
        rollIn(pcb) {
            //Find a free segment to load the pcb onto
            var segmentNum = _MemoryManager.segmentAllocation();
            pcb.segment = segmentNum;
            pcb.offset = segmentNum * Segment_Length;
            pcb.limit = pcb.offset + Segment_Length - 1;
            // read data from disk
            var fileName = "*file_" + pcb.PID;
            var data = _krnDiskDriver.read(fileName);
            // Load PCB into memory and update the GUI
            for (var i = 0; i < data.length; i++) {
                //Adds each op code into Memory
                _MemAcc.write(pcb.offset + i, data[i] + data[i + 1]);
                i++;
            } //for
            TSOS.Control.update_Mem_GUI();
            pcb.location = "Memory";
            // delete the file that held the data on the disk
            _krnDiskDriver.delete(fileName);
        } //rollin
    } //Swapper
    TSOS.Swapper = Swapper;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=swapper.js.map