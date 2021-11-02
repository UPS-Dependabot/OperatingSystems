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
                running = true;
                //while(_PCBs[index].isExecuting)
                // do{
                //     if(_PCBs[index].isExecuting)
                //         running = true;
                //     index++;
                // }//while
                //while(!running && index < _PCBs[index] != null);
            } //if
            //Prevents an undefined _RunningPCB from entering a context
            //  Occurs when you start OS
            if (running) {
                //Context switch when 
                //  (the quantm is reached 
                //  OR when the current Process is Terminated)
                //  (AND when the readyQueue has more 1 or more pcbs to switch to)
                if ((this.currQuan > this.quantum || _RunningPCB.ProcesState == "Terminated") && _readyQueue.getSize() >= 1) {
                    //this.contextSwitch();
                    _Dispatcher.contextSwitch();
                    this.currQuan = 0; //resets for the next process
                    _switched = true;
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
        //sets the Quantum
        setQuantum(newQuantum) {
            this.quantum = newQuantum;
        } //setQuantum
    } //Scheduler
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=scheduler.js.map