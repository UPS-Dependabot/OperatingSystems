module TSOS {
    export class Dispatcher{

        constructor(
            ) 
            {
        }//constructor

        public init(): void{
        }//init

        public contextSwitch(){

                var tempPCB = _RunningPCB; //Stops & Saves the running process
                if(tempPCB.ProcesState != "Terminated"){ //Saves PCB
                    _RunningPCB.ProcesState = "Ready";      //Sets the PCB that is about to stop back to ready
                    TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false); // updates the PCB GUI

                    _readyQueue.enqueue(tempPCB);//The running process gets appended to the end of the Queue
                }//if
                else{
                    //Drops the PCB
                }//else

                //Sets the next PCB to running a state
                _RunningPCB =  _readyQueue.dequeue();   //The Next Process gets set to the Running Process

                _RunningPCB.ProcesState = "Running";    //Sets the next PCB that is about to run to Running
                TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false); // updates the PCB GUI

                _RunningPCB.isExecuting = true;         //Ensures that this process is Executing
                _CPU.cpuUpdate();           //Sets the CPU's PC to the next Processes PC
                                            //  To prevent from starting from where the previous process's PC left off in the program
                
        }//contextSwitch

        
    }//Scheduler
}//TSOS
