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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        getPC(){
            return this.PC;
        }

        setPC(newPC){
            this.PC = newPC;
        }

        setAcc(newAcc){
            this.Acc = newAcc;
        }
        getAcc(){
            return this.Acc;
        }

        setXReg(newX){
            this.Xreg = newX;
        }
        
        getXReg(){
            return this.Xreg;
        }

        setYReg(newY){
            this.Yreg = newY;
        }
        
        getYReg(){
            return this.Yreg;
        }


        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if(this.isExecuting){ 
            
                for(var optCode in _Mem.Mem){
                    this.fetchOpCode(_Mem.Mem[optCode], optCode);
                }//for
            }//if
        }//cycle

        //finds the Op Code associated with the hex nnumbers
        public fetchOpCode(hex, memIndex){
            switch(hex){
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
                case "00":
                    this.NoOperation;
                    this.PC++;
                    break;
                case "EC":
                    this.compare(memIndex);
                    break;
                case "D0":
                    this.branch(memIndex);
                    this.PC++;
                    break; 
                case "EE":
                    this.increment(memIndex);
                    this.PC++;
                    break;
                case "FF":
                    this.sysCall(memIndex);
                    this.PC++;
                    break;
                //add a defualt (not sure what it should be yet)
            }//switch
        }//fetchOPCode

        //Always increment the program counter to match the index of the hexcode in the program

        public loadConstant (index){//load accumulator with constant
            //fetches the next index in Memory and sets it to the accumulator
            this.Acc = _MemAcc.read(this.PC+1);
            this.PC += 2;
        }//loadConstabnt

        public loadMemory(index){//load accumulator from memory
            //loads from the Specified Addresss in Memory
            var val1  = _MemAcc.read(this.PC+1);
            var val2 = _MemAcc.read(this.PC+2);
            var newVal = val1 + val2;
            //converts the new Value to hex
            this.Acc = parseInt(newVal.toString(16), 16);

            //Program Counter
            this.PC =+ 3;
        }//loadMemory

        //There must be a better way to snatch the next hexcode and store it. 
        public store(index){//store accumulator in memory
            var val1  = _MemAcc.read(this.PC+1);
            var val2 = _MemAcc.read(this.PC+2);
            var newVal = val1 + val2;

            _MemAcc.write(parseInt(newVal.toString(16), 16), this.Acc);
            this.PC =+ 3;
        }//store

        public addCarry(index){//Add with carry
            //Adds the hex
            var address1  = _MemAcc.read(this.PC+1);
            var address2 = _MemAcc.read(this.PC+2);
            var wholeAddress = address1 + address2;

            //adds the contents of the address into the accumulator
            this.Acc =+ parseInt(wholeAddress.toString(16), 16);
        }//addCarry

        public XregCon(index){//Load X register with constant
            this.Xreg = _MemAcc.read(this.PC+1);
            this.PC += 2;
        }//XregCon

        public XregMem(index){//Load X register from memory
            //loads from the Specified Addresss in Memory
            var val1  = _MemAcc.read(this.PC+1);
            var val2 = _MemAcc.read(this.PC+2);
            var newVal = val1 + val2;
            //converts the new Value to hex
            this.Xreg = parseInt(newVal.toString(16), 16);

            //Program Counter
            this.PC =+ 3;
        }//XregMem

        public YregCon(index){// Load Y register with constant
            this.Yreg = _MemAcc.read(this.PC+1);
            this.PC += 2;
        }//YregCon

        public YregMem(index){//Load Y register from memory
            //loads from the Specified Addresss in Memory
            var val1  = _MemAcc.read(this.PC+1);
            var val2 = _MemAcc.read(this.PC+2);
            var newVal = val1 + val2;
            //converts the new Value to hex
            this.Yreg = parseInt(newVal.toString(16), 16);

            //Program Counter
            this.PC =+ 3;
        }//YregMem

        public NoOperation(index){// Does nothing
            //Except increment the Program Counter
            this.PC++;
        }//No Operation

        public programBreak(index){//Ends the program (It is really a system call)

        }//programBreak

        public compare(index){//Compare a byte in memory to X reg & sets the zero flag if equal
        
        }//compare

        public branch(index){// Hops to another line in the program if Z Flag  = 0
        
        }//branch

        public increment(index){//increments the value of a byte
            this.Acc++;
        }//increment

        public sysCall(index){
            //Call 1
            //print the int stored in the Y register

            //Call2
            //print the 00-terminated string stored at the address in the Y register

        }//sysCall

    }
}
