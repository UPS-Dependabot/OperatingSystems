/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else if(chr === String.fromCharCode(8)){ //user clicks backspace
                    this.backspace();
                }//if
                else if(chr === String.fromCharCode(9)){//user clicks tab
                    this.tab();
                }//if
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }

        public putText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }
        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            
            var lineAdvance = _DefaultFontSize + 
            _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
            _FontHeightMargin;
            
            // TODO: Handled scrolling. (iProject 1) :)

            //Scroll when at the bottom of the canvas
            if(this.currentYPosition + lineAdvance > _Canvas.height){
                //grabs the current state of the canvas
                var canvasImg = _DrawingContext.getImageData(0,0,_Canvas.width,_Canvas.height);
                //clears the screen
                this.clearScreen();
                //Inserts the the canvas's current state above where the user will input their next line 
                _DrawingContext.putImageData(canvasImg, 0, -lineAdvance);
            }//if
            else{
                this.currentYPosition += lineAdvance;
            }//else
            
        }//advanceLine

        public backspace(): void{

            if (this.buffer.length > 0) { //if there is something in the buffer
                //get the last character typed and erase it from the canvas
                let lastChar = this.buffer[this.buffer.length - 1];
                
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChar);

                this.currentXPosition = this.currentXPosition - offset;

                var height = _DefaultFontSize + 
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
                // remove char function
                //.clearRect(x, y + fontheight, width, height)
                _DrawingContext.clearRect(this.currentXPosition,this.currentYPosition, offset, -1 * height);

                //remove the last letter in the buffer
                this.buffer = this.buffer.slice(0, -1);
            }//if
        }//backspace

        public tab():void{
            for (var i in _OsShell.commandList) {
                //Compares the current string in the buffer against each command in the list
                //slices the name of the command from 0 to the current length of the string in the buffer
                if(this.buffer == _OsShell.commandList[i].substring(0,this.buffer.length)){
                    this.buffer = _OsShell.commandList[i];
                }//if

            }//for
        }//tab
    }
 }