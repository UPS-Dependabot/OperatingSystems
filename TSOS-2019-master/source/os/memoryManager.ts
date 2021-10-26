module TSOS{
    export class MemoryManager{
        constructor(
            public space  = false,
            ) {
        }//constructor

        public init(): void{

        }//init
        
        //Determines wether or not there is space in memory
        public isSpace(programLength){
            if(programLength <= Segment_Length){
                this.space =  true;
            }//if
            return this.space;
        }//isSpace

        //Determines wehere each program will be placed in any particular segment
        public segmentAllocation(){
            var index = 0;
            //finds space for an available program
            while(_RunningPrograms[index] && index < 3 ){
                index++;
            }//for
            
            //Puts up a flag indicating that the code is running
            if(index < 3)
                _RunningPrograms[index] = true;
                
            //Returns the index of the availble program
            //  Will return the index 3 or above if there is no space
            return index;

        }//segmentAllocationss
    }//MemoryManager
}//TSOS