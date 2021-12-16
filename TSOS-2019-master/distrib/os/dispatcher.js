var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() {
        } //constructor
        init() {
        } //init
        contextSwitch() {
            //aves the running process
            var tempPCB = _RunningPCB;
            if (tempPCB.ProcesState != "Terminated") {
                //Sets the PCB that is about to stop back to ready
                _RunningPCB.ProcesState = "Ready";
                TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false);
                //Note to self: because there we are implementing non-premeptive priority the
                //  Priotiy Queue will never need to append anything baack on because it will already 
                //  be terminated by the time it executes a context switch
                //This process still needs to finsih therefore, it is being placed in the 
                //  back of the queue so it can be run later 
                _readyQueue.enqueue(tempPCB);
            } //if
            else {
                //Drops the PCB
            } //else
            _RunningPCB = _readyQueue.dequeue(); //The Next Process gets set to the Running Process
            if (_RunningPCB != null) {
                if (_RunningPCB.location == "Disk") {
                    var memoryData = "";
                    memoryData = this.fetchSeg(tempPCB);
                    _Swapper.rollOut(memoryData, tempPCB);
                    _Swapper.rollIn(_RunningPCB);
                } //if
            } //if
            //Run next PCB
            _RunningPCB.ProcesState = "Running";
            TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false);
            _RunningPCB.isExecuting = true;
            _CPU.cpuUpdate();
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
        //Fetches data from a memory segment 
        fetchSeg(pcb) {
            var memoryData = "";
            var currData = "";
            var dataIndex = 0;
            var endIndex;
            //fetch the program data from the Running pcb
            while (Segment_Length - 1 > dataIndex) {
                currData = _MemAcc.read(pcb.offset + dataIndex);
                if (currData != "00") {
                    //The end index represents the index on the string while the data index
                    //  represents the index of the opCode Memory. Since there are 2 chars
                    //  per op code we know the endIndex will be twice the size of dataIndex
                    //  because endIndex tells us where it is in the string
                    endIndex = dataIndex * 2;
                } //if
                memoryData += currData;
                dataIndex++;
            } //while
            return memoryData.substring(0, endIndex);
        } //fetchSeg
    } //Scheduler
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=dispatcher.js.map