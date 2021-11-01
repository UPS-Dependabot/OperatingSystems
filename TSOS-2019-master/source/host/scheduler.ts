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

            //checks if there is a program that is running
            for(var i in _PCBs)
            {
                if(_PCBs[i].ProcessState == "Running")
                    running = true;
            }//for

            if(running){
                //context switch when the quantm is reached
                if(this.currQuan > this.quantum){
                    this.contextSwitch(_RunningPCB);
                }//if
                this.currQuan++;
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


        public contextSwitch(switchingPCB){
            //The running process will always be on the bottom 
            _readyQueue.dequeue();

            //places the PCB back ontop of the queue
            this.addPCBQueue(switchingPCB);            
        }//contextSwitch

        //sets the Quantum
        setQuantum(newQuantum){
            this.quantum = newQuantum;
        }//setQuantum
        
    }//Scheduler
}//TSOS
