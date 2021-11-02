var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() {
        } //constructor
        init() {
        } //init
        contextSwitch() {
            var tempPCB = _RunningPCB; //Stops & Saves the running process
            if (tempPCB.ProcesState == "Terminated") {
                //Drops the Process
            } //if
            else {
                _RunningPCB.ProcesState = "Ready"; //Sets the PCB that is about to stop back to ready
                TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false); // updates the PCB GUI
                _RunningPCB = _readyQueue.dequeue(); //The Next Process gets set to the Running Process
                _RunningPCB.ProcesState = "Running"; //Sets the next PCB that is about to run to Running
                TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false); // updates the PCB GUI
                _RunningPCB.isExecuting = true; //Ensures that this process is Executing
                _CPU.cpuUpdate(); //Sets the CPU's PC to the next Processes PC
                //  To prevent from starting from where the previous process's PC left off in the program
                _readyQueue.enqueue(tempPCB); //The running process gets appended to the end of the Queue
            } //else
        } //contextSwitch
    } //Scheduler
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=dispatcher.js.map