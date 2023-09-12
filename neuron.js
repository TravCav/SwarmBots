class neuron {
  constructor(connectionCount) {
    // one for the bias and one for cycling back in.
    connectionCount += 1;
    this.label = "";
    this.type = "";
    this.value = 0;
    this.connections = [];
    for (let index = 0; index < connectionCount; index++) {
      this.connections.push([index, 0]);
    }
  }
}
