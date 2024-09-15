// A queue to batch DOM writes
// take callbacks and execute them in order
export class DOMQueue {
  queue: Function[];
  isRunning: boolean;
  constructor() {
    this.queue = [];
    this.isRunning = false;
  }
  add(callback: Function) {
    this.queue.push(callback);
    if (!this.isRunning) {
      requestAnimationFrame(() => this.run());
    }
  }
  async run() {
    this.isRunning = true;
    while (this.queue.length > 0) {
      const callback = this.queue.shift();
      callback(); // AWAIT???
    }
    this.isRunning = false;
  }
}
