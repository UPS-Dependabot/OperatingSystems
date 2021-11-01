var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor(schedType = "rr") {
            this.schedType = schedType;
        } //constructor
        init() {
            this.schedType = "rr";
        } //init
        contextSwitch() {
            var tempPCB = new TSOS.ProcessControlBlock; //Creates Temp PCB 
            tempPCB = _RunningPCB; //Stops & Saves the running process
            _RunningPCB = _readyQueue.dequeue(); //The Next Process gets set to the Running Process
            //_CPU.PC = _RunningPCB.PC;  
            _CPU.pcbUpdate(); //Sets the CPU's PC to the next Processes PC
            //  To prevent from starting from where the previous process's PC left off in the program
            _CPU.offset = _RunningPCB.offset;
            _readyQueue.enqueue(tempPCB); //The running process gets appended to the end of the Queue
        } //contextSwitch
    } //Scheduler
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=dispatcher.js.map