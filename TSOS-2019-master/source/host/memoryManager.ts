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
    }//MemoryManager
}//TSOS