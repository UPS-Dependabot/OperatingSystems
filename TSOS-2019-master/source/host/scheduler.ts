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
                do{
                    if(_PCBs[index].ProcesState == "Running")
                        running = true;
                    index++;
                }//while
                while(!running && index < _PCBs[index] != null);
            }//if
            
            //Prevents an undefined _RunningPCB from entering a context
            //  Occurs when you start OS
            if(running){
                //Context switch when the quantm is reached 
                //OR when the current Process is Terminated
                if(this.currQuan > this.quantum || _RunningPCB.ProcesState == "Terminated"){
                    this.contextSwitch();
                    this.currQuan = 0; //resets for the next process
                    _switched = true;
                }//if
            }//if


        }//decide

        //adds to the ready queue
        public addPCBQueue(pcb){
            _readyQueue.enqueue(pcb);
        }//addToQueue

        //When program terminates
        public removePCBQueue(pcb){
            _readyQueue.dequeue();
        }//remove


        public contextSwitch(){
            var tempPCB = new ProcessControlBlock;  //Creates Temp PCB 
            tempPCB = _RunningPCB;                  //Stops & Saves the running process

            _RunningPCB =  _readyQueue.dequeue();   //The Next Process gets set to the Running Process

            //_CPU.PC = _RunningPCB.PC;  
            _CPU.pcbUpdate();          //Sets the CPU's PC to the next Processes PC
                                       //  To prevent from starting from where the previous process's PC left off in the program
            _CPU.offset = _RunningPCB.offset;
            
            this.addPCBQueue(tempPCB); //The running process gets appended to the end of the Queue
        }//contextSwitch

        //sets the Quantum
        setQuantum(newQuantum){
            this.quantum = newQuantum;
        }//setQuantum
        
    }//Scheduler
}//TSOS
