var TSOS;
(function (TSOS) {
    class Disk {
        constructor(trackNum = 4, sectorNum = 8, blockNum = 8, dataSize = 60 //Data Size in file
        ) {
            this.trackNum = trackNum;
            this.sectorNum = sectorNum;
            this.blockNum = blockNum;
            this.dataSize = dataSize;
        } //constructor
        //Inits all block within each track and sector to a blank state
        init() {
            for (var t = 0; this.trackNum > t; t++) {
                for (var s = 0; this.sectorNum > s; s++) {
                    for (var b = 0; this.blockNum > b; b++) {
                        var inUse = "0";
                        var id = t + ":" + s + ":" + b;
                        var diskData = "";
                        diskData.concat(inUse);
                        for (var i = 0; i < this.dataSize; i++) {
                            diskData = diskData + "00";
                        } //for
                        sessionStorage.setItem(id, diskData);
                        TSOS.Control.createDiskDriver(id, diskData);
                    } //for
                } //for
            } //for tracks
        } //init
    } //Disk
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=disk.js.map