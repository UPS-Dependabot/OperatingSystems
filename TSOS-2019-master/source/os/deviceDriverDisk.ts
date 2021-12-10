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
            if(this.formatted){
                var t = 0;
                var s = 0;
                var b = 0;
                //Find location to put the file

                while(_Disk.sectorNum > s && !isCreated){
                    while( _Disk.blockNum > b && !isCreated){
                        if(s == 0 && b == 0){
                            //ignore we do not want to overwrite the block into the master boot leg
                        }
                        else{
                            var id = 0 + ":" + s + ":" + b; 
                            var newNameData = "";
                            
                            //the first character is the isavailable bit
                            var block = sessionStorage.getItem(id);
                            //the first character is the Availble bit
                            if(block[0] == "0"){
                                block  = this.stringModifier(block, 0, '1'); //flips the availble bit in the string
                                var pointerChars = this.findPointer();      //find the pointer
                                for(var i  = 0; pointerChars.length > i; i++){
                                    block  = this.stringModifier(block, i+1 ,pointerChars[i]); //adds the pointer into the block. Replaces bits 1, 2, 3 
                                }//for
                                newNameData =  this.asciiHex(filename); //converts the file name to ascii

                                //This discusting line is:
                                //   1 - combination of the unavailble bit and pointer (in this case we will always grab the first four bits)
                                //   2 -  name of new file
                                //   3 - rest of the data from the block (starts after the length of the newData + starting point of the lat piece of code) 
                                var newData = block.substring(0,4)+newNameData+block.substring(4+newNameData.length,block.length);

                                sessionStorage.setItem(id, newData); 
                                TSOS.Control.updateDiskDriver(id, newData); //adds the hex data for the fileformat into the Disk Drive
                                isCreated = true;
                            }//if
                        }//else
                        b++;
                    }//while block
                    s++;
                }//while sector

            }//if
            else{
                //Inform user that they need to the format the file in the CLI
            }//else

            return isCreated;

        }//create

        public asciiHex(input){
            var hexString = "";
            for(var i = 0; i < String(input).length; i++){//reconizes the input as a single input rather than a character so  I manually converted to a string
                var hexChar = String (input).charCodeAt(i).toString(16);
                hexString += hexChar;
            }//for
            return hexString;
        }//asciiHex

        //finds the pointer we need to assign 
        public findPointer(){
            var id = "";
            var pointerString = "";
            var tempData = "";
            for(var t = 1; t < _Disk.trackNum; t++){
                for(var s = 0; s < _Disk.sectorNum; s++){
                    for(var b = 0; b < _Disk.blockNum; b++){
                        id = t+":"+s+":"+b; //fetches the id
                        tempData = sessionStorage.getItem(id);
                        if(tempData[0] == "0"){ //find if the file is free
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

        
    }
}
