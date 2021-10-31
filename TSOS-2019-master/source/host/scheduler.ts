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

        }//init

        //adds to the ready queue
        public addPCBQueue(pcb){
            _readyQueue.enqueue(pcb);
        }//addToQueue

        //When program terminates
        public removePCBQueue(pcb){
            
        }//remove


        public contextSwitch(switchingPCB){
            //save the state of the process
            var tempPCB = switchingPCB;
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
