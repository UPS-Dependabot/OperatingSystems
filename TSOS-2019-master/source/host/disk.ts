module TSOS {
    export class Disk{

        constructor(
            public trackNum: number = 4,
            public sectorNum: number = 8,
            public blockNum: number = 8,
            public dataSize: number = 61 //Data Size is 61 because the first byte is the inUse
            ) 
            {
        }//constructor

        //Inits all block within each track and sector to a blank state
        public init(): void{
            for(var t = 0; this.trackNum > t; t++){
                for(var s = 0; this.sectorNum > s; s++){
                    for(var b = 0; this.blockNum > b; b++){
                        var inUse = "00";                    
                        var id = t + ":" + s + ":" + b; 
                        var diskData = new Array();
                        diskData.push(inUse); 
                        for(var i = 0; i < this.dataSize; i++){
                            diskData.push("00");
                        }//for
                        var block = {
                            isAvailable: inUse,
                            pointer: id,
                            data: diskData
                        };
                        sessionStorage.setItem(id, JSON.stringify(block));
                        TSOS.Control.updateDiskDriver(id, diskData);
                    }//for
                }//for
            }//for tracks
        }//init
        
    }//Disk
}//TSOS
