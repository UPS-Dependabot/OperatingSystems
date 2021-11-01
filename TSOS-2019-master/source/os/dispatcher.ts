module TSOS {
    export class Dispatcher{

        constructor(
            public schedType: String = "rr"
            ) 
            {
        }//constructor

        public init(): void{
            this.schedType = "rr";
        }//init

        public contextSwitch(){
            var tempPCB = new ProcessControlBlock;  //Creates Temp PCB 
            tempPCB = _RunningPCB;                  //Stops & Saves the running process

            _RunningPCB =  _readyQueue.dequeue();   //The Next Process gets set to the Running Process

            //_CPU.PC = _RunningPCB.PC;  
            _CPU.cpuUpdate();          //Sets the CPU's PC to the next Processes PC
                                       //  To prevent from starting from where the previous process's PC left off in the program
            _CPU.offset = _RunningPCB.offset;

            if(tempPCB.ProcesState != "Terminated")//Only dequeues when the program terminates
                _readyQueue.enqueue(tempPCB); //The running process gets appended to the end of the Queue
        }//contextSwitch

        
    }//Scheduler
}//TSOS
