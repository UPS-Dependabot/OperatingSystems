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
            if(this.format){
                var t = 0;
                var s = 0;
                var b = 0;
                //Find location to put the file
                while (_Disk.trackNum > t && !isCreated){
                    while(_Disk.sectorNum > s && !isCreated){
                        while( _Disk.blockNum > b && !isCreated){
                            var id = t + ":" + s + ":" + b; 
                            var inUse = "1";
                            var block = {
                                isAvailable: inUse,
                                pointer: id,
                                data: filename
                            };
                            if(block.isAvailable == "0"){
                                sessionStorage.setItem(id, JSON.stringify(block));
                                TSOS.Control.updateDiskDriver(id, filename); //adds the hex data for the fileformat into the Disk Drive
                                isCreated = true;
                            }//if
                            b++;
                        }//while block
                        s++;
                    }//while sector
                    t++;
                }//while track
            }//if
            else{
                //Inform user that they need to the format the file in the CLI
            }//else

            return isCreated;

        }

        
    }
}
