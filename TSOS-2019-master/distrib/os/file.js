var TSOS;
(function (TSOS) {
    class File {
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
    TSOS.File = File;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=file.js.map