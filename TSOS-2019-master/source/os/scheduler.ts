module TSOS {
    export class Scheduler{

        constructor(
            public quantum: number = _QuantumDefault,
            public currQuan: number = 0,
            public schedType: String = "rr"
            ) 
            {
        }//constructor

        public init(): void{
            this.quantum = _QuantumDefault;
            this.currQuan = 0;
            this.schedType = "rr";
        }//init

        //Makes decisions as to when the right time is to switch
        public decide(){
            var running = false;
            var index = 0;
            //checks if there is a program that is running
            if(!_readyQueue.isEmpty()){//prevents loop from running when there are no pcbs
                running = true;
            }//if
            
            //Prevents an undefined _RunningPCB from entering a context
            //  Occurs when you start OS
            if(running){
                //Context switch when 
                //  (the quantm is reached 
                //  OR when the current Process is Terminated)
                //  (AND when the readyQueue has more 1 or more pcbs to switch to)

                if((this.currQuan > this.quantum || _RunningPCB.ProcesState == "Terminated") && _readyQueue.getSize() >= 1 && _RunningPCB.isExecuting) {
                    //this.contextSwitch();
                    _Dispatcher.contextSwitch();
                    this.currQuan = 0; //resets for the next process
                    _switched = true;
                }//if
            }//if


        }//decide

        public time(){
            //if(running){// Can only run when there is a running program
            if(_CPU.isExecuting){ //Begins running when there is a program running 
                for(var i = 0; _readyQueue.getSize() > i; i++){
                    if(_PIDNumber == _RunningPCB.PID)//turntime increases when running
                        _RunningPCB.turnTime++;
                    else { //Determines that the process has began running                    if(_readyQueue[i].isExecuting)       
                        var pcb = new ProcessControlBlock();        
                        pcb =  _readyQueue[i]; //waitime increase when a process 
                        pcb.waitTime++;  // is in the ready Queue
                    }//else
                }//for
            }//if
        }//time

        //adds to the ready queue
        public addPCBQueue(pcb){
            _readyQueue.enqueue(pcb);
        }//addToQueue

        //When program terminates
        public removePCBQueue(pcb){
            _readyQueue.dequeue();
        }//remove

        //sets the Quantum
        setQuantum(newQuantum){
            this.quantum = newQuantum;
        }//setQuantum
        
    }//Scheduler
}//TSOS
