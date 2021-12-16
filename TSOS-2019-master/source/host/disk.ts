module TSOS {
    export class Disk{

        constructor(
            public trackNum: number = 4,
            public sectorNum: number = 8,
            public blockNum: number = 8,
            public dataSize: number = 60 //Data Size in file
            ) 
            {
        }//constructor

        //Inits all block within each track and sector to a blank state
        public init(): void{
            for(var t = 0; this.trackNum > t; t++){
                for(var s = 0; this.sectorNum > s; s++){
                    for(var b = 0; this.blockNum > b; b++){
                        var inUse = "0";                    
                        var id = t + ":" + s + ":" + b; 
                        var diskData = "";

                        diskData.concat(inUse); 
                        
                        for(var i = 0; i < this.dataSize; i++){
                            diskData = diskData+"00";
                        }//for

                        sessionStorage.setItem(id, diskData);
                        TSOS.Control.createDiskDriver(id, diskData);
                    }//for
                }//for
            }//for tracks
        }//init
        
    }//Disk
}//TSOS
