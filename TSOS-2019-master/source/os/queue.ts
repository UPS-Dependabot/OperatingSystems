/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array()) {
        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public priorityEnqueue(pcb){
            // creating object from queue element
            var contain = false;
        
            // iterating through the entire
            // item array to add element at the
            // correct location of the Queue
            for (var i = 0; i < this.q.length; i++) {
                if (this.q[i].priority > pcb.priority) {
                    // Once the correct location is found it is
                    // enqueued
                    this.q.splice(i, 0, pcb);
                    contain = true;
                    break;
                }
            }
        
            // if the element have the highest priority
            // it is added at the end of the queue
            if (!contain) {
                this.q.push(pcb);
            }
        }//enqueue

        // front function
        public front(){
            // returns the highest priority element
            // in the Priority queue without removing it.
            if (this.isEmpty())
                return "No elements in Queue";
            return this.q[0];
        }//front

        public rear(){
            // returns the lowest priority
            // element of the queue
            if (this.isEmpty())
                return "No elements in Queue";
            return this.q[this.q.length - 1];
        }//rear

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }
    }
}
