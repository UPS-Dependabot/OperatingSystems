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

                    //Rollout Processes only if there are too many processes in memory
                    // if(this.livingPCBS() > 3){
                    //     var memoryData = "";
                    //     memoryData = this.fetchSeg(tempPCB);
                    //     //Roll out on the pcb from memory and save onto disk
                    //     //  so we have room to store the next program
                    //     _Swapper.rollOut(memoryData,tempPCB);

                    //     //Utlizing Page Fault Algorithm Most Recently Used to determine which PCB 
                    //     //  from disk will be rolled into memory
                    //     _MostRecentlyUsedPCB = tempPCB;                    

                    // }//if



                    TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false); // updates the PCB GUI

                    //Note to self: because there we are implementing non-premeptive priority the
                    //  Priotiy Queue will never need to append anything baack on because it will already 
                    //  be terminated by the time it executes a context switch

                    _readyQueue.enqueue(tempPCB);//The running process gets appended to the end of the Queue
                }//if
                else{
                    //Drops the PCB
                }//else

                
                _RunningPCB =  _readyQueue.dequeue();   //The Next Process gets set to the Running Process
                

                if(_RunningPCB.location == "Disk"){
                    var memoryData = "";
                    memoryData = this.fetchSeg(tempPCB);
                    //Roll out on the pcb from memory and save onto disk
                    //  so we have room to store the next program
                    _Swapper.rollOut(memoryData,tempPCB); 
                    _Swapper.rollIn(_RunningPCB);
                }//if
                //rollIn PCB from Disk

                _RunningPCB.ProcesState = "Running";    //Sets the next PCB that is about to run to Running
                TSOS.Control.update_PCB_GUI(_RunningPCB.PID, false); // updates the PCB GUI

                _RunningPCB.isExecuting = true;         //Ensures that this process is Executing
                _CPU.cpuUpdate();           //Sets the CPU's PC to the next Processes PC
                                            //  To prevent from starting from where the previous process's PC left off in the program      
        }//contextSwitch

        //finds the number of PCBS that aren't terminated
        public livingPCBS(){
            var counter = 0;
            var livingProcesses = 0;
            while( _PCBs[counter] != null){
                if(_PCBs[counter] != "Terminated"){
                    livingProcesses++;
                }//if
                counter++;
            }//while
            return livingProcesses;
        }//livingPCBS

        //Fetches data from a memory segment 
        public fetchSeg(pcb){
            var memoryData = "";
            var currData = "";
            var dataIndex = 0;
            var endIndex;
            //fetch the program data from the Running pcb
            while( Segment_Length-1 > dataIndex){
                currData = _MemAcc.read(pcb.offset+dataIndex);
                //Allows us to trim the extra zeros appended to the end of the file
                //  We want to make sure that if the entire program has data in it we are not trimming
                //  off any of the  || (dataIndex == Segment_Length && currData != "00")


                if(currData != "00"){
                    //The end index represents the index on the string while the data index
                    //  represents the index of the opCode Memory. Since there are 2 chars
                    //  per op code we know the endIndex will be twice the size of dataIndex
                    //  because endIndex tells us where it is in the string
                    endIndex = dataIndex*2;
                }//if
                memoryData += currData;
                dataIndex++;
            }//while

            return memoryData.substring(0, endIndex);
        }//fetchSeg
        
    }//Scheduler
}//TSOS
