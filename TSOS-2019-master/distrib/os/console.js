/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "", bufferInput = new Array(), bufferIndex = 0) {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.bufferInput = bufferInput;
            this.bufferIndex = bufferIndex;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    //array that keeps track of the user input commands
                    this.bufferInput.push(this.buffer);
                    //resets the buffer Index to the newest command inserted each time the user presses enter
                    this.bufferIndex = this.bufferInput.length - 1;
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { //backspace
                    this.backspace();
                } //if
                else if (chr === String.fromCharCode(9)) { // tab
                    this.tab();
                } //if
                //cannot use String.fromCharCode() because there is no string value associated with the upArrow key
                else if (chr == "upArrow" || chr == "downArrow") { //up arrow key
                    this.recall(chr);
                }
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
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                for (var i in text) {
                    this.putCharacter(text[i]);
                } //for
            }
        }
        putCharacter(char) {
            //print one character at a time
            //check if it hits the edge 
            //  if it does go to the next line
            if (this.currentXPosition > _Canvas.width - 10) {
                this.advanceLine();
            }
            if (char !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, char);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, char);
                this.currentXPosition = this.currentXPosition + offset;
            }
        } //putCharacter
        advanceLine() {
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
            if (this.currentYPosition + lineAdvance > _Canvas.height) {
                //grabs the current state of the canvas
                var canvasImg = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                //clears the screen
                this.clearScreen();
                //Inserts the the canvas's current state above where the user will input their next line 
                _DrawingContext.putImageData(canvasImg, 0, -lineAdvance);
            } //if
            else { //Normal Scrollling
                this.currentYPosition += lineAdvance;
            } //else
        } //advanceLine
        backspace() {
            if (this.buffer.length > 0) { //if there is something in the buffer
                //get the last character typed and erase it from the canvas
                let lastChar = this.buffer[this.buffer.length - 1];
                //Cursor is moved back by the width of the character that was just deleted
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChar);
                this.currentXPosition = this.currentXPosition - offset;
                var height = _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
                // remove char function
                //.clearRect(x, y + fontheight, width, height)
                //On the CLI a rectangle erases the character that is being deleted (bumpped up the y position by 5 to ensure that the whole character gets deleted)
                _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition + 5, offset, -1 * height);
                //remove the last letter in the buffer
                this.buffer = this.buffer.slice(0, -1);
            } //if
        } //backspace
        tab() {
            var indexPC = 0;
            var potentialCommands = [];
            for (var i in _OsShell.commandList) {
                //Compares the current string in the buffer against each command in the list
                //Slices the name of the command from 0 to the current length of the string in the buffer to see if it matches the user input
                if (this.buffer == _OsShell.commandList[i].command.substring(0, this.buffer.length)) {
                    potentialCommands[indexPC] = _OsShell.commandList[i].command;
                    indexPC++;
                } //if
            } //for
            //The input matches none of the commands
            if (indexPC == 0) {
                //Do nothing
            }
            else if (indexPC == 1) { //When there is only a single match the rest of the command is automatically inputted into the CLI
                //inputs the rest of the command into the canvas
                this.putText(potentialCommands[0].substring(this.buffer.length, potentialCommands[0].length));
                //inserts the command into the buffer
                this.buffer = potentialCommands[0];
            }
            else { //Prints out potential commands that the user may want to input
                this.advanceLine();
                //j starts at one and the length of commands is incremented by one, so the first command will not immediatley print
                //and advance to the next line.
                for (var j = 1; potentialCommands.length + 1 > j; j++) {
                    this.putText(" " + potentialCommands[j - 1] + " ");
                    if (j % 8 == 0) { //goes to the next line so the user can see all of the options
                        this.advanceLine();
                    } //if
                } //for
                //Pushes user to the next line after printing out text
                this.advanceLine();
                //Need to clear the buffer or else the previous line will still be saved in the buffer
                this.buffer = "";
                //adds the prompt (defined in the shell)
                this.putText(_OsShell.promptStr);
            } //else
        } //tab
        recall(arrow) {
            //resets the position
            this.currentXPosition = 0;
            var promptWidth;
            //Prompt width dynamic :)
            promptWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, String(_OsShell.promptStr));
            this.putText(_OsShell.promptStr);
            //sets the buffer to the last command entered in the stack
            this.buffer = this.bufferInput[this.bufferIndex];
            //.clearRect(x, y + fontheight, width, height) 
            //promptWidth
            _DrawingContext.clearRect(promptWidth, this.currentYPosition + 10, 500, -1 * 25);
            //Write previous input back into the cli                             
            this.putText(String(this.bufferInput[this.bufferIndex]));
            //BufferIndex never goes out of bounds of the bufferIndex
            switch (arrow) {
                case "upArrow":
                    if (this.bufferIndex > 0)
                        this.bufferIndex--;
                    break;
                case "downArrow":
                    if (this.bufferIndex < this.bufferInput.length - 1)
                        this.bufferIndex++;
                    break;
            } //switch
        } //recall
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map