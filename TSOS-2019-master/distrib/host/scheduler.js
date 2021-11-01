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
            //checks if there is a program that is running
            for (var i in _PCBs) {
                if (_PCBs[i].ProcesState == "Running")
                    running = true;
            } //for
            if (running) {
                //context switch when the quantm is reached
                if (this.currQuan > this.quantum) {
                    this.contextSwitch();
                    this.currQuan = 0; //resets for the next process
                } //if
                this.currQuan++;
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
            var tempPCB = _RunningPCB;
            //The running process will always be on the bottom 
            _RunningPCB = _readyQueue.dequeue();
            //places the PCB back ontop of the queue
            this.addPCBQueue(tempPCB);
        } //contextSwitch
        //sets the Quantum
        setQuantum(newQuantum) {
            this.quantum = newQuantum;
        } //setQuantum
    } //Scheduler
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=scheduler.js.map