var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor(quantum = _QuantumDefault, currQuan = 0, schedType = "rr") {
            this.quantum = quantum;
            this.currQuan = currQuan;
            this.schedType = schedType;
        } //constructor
        init() {
            this.quantum = _QuantumDefault;
            this.currQuan = 0;
            this.schedType = "rr";
        } //init
        //Makes decisions as to when the right time is to switch
        decide() {
            var running = false;
            var index = 0;
            //checks if there is a program that is running
            if (!_readyQueue.isEmpty()) { //prevents loop from running when there are no pcbs
                while (!running && index < _PCBs[index] != null) {
                    if (_PCBs[index].ProcesState == "Running")
                        running = true;
                    index++;
                } //while
            } //if
            if (running) {
                //context switch when the quantm is reached
                if (this.currQuan > this.quantum) {
                    this.contextSwitch();
                    this.currQuan = 0; //resets for the next process
                } //if
            } //if
        } //decide
        //adds to the ready queue
        addPCBQueue(pcb) {
            _readyQueue.enqueue(pcb);
        } //addToQueue
        //When program terminates
        removePCBQueue(pcb) {
            _readyQueue.dequeue();
        } //remove
        contextSwitch() {
            var tempPCB = _RunningPCB; //stops and saves the running process
            //The running process will always be on the bottom 
            _RunningPCB = _readyQueue.dequeue();
            _CPU.PC = _RunningPCB.PC; //Sets the CPU's PC to the next Processes PC
            //  To prevent from starting from where the previous process's PC left off in the program
            _CPU.offset = _RunningPCB.offset;
            this.addPCBQueue(tempPCB); //Places previous running PCB back ontop of the queue
        } //contextSwitch
        //sets the Quantum
        setQuantum(newQuantum) {
            this.quantum = newQuantum;
        } //setQuantum
    } //Scheduler
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=scheduler.js.map