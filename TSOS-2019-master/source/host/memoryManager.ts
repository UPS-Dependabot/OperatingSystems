module TSOS{
    export class MemoryManager{
        constructor(
            public space  = false
            ) {
        }//constructorP

        public init(): void{

        }//init
        
        //Determines wether or not there is space in memory
        public isSpace(program){
            if(program.length <= Segment_Length){
                this.space =  true;
            }//if
            return this.space;
        }//isSpace
    }//MemoryManager
}//TSOS