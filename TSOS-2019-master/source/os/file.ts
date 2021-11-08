module TSOS {
    export class File{

        constructor(
            public fileID: number =  _FileID,
            public fileName = "unNamed",
            public data = ""
            ) 
            {
        }//constructor

        public init(): void{

        }//init

        //Reads data
        public getData(){
            return this.data;
        }//getData

        //Writes data
        public setData(newData){
            this.data = newData;
        }//data
        
    }//File
}//TSOS
