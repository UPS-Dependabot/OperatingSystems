var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() {
        } //constructor
        init() {
        } //init
        contextSwitch() {
            var tempPCB = _RunningPCB; //Stops & Saves the running process
            if (tempPCB.ProcesState != "Terminated") { //Saves PCB
                _RunningPCB.ProcesState = "Ready"; //Sets the PCB that is about to stop back to ready
                //Rollout Processes only if there are too many processes in memory
                if (this.livingPCBS() > 3) {
                    var memoryData = "";
                    //fetch the program data from the Running pcb
                    // for(var i = 0; Segment_Length > i; i++){
                    //     memoryData += _MemAcc.read(tempPCB.offset+i);
                    // }//for
                    this.fetchSeg(tempPCB);
                    //Roll out on the pcb from memory and save onto disk
                    //  so we have room to store the next program
                    _Swapper.rollOut(memoryData, tempPCB);
                } //if
                TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false); // updates the PCB GUI
                _readyQueue.enqueue(tempPCB); //The running process gets appended to the end of the Queue
            } //if
            else {
                //Drops the PCB
            } //else
            //Sets the next PCB to running a state
            _RunningPCB = _readyQueue.dequeue(); //The Next Process gets set to the Running Process
            //rollout PCB from Disk
            if (_RunningPCB.location == "Disk") {
                //fetch the program data from the Running pcb
                for (var i = 0; Segment_Length > i; i++) {
                    memoryData += _MemAcc.read(tempPCB.offset + i);
                } //for
                _Swapper.rollOut();
            } //if
            _RunningPCB.ProcesState = "Running"; //Sets the next PCB that is about to run to Running
            TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false); // updates the PCB GUI
            _RunningPCB.isExecuting = true; //Ensures that this process is Executing
            _CPU.cpuUpdate(); //Sets the CPU's PC to the next Processes PC
            //  To prevent from starting from where the previous process's PC left off in the program
        } //contextSwitch
        //finds the number of PCBS that aren't terminated
        livingPCBS() {
            var counter = 0;
            var livingProcesses = 0;
            while (_PCBs[counter] != null) {
                if (_PCBs[counter] != "Terminated") {
                    livingProcesses++;
                } //if
                counter++;
            } //while
            return livingProcesses;
        } //livingPCBS
        //Fetches a memory segment 
        fetchSeg(pcb) {
            var memoryData = "";
            var currData = "";
            var dataIndex = 0;
            //fetch the program data from the Running pcb
            while (Segment_Length > dataIndex && (currData != "00")) {
                currData = _MemAcc.read(pcb.offset + dataIndex);
                memoryData += currData;
                dataIndex++;
            } //while
            return memoryData;
        } //fetchSeg
    } //Scheduler
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=dispatcher.js.map