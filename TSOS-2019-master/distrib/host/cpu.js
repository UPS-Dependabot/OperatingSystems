/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Cpu {
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        getPC() {
            return this.PC;
        }
        setPC(newPC) {
            this.PC = newPC;
        }
        setAcc(newAcc) {
            this.Acc = newAcc;
        }
        getAcc() {
            return this.Acc;
        }
        setXReg(newX) {
            this.Xreg = newX;
        }
        getXReg() {
            return this.Xreg;
        }
        setYReg(newY) {
            this.Yreg = newY;
        }
        getYReg() {
            return this.Yreg;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.isExecuting) {
                for (var optCode in _Mem.Mem) {
                    this.fetchOpCode(_Mem.Mem[optCode], optCode);
                } //for
            } //if
        } //cycle
        //finds the Op Code associated with the hex nnumbers
        fetchOpCode(hex, memIndex) {
            switch (hex) {
                case "A9":
                    this.loadConstant(memIndex);
                    this.PC++;
                    break;
                case "AD":
                    this.loadMemory(memIndex);
                    this.PC++;
                    break;
                case "8D":
                    this.store(memIndex);
                    this.PC++;
                    break;
                case "6D":
                    this.addCarry(memIndex);
                    this.PC++;
                    break;
                case "A2":
                    this.XregCon(memIndex);
                    this.PC++;
                    break;
                case "AE":
                    this.XregMem(memIndex);
                    break;
                case "A0":
                    this.YregCon(memIndex);
                    this.PC++;
                    break;
                case "AC":
                    this.YregMem(memIndex);
                    this.PC++;
                    break;
                case "EA":
                    this.NoOperation;
                    break;
                case "00":
                    this.programBreak;
                    break;
                case "EC":
                    this.compare(memIndex);
                    break;
                case "D0":
                    this.branch(memIndex);
                    break;
                case "EE":
                    this.increment(memIndex);
                    break;
                case "FF":
                    this.sysCall(memIndex);
                    break;
                //add a defualt (not sure what it should be yet)
            } //switch
        } //fetchOPCode
        //Always increment the program counter to match the index of the hexcode in the program
        //
        //NOTE TO SELF: parseInt(value, base)
        //             OUTPUTS: CONVERTED value from the specificied base
        //                      to a base of 10
        loadConstant(index) {
            //fetches the next index in Memory and sets it to the accumulator
            this.Acc = parseInt(_MemAcc.read(this.PC + 1), 16);
            this.PC += 2;
        } //loadConstabnt
        loadMemory(index) {
            //loads from the Specified Addresss in Memory
            //converts the new Value to hex
            this.Acc = parseInt(this.valueHelper().toString(16), 16);
            //Program Counter
            this.PC += 3;
        } //loadMemory
        //There must be a better way to snatch the next hexcode and store it. 
        store(index) {
            _MemAcc.write(parseInt(this.valueHelper().toString(16), 16), this.Acc);
            this.PC += 3;
        } //store
        addCarry(index) {
            //adds the contents of the address into the accumulator
            this.Acc += parseInt(this.valueHelper().toString(16), 16);
            this.PC += 3;
        } //addCarry
        XregCon(index) {
            this.Xreg = _MemAcc.read(this.PC + 1);
            this.PC += 2;
        } //XregCon
        XregMem(index) {
            //converts the new Value to hex
            this.Xreg = parseInt(this.valueHelper().toString(16), 16);
            //Program Counter
            this.PC += 3;
        } //XregMem
        YregCon(index) {
            this.Yreg = _MemAcc.read(this.PC + 1);
            this.PC += 2;
        } //YregCon
        YregMem(index) {
            //converts the new Value to hex
            this.Yreg = parseInt(this.valueHelper().toString(16), 16);
            //Program Counter
            this.PC += 3;
        } //YregMem
        NoOperation(index) {
            //Except increment the Program Counter
            this.PC++;
        } //No Operation
        //---------REMINDER-------
        /*
        /BRIAN DO NOT FORGET THAT SYSCALL AND PROGRAM BREAK ARE NOT COMPLETED
        /
        /IMPLEMENT THE INTERPUT QUEUE!!!!!!!!
        /PLEASSSSEEEEEEE!!!!!!!!!!!!!!!!!!!!!
        */
        programBreak(index) {
            this.PC++;
        } //programBreak
        compare(index) {
            //sets the Zero Flag to the appropriate state
            if (this.Xreg == this.valueHelper()) {
                this.Zflag = 1;
            } //if
            else {
                this.Zflag = 0;
            }
            //increase three on the program counter for: compare OP code and the address(which takes up 2 space) that is being 
            //  examined in memory
            this.PC += 3;
        } //compare
        branch(index) {
            if (this.Zflag == 0) { //branch when the Z flag is zero
                //Increments the program counter by x number of bytes
                this.PC += parseInt(_MemAcc.read(this.PC + 1).toString(16), 16);
            } //if
            else { //No Branch 
                //Just increment as normal to go past the rest of Op Code and the address
                this.PC += 2;
            } //else
        } //branch
        increment(index) {
            //The value of the byte in front of the Increment OP Code is incremented 
            //      hence why the Program Counter is looking one place ahead
            //
            //We then fetch the value of the byte and add it by one! :)
            //
            _MemAcc.write(this.PC + 1, this.valueHelper() + 1);
            this.PC += 3;
        } //increment
        //---------REMINDER-------
        /*
        /BRIAN DO NOT FORGET THAT SYSCALL AND PROGRAM BREAK ARE NOT COMPLETED
        /
        /IMPLEMENT THE INTERPUT QUEUE!!!!!!!!
        /PLEASSSSEEEEEEE!!!!!!!!!!!!!!!!!!!!!
        */
        sysCall(index) {
            switch (this.Xreg) {
                //Call 1
                //print the int stored in the Y register
                case 1:
                    //Prints Value of Y Register in Hex
                    _StdOut.putText(this.Yreg.toString(16));
                    break;
                //Call2
                //print the 00-terminated string stored at the address in the Y register
                case 2:
                    _StdOut.putText(_MemAcc.read(this.Yreg));
                    break;
            } //switch
        } //sysCall
        //Grabs the next 2 hex numbers in Memory
        valueHelper() {
            var val1 = parseInt(_MemAcc.read(this.PC + 1), 16);
            var val2 = parseInt(_MemAcc.read(this.PC + 2), 16);
            return val1 + val2;
        } //valueHelper
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map