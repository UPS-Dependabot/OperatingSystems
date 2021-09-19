/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) { 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } 
            else if( (keyCode >= 48 && keyCode <= 57) && isShifted == true)
            {// special shifted characters (0 - 9 on the top of the keyboard)
                switch (keyCode) 
                {
                    case 48:
                        chr = ")";
                        break;
                    case  49:
                        chr = "!";
                        break;
                    case 50:
                        chr = "@";
                        break;
                    case 51:
                        chr = "#";
                        break;
                    case 52:
                        chr = "$";
                        break;
                    case 53:
                        chr = "%";
                        break;
                    case 54:
                        chr = "^";
                        break;
                    case 55:
                        chr = "&";
                        break;
                    case 56:
                        chr = "*";
                        break;  
                    case 57:
                        chr = "(";
                        break;
                }//switch
                _KernelInputQueue.enqueue(chr);
            }//if Shifted KeyCodes 48 - 57
            //BAC TODO 
            else if((keyCode >= 186 && keyCode <=192) || keyCode >= 219 && keyCode <= 222){
                if(isShifted){
                    switch(keyCode){
                        case 186:
                            chr = ":";
                            break;
                        case 187:
                            chr = "+";
                            break;
                        case 188:
                            chr = "<";
                            break;
                        case 189:
                            chr = "_";
                            break;
                        case 190:
                            chr = ">";
                            break;
                        case 191:
                            chr = "?";
                            break;
                        case 192:
                            chr = "~";
                            break;
                        case 219:
                            chr = "{"
                            break;
                        case 220:
                            chr = "|"; 
                            break;
                        case 221:
                            chr = "}";
                            break;
                        case 222:
                            chr = "\"";//this is for " we need to escape out of it so it is reconized in the program
                            break;
                    }//switch
                }//if shift
                else{
                    switch (keyCode){
                        case 186:
                            chr = ";";
                            break;
                        case 187:
                            chr = "=";
                            break;
                        case 188:
                            chr = ",";
                            break;
                        case 189:
                            chr = "-";
                            break;
                        case 190:
                            chr = ".";
                            break;
                        case 191:
                            chr = "/"
                            break;
                        case 192:
                            chr = "`";
                            break;
                        case 219:
                            chr = "[";
                            break;
                        case 220:
                            chr = "\/"; //this is for / we need to escape out of it so it is reconized in the program
                            break;
                        case 221:
                            chr = "]";
                            break;
                        case 222:
                            chr = "'";
                            break;
                        
                    }//switch
                }//else
                
                _KernelInputQueue.enqueue(chr);
        }//if
            else if(keyCode == 38){//upArrow
                chr = "upArrow";
                _KernelInputQueue.enqueue(chr);
            }//if upArrow
            else if(keyCode == 40){//downArrow
                chr = "downArrow";
                _KernelInputQueue.enqueue(chr);
            }//else
            else if (((keyCode >= 48) && (keyCode <= 57))   ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)                     ||   // enter
                        (keyCode == 8)                      ||   // backspace
                        (keyCode == 9)                           //tab
                       ){                       
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }//if
        }//krnKbdDispatchKeyPress
    }
}
