var TSOS;
(function (TSOS) {
    class Swapper {
        constructor(fileID = _FileID, fileName = "unNamed", data = "") {
            this.fileID = fileID;
            this.fileName = fileName;
            this.data = data;
        } //constructor
        init() {
        } //init
        //Reads data
        getData() {
            return this.data;
        } //getData
        //Writes data
        setData(newData) {
            this.data = newData;
        } //data
    } //File
    TSOS.Swapper = Swapper;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=swapper.js.map