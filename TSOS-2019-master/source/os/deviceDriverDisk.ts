module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {

        constructor(
           public formatted: boolean = false
        ) {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnDiskDriverEntry;

            //this.isr = this.swapper;
            //irs Interput Service Routine
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
        }

        //Prepares the hard drive
        public format(){ 
            if(!this.formatted){
                //implement -q (quick) -f (full) here
                //This is Full implementing Full below
                _Disk.init();
                //this is the implementation for full
                this.formatted = true;
            }//if               
        }//format

        //Creates the file
        public create(filename){
            var isCreated  = false;
            var newNameData =  this.asciiHex(filename); //converts the file name to ascii
            // newData must fit into memory block
            if(this.formatted  && !this.duplicateFile(filename) && newNameData.length <= 120){
                var t = 0;
                var s = 0;
                var b = 0;
                //Find location to put the file
                while(_Disk.sectorNum > s && !isCreated){
                    while( _Disk.blockNum > b && !isCreated){
                        if(s == 0 && b == 0){
                            //ignore 
                            //We do not want to overwrite the block into the master boot leg
                        }//if
                        else{
                            var id = 0 + ":" + s + ":" + b;              
                            var block = sessionStorage.getItem(id);
                            //the first character is the Availble bit
                            if(block[0] == "0"){
                                block  = this.stringModifier(block, 0, '1'); //flips the availble bit in the string
                                var pointerChars = this.findPointer();      //find the pointer
                                for(var i  = 0; pointerChars.length > i; i++){
                                    block  = this.stringModifier(block, i+1 ,pointerChars[i]); //adds the pointer into the block. Replaces bits 1, 2, 3 
                                }//for

                                //This discusting line is:
                                //   1 - combination of the unavailble bit and pointer (in this case we will always grab the first four bits)
                                //   2 -  name of new file
                                //   3 - rest of the data from the block (starts after the length of the newData + starting point of the last piece of code) 
                                var newData = block.substring(0,4)+newNameData+block.substring(4+newNameData.length,block.length);

                                //Update Disk
                                sessionStorage.setItem(id, newData); 
                                TSOS.Control.updateDiskDriver(id, newData); 
                                isCreated = true;
                            }//if
                        }//else
                        b++;
                    }//while block
                    s++;
                }//while sector

            }//if
            return isCreated;

        }//create

        //Converts From  ASCII to Hex
        public asciiHex(input){
            var hexString = "";
            for(var i = 0; i < String(input).length; i++){//reconizes the input as a single input rather than a character so  I manually converted to a string
                var hexChar = String (input).charCodeAt(i).toString(16);
                hexString += hexChar;
            }//for
            return hexString;
        }//asciiHex

        
        public hexAscii(hexx) {
            var hex = hexx.toString();
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        }

        //finds the pointer we need to assign 
        public findPointer(){
            var id = "";
            var pointerString = "";
            var tempData = "";
            for(var t = 1; t < _Disk.trackNum; t++){
                for(var s = 0; s < _Disk.sectorNum; s++){
                    for(var b = 0; b < _Disk.blockNum; b++){
                        id = t+":"+s+":"+b; 
                        tempData = sessionStorage.getItem(id);
                        if(tempData[0] == "0"){ //find if the file is free
                            var newData= this.stringModifier(tempData, 0, '1');
                            sessionStorage.setItem(id, newData);
                            TSOS.Control.updateDiskDriver(id, newData); //updates the isavailble bit on the data block pointer in track 1 or 2
                            pointerString =+ t.toString() + s.toString() + b.toString();
                            return pointerString.split(''); //returns the the id as an array of chars
                        }//if
                    }//for
                }//for
            }//for
        }//find pointer
        

        public stringModifier(input,index,char) {
            if(index > input.length-1){
                return input;
            }
            return input.substring(0,index) + char + input.substring(index+1);
        }//stringModifier

        public duplicateFile(filename){
            //loop through
            for(var t = 0; t < _Disk.trackNum; t++){
                for(var s = 0; s < _Disk.sectorNum; s++){
                    for(var b = 0; b < _Disk.blockNum; b++){
                        var id = t+":"+s+":"+b; //fetches the id
                        var tempData = sessionStorage.getItem(id);
                        if(tempData[0] == "1"){ //find if the file is free
                             //parse file
                             var filehex = this.asciiHex(filename);

                             var splicedWord = tempData.substring(4); //skip the availble bit and pointer
                             var parsedData = splicedWord.split("00")[0]; //get rid of the zeros (the first array holds your stuff)
                             
                             var counter = 0; //keeps track of the amount of times there is a match between the dataHex and the parsedDate
                            //compare each hex code
                            for(var i = 0; filehex.length > i ; i++){
                                //parseData 
                                if (filehex[i] == parsedData[i]){//finds if each character is equal to the other
                                    counter++;
                                }//if
                            }//for
                            if(counter == filehex.length){ 
                                return true; //The filename is a duplicate so we do not want to go foward
                            }//if
                        }//if
                    }//for
                }//for
            }//for
            return false;
        }//duplicateFile
        
        // Writes new data to the disk
        //
        // isRole represents when a file is either being written from the write command (via the shell) or coming in via memory when is gets swapped in
        //  True - from memory, False - form the shell
        public write(filename, data,  isRole){
            //Convert data and filename to hex (ascii returns as an array)
            //Then convert the arrays to strings 

            // Only strip the quotes when the user enters the data from the shell
            if(!isRole){      
                //strip off \" \" encapuslating the data
                //example: data = \"asdf\"
                //      starting index " = 1 
                //      ending index \ = data.length -1
                //          subtring's end param ends on the \ but does not include it
                data = data.substring(1, data.length-1);
            }//if
            
            var filehex = this.asciiHex(filename);
            var hexdata = this.asciiHex(data);

            //calcualtes the number of tsbs that the file data will occupy
            var tsbToOccupy = 1;
            var dataPieces = new Array(tsbToOccupy);

            //We want to round up so we can collect all of the data in the tsb
            //  if we round down we would cut off data
            tsbToOccupy = Math.ceil(hexdata.length/120); 
            if(tsbToOccupy == 0){
                tsbToOccupy = 1;
            }//if

            var start = 0;
            var end = 120;
            //parse data into multiple sections 
            for(var i = 0; i < tsbToOccupy; i++){
                dataPieces[i] = hexdata.substring(start, end);
                start += _Disk.dataSize*2; //double the size of the disk data because one byte is 2 zeros (00)
                end += _Disk.dataSize*2;
            }//for

            //Check if we have many TSBs avaible for the array
            //Find the free pointers that we need            
            if(this.isAvaibleSpace(tsbToOccupy) != null){
                //  Searach for file with the filename 
                //  Filenames are all located in the track 0
                for(var s = 0; _Disk.sectorNum > s; s++){
                    for(var b = 0; _Disk.blockNum > b; b++){
                        var id = 0+":"+s+":"+b; //fetches the id
                        var tempData = sessionStorage.getItem(id);
                        if(tempData[0] == "1"){ //find if the file is being used

                            var splicedWord = tempData.substring(4); //skip the availble bit and pointer
                            var parsedData = splicedWord.split("00")[0]; //get rid of the zeros (the first array holds your stuff)

                            //Split may take off a zero that is apart of the hex at the end of the string
                            //  This conditional adds the zero back into the string if the character is lost
                            if(parsedData.length % 2 != 0){
                                parsedData += "0";
                            }//if

                            var counter = 0; //keeps track of the amount of times there is a match between the dataHex and the parsedDate
                            //compare each hex code
                            for(var i = 0; filehex.length > i ; i++){
                                //parseData 
                                if (filehex[i] == parsedData[i]){//finds if each character is equal to the other
                                    counter++;
                                }//if
                            }//for
                            if(counter == filehex.length){ 
                                //Get pointer from the value
                                var pointerInData = tempData.substring(1,4); 
                                //Modify string to add :s in between each number so the key will be reconized 
                                //  in the session storage
                                var trueKey = this.stringToKey(pointerInData);  //first place we store to for the file contents
                                var datablock;
                                var availblebit = "1";

                                var availbleIds = this.isAvaibleSpace(tsbToOccupy);

                                if(tsbToOccupy > 1){
                                    //get next pointer from pointer array
                                    for(var i = 0; availbleIds.length > i; i++){
                                        if(availbleIds.length-1 != i){
                                            //set the current TSB's pointer to that array
                                            //write into the next block
                                            //repeat until done, fill last one with 0s as needed  
                                            if(i == 0){  
                                                //The first available id represents the first location that will be saved to 
                                                datablock = availblebit + this.keyToString(availbleIds[i]) + dataPieces[i];
                                                //The true key is the first loaction we are going to save to on the disk
                                                sessionStorage.setItem(trueKey, datablock);
                                                TSOS.Control.updateDiskDriver(trueKey, datablock);
                                            }//if
                                           else{//updates the key with the last key
                                                //avaibleid[i] points to the next id
                                                datablock = availblebit+this.keyToString(String(availbleIds[i]))+ dataPieces[i];
                                                //We want to set it to available[i -1] because that represents the next tsb we will set to
                                                sessionStorage.setItem(availbleIds[i-1], datablock);  
                                                TSOS.Control.updateDiskDriver(availbleIds[i-1], datablock);
                                            }//else      
                                        }//if
                                        else{
                                            //There is no pointer for the last datablock
                                            datablock = availblebit+"000"+ this.appendZeros(dataPieces[i]);
                                            //Write into block
                                            sessionStorage.setItem(availbleIds[i-1], datablock);
                                            TSOS.Control.updateDiskDriver(availbleIds[i-1], datablock);
                                        }//else
                                    }//for
                                }//if
                                else{//entire file is only written into a single block
                                    datablock = availblebit+ "000" + this.appendZeros(dataPieces[0]);
                                    //Write into first block  
                                    //  points to the filename location
                                    sessionStorage.setItem(trueKey, datablock);
                                    TSOS.Control.updateDiskDriver(trueKey, datablock);
                                }//else
                                return true; //Writes data to the filename
                            }//if
                        }//if
                    }//for
                }//for
            }//if  
            else{
                return false;
            }//else
        }//write

        public read(filename){
            //find filename
            //loop through
            var readData = "";

            for(var t = 0; t < _Disk.trackNum; t++){
                for(var s = 0; s < _Disk.sectorNum; s++){
                    for(var b = 0; b < _Disk.blockNum; b++){
                        var id = t+":"+s+":"+b; //fetches the id
                        var tempData = sessionStorage.getItem(id);
                        if(tempData[0] == "1"){ //find if the file is free
                             //parse file
                             var filehex = this.asciiHex(filename);

                             var splicedWord = tempData.substring(4); //skip the availble bit and pointer
                             var parsedData = splicedWord.split("00")[0]; //get rid of the zeros (the first array holds your stuff)
                             var parsedPointer = tempData.substring(1, 4);

                             var counter = 0; //keeps track of the amount of times there is a match between the dataHex and the parsedDate
                            //compare each hex code
                            for(var i = 0; filehex.length > i ; i++){
                                //parseData 
                                if (filehex[i] == parsedData[i]){//finds if each character is equal to the other
                                    counter++;
                                }//if
                            }//for
                            if(counter == filehex.length){ //We found the file
                                var formatedKey = "";
                                var currData = "";
                                var parseCurrData = "";

                                //Fetches all of the data from other blocks that are chained onto the file
                                while(parsedPointer !== "000"){
                                    formatedKey = this.stringToKey(parsedPointer);
                                    
                                    currData = sessionStorage.getItem(formatedKey);
                                    parsedPointer = currData.substring(1, 4);
           
                                    //skip the availble bit and pointer
                                    //get rid of the zeros (the first array holds your stuff)
                                    parseCurrData = currData.substring(4).split("00")[0]; 
       
                                    //The split function will remove all zeros but if the last character of
                                    //  our file data is a zero it will get chopped off. 
                                    //  This ensures do not loose that last bit of data
                                    if(parseCurrData.length % 2 != 0 && parsedPointer == "000"){
                                        parseCurrData += "0";
                                    }//if

                                    readData = readData + parseCurrData;
                                }//while

                                //return readData and convert it back from hex to ASCII
                                return this.hexAscii(readData); 
                            }//if
                        }//if
                    }//for
                }//for
            }//for
            return null;
        }//read

        //Deletes a file from disk based on the filename
        delete(filename){
            //loop through
            for(var t = 0; t < _Disk.trackNum; t++){
                for(var s = 0; s < _Disk.sectorNum; s++){
                    for(var b = 0; b < _Disk.blockNum; b++){
                        var id = t+":"+s+":"+b; //fetches the id
                        var tempData = sessionStorage.getItem(id);
                        if(tempData[0] == "1"){ //find if the file is free
                                //parse file
                                var filehex = this.asciiHex(filename);

                                var splicedWord = tempData.substring(4); //skip the availble bit and pointer
                                var parsedData = splicedWord.split("00")[0]; //get rid of the zeros (the first array holds your stuff)
                                var parsedPointer = tempData.substring(1, 4);

                                var counter = 0; //keeps track of the amount of times there is a match between the dataHex and the parsedDate
                            //compare each hex code
                            for(var i = 0; filehex.length > i ; i++){
                                //parseData 
                                if (filehex[i] == parsedData[i]){//finds if each character is equal to the other
                                    counter++;
                                }//if
                            }//for
                            if(counter == filehex.length){ 
                                var currDataBlock = "";
                                //clear out filename block
                                sessionStorage.setItem(id,this.getClearBlock());
                                TSOS.Control.updateDiskDriver(id,this.getClearBlock());

                                var tempPointer = "";
                                //deletes the entire file on the chain
                               while(parsedPointer != "000"){
                                    //ensures the pointer is not lost when the next block of data is cleared
                                    tempPointer = sessionStorage.getItem(this.stringToKey(parsedPointer)).substring(1,4);
                                    //zeros out the current block
                                    sessionStorage.setItem(this.stringToKey(parsedPointer),this.getClearBlock());
                                    TSOS.Control.updateDiskDriver(this.stringToKey(parsedPointer),this.getClearBlock());
                                    //fetches the next pointer in the chain
                                    parsedPointer = tempPointer;
                               }//while
                               //inform user that the file has been deleted
                               return true;
                            }//if
                        }//if
                    }//for
                }//for
            }//for
            return false;
        }//delete

        //creates a zeroed out datablock
        public getClearBlock (){
            var clearBlock  = "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
            return clearBlock;
        }//getClearBlock

        //Appends zeros to after the data on the block
        //  Only used for the last block in the chain
        //  param dataPartition is a string
        public appendZeros (dataPartition){
            //total zeros are 120 and the dataParition in hex
            //  subtracts the 3 to compensate for the pointer 
            var zerosToAppend = _Disk.dataSize*2 - dataPartition.length -3; 
            var lastDataPiece = dataPartition; 
            for(var i = 0; zerosToAppend > i; i++){
                lastDataPiece = lastDataPiece + "0";
            }//for
            return lastDataPiece;
        }//appendZeros

        //converts string to a key for session storage
        //ex: 100 --> 1:0:0
        public stringToKey(blandString){
             var keyArr = blandString.split('');
             var key = "";
             for(var i = 0; keyArr.length > i; i++){
                key += keyArr[i];
                if(keyArr.length - 1 > i){//doesn't append the colon on the last iteration
                    key += ":";
                }//if
             }//for
             return key;
        }//stringToKey

        //converts formatted key to string
        public keyToString(formattedKey){
            var blandArr = formattedKey.split(':');
            var blandString = "";
             for(var i = 0; blandArr.length > i; i++){
                blandString = blandString+blandArr[i];
             }//for
             return blandString;
        }//keyToString

        //finds the pointer we need to assign 
        public isAvaibleSpace(tsbsNeeded){
            var id = "";
            var pointerString = "";
            var tempData = "";
            var ids = new Array();
            
            var avaibleTSB = 0; //tracks the number of availbe tsbs
            for(var t = 1; t < _Disk.trackNum; t++){
                for(var s = 0; s < _Disk.sectorNum; s++){
                    for(var b = 0; b < _Disk.blockNum; b++){
                        id = t+":"+s+":"+b; //fetches the id
                        tempData = sessionStorage.getItem(id);
                        if(tempData[0] == "0"){ //find if the file is free
                            ids.push(id);//adds the id
                            avaibleTSB++;
                            if(avaibleTSB >= tsbsNeeded){  
                                return ids; //returns the array of ids
                            }//if
                        }//if
                    }//for
                }//for
            }//for
            return null;
        }//isAvaibleSpace

        public list(){
            var names = new Array();
            var s = 0;
            var b = 0;
                //Find location to put the file
                while(_Disk.sectorNum > s ){
                    while( _Disk.blockNum > b ){
                        if(s == 0 && b == 0){
                            //ignore 
                            //We do not want to overwrite the block into the master boot leg
                        }//if
                        else{
                            var id = 0 + ":" + s + ":" + b;              
                            var block = sessionStorage.getItem(id);
                            //the first character is the Availble bit
                            if(block[0] == "1"){
                               var hexName = block.substring(4).split("00")[0];
                               var name = this.hexAscii(hexName)
                               //filters out all of the automated files in the disk and hidden files
                               if(name.substring(0, name.length -1) != "*file_" && name[0] != "."){
                                    names.push(name);
                               }//if
                            }//if
                        }//else
                        b++;
                    }//while block
                    s++;
                }//while sector
                return names;
        }//list

        copy(currFileName, newFileName){
            var isCopy = false;
            var s = 0;
            var b = 0;
                //Find location to put the file
                while(_Disk.sectorNum > s && !isCopy){
                    while( _Disk.blockNum > b && !isCopy ){
                        if(s == 0 && b == 0){
                            //ignore 
                            //We do not want to overwrite the block into the master boot leg
                        }//if
                        else{
                            var id = 0 + ":" + s + ":" + b;              
                            var block = sessionStorage.getItem(id);
                            //the first character is the Availble bit
                            if(block[0] == "1"){
                                //Look for the current file name in the disk
                               var hexName = block.substring(4).split("00")[0];
                               var name = this.hexAscii(hexName)
                               if(name == currFileName){
                                   //creates the copied file and writes the same memory into disk
                                    this.create(newFileName);
                                    var copyData = "\""+this.read(currFileName)+"\"";
                                    this.write(newFileName,copyData, false);
                                    isCopy = true;
                               }//if
                            }//if
                        }//else
                        b++;
                    }//while block
                    s++;
                }//while sector
            return isCopy;
        }//copy

        rename(currName, newName){
            var isRename = false;
            var s = 0;
            var b = 0;
                //Find location to put the file
                while(_Disk.sectorNum > s && !isRename){
                    while( _Disk.blockNum > b && !isRename ){
                        if(s == 0 && b == 0){
                            //ignore 
                            //We do not want to overwrite the block into the master boot leg
                        }//if
                        else{
                            var id = 0 + ":" + s + ":" + b;              
                            var block = sessionStorage.getItem(id);
                            //the first character is the Availble bit
                            if(block[0] == "1"){
                                //Look for the current file name in the disk
                               var hexName = block.substring(4).split("00")[0];
                               var name = this.hexAscii(hexName);
                               if(name == currName){
                                    //Changes the name in the disk
                                    var firstBits = block.substring(0,4); 
                                    var dataName = firstBits+this.appendZeros(this.asciiHex(newName));
                                    sessionStorage.setItem(id, dataName);
                                    TSOS.Control.updateDiskDriver(id, dataName);
                                    isRename = true;
                               }//if
                            }//if
                        }//else
                        b++;
                    }//while block
                    s++;
                }//while sector
            return isRename;
        }//rename
    }//DeviceDriverDisk
}
