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
                    this.loadConstant;
                    break;
                case "AD":
                    this.loadMemory;
                    break;
                case "8D": 
                    this.store;
                    break;
                case "6D":
                    this.addCarry;
                    break;
                case "A2":
                    this.XregCon;
                    break;
                case "AE":
                    this.XregMem;
                    break;
                case "A0":
                    this.YregCon;
                    break;
                case "AC":
                    this.YregMem;
                    break;
                case "00":
                    this.NoOperation;
                    break;
                case "EC":
                    this.compare;
                    break;
                case "D0":
                    this.branch;
                    break; 
                case "EE":
                    this.increment;
                    break;
                case "FF":
                    this.sysCall;
                    break;
                //add a defualt (not sure what it should be yet)
            }//switch
        }//fetchOPCode

        public loadConstant (){//load accumulator with constant
            //fetches the next index in Memory and sets it to the accumulator
            this.Acc = _Mem.Mem[this.PC+1];
            this.PC++;
        }//loadConstabnt

        public loadMemory(){//load accumulator from memory
            //loads from the Specified Addresss in Memory
            this.Acc = _Mem.Mem[_Mem.Mem[this.PC+1]];
            this.PC++;
        }//loadMemory

        public store(){//store accumulator in memory

        }//store

        public addCarry(){//Add with carry

        }//addCarry

        public XregCon(){//Load X register with constant

        }//XregCon

        public XregMem(){//Load X register from memory
        
        }//XregMem

        public YregCon(){// Load Y register with constant

        }//YregCon

        public YregMem(){//Load Y register from memory
        
        }//YregMem

        public NoOperation(){// Does nothing
            //Except increment the Program Counter
        }//No Operation

        public programBreak(){//Ends the program (It is really a system call)

        }//programBreak

        public compare(){//Compare a byte in memory to X reg & sets the zero flag if equal
        
        }//compare

        public branch(){// Hops to another line in the program if Z Flag  = 0
        
        }//branch

        public increment(){//increments the value of a byte
        
        }//increment

        public sysCall(){
            //Call 1
            //print the int stored in the Y register

            //Call2
            //print the 00-terminated string stored at the address in the Y register

        }//sysCall

    }
}
