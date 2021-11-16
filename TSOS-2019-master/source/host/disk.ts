module TSOS {
    export class Disk{

        constructor(
            public trackNum: number = 4,
            public sectorNum: number = 8,
            public blockNum: number = 8,
            public dataSize: number = 60
            ) 
            {
        }//constructor

        //Inits all block within each track and sector to a blank state
        public init(): void{
            for(var t = 0; this.trackNum > t; t++){
                for(var s = 0; this.sectorNum > s; s++){
                    for(var b = 0; this.blockNum > b; b++){
                        var id = t + ":" + s + ":" + b; 
                        var diskData = new Array();
                        for(var i = 0; i < this.dataSize; i++){
                            diskData.push("00");
                        }//for
                        var block = {
                            isAvailable: "0",
                            pointer: "0:0:0",
                            data: diskData
                        };
                        sessionStorage.setItem(id, JSON.stringify(block));
                    }//for
                }//for
            }//for tracks
        }//init
        
    }//Disk
}//TSOS
