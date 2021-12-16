module TSOS {
    export class PriorityQueue {

        // An array is used to implement priority
        constructor(
            public priorityPCBS = new Array<ProcessControlBlock>()
        ){}

        public getSize() {
            return this.priorityPCBS.length;
        }

        public isEmpty(){
            return (this.priorityPCBS.length == 0);
        }

        public priorityEnqueue(pcb){
            // creating object from queue element
            var contain = false;
        
            // iterating through the entire
            // item array to add element at the
            // correct location of the Queue
            for (var i = 0; i < this.priorityPCBS.length; i++) {
                if (this.priorityPCBS[i].priority > pcb.priority) {
                    // Once the correct location is found it is
                    // enqueued
                    this.priorityPCBS.splice(i, 0, pcb);
                    contain = true;
                    break;
                }
            }
        
            // if the element have the highest priority
            // it is added at the end of the queue
            if (!contain) {
                this.priorityPCBS.push(pcb);
            }
        }//enqueue

        public dequeue() {
            var retVal = null;
            if (this.priorityPCBS.length > 0) {
                retVal = this.priorityPCBS.shift();
            }
            return retVal;
        }

        
        // front function
        public front(){
            // returns the highest priority element
            // in the Priority queue without removing it.
            if (this.isEmpty())
                return "No elements in Queue";
            return this.priorityPCBS[0];
        }//front

        public rear(){
            // returns the lowest priority
            // element of the queue
            if (this.isEmpty())
                return "No elements in Queue";
            return this.priorityPCBS[this.priorityPCBS.length - 1];
        }//rear

        public toString() {
            var retVal = "";
            for (var i in this.priorityPCBS) {
                retVal += "[" + this.priorityPCBS[i] + "] ";
            }
            return retVal;
        }
    }
}

