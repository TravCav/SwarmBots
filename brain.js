class Brain {
  constructor() {
    this.inputCount = 12;
    const hiddenCount = 30;
    this.neurons = new Array(this.inputCount + hiddenCount + 8);

    //16 inputs
    //26 hidden
    //8 output

    // fill neurons
    for (let ni = 0; ni < this.neurons.length; ni++) {
      this.neurons[ni] = new neuron(this.neurons.length);
    }

    let brainLen = this.neurons.length - 1;
    this.neurons[brainLen - 0].label = 'up left';
    this.neurons[brainLen - 1].label = 'up';
    this.neurons[brainLen - 2].label = 'up right';
    this.neurons[brainLen - 3].label = 'left';
    this.neurons[brainLen - 4].label = 'right';
    this.neurons[brainLen - 5].label = 'down left';
    this.neurons[brainLen - 6].label = 'down';
    this.neurons[brainLen - 7].label = 'down right';
  }

  Copy(otherBrain) {
    // loop though neurons
    for (let ni = 0; ni < this.neurons.length; ni++) {
      // loop though connections
      for (let nc = 0; nc < this.neurons[ni].connections.length; nc++) {
        // copy that floppy
        this.neurons[ni].connections[nc][1] = otherBrain.neurons[ni].connections[nc][1];
      }
    }
  }

  Mutate() {
    // pick a random neuron
    let neuronIndex = Math.floor(Math.random() * (this.neurons.length - (this.inputCount))) + this.inputCount;

    // pick a random connection
    let connectionIndex = Math.floor(Math.random() * (this.neurons[neuronIndex].connections.length));

    // TODO: all the neurons have references to the same connection.
    // randomly adjust it.
    this.neurons[neuronIndex].connections[connectionIndex][1] += (Math.random() * 100) - 50;

    // chance to reset connection
    if (Math.random() < .5) {
      this.neurons[neuronIndex].connections[connectionIndex][1] = 0;
    }
  }

  Processneurons() {
    for (let ni = this.inputCount + 1; ni < this.neurons.length; ni++) {
      let inputValues = 0;
      let connectionCount = this.neurons[ni].connections.length;
      for (let ci = 0; ci < connectionCount - 1; ci++) {
        //console.log(ni,ci,this.neurons);
        // input times a weight
        const inputTimesWeight = this.neurons[this.neurons[ni].connections[ci][0]].value * this.neurons[ni].connections[ci][1];
        inputValues += inputTimesWeight;
        if (inputTimesWeight === 0 && ci > this.inputCount && this.neurons[ni].connections[ci][1] != 0) {
          this.neurons[ni].connections[ci][1] = 0;
          this.Mutate();
        }
      }

      // add a bias
      inputValues += this.neurons[ni].connections[connectionCount - 1][1];

      // activate
      //// this.neurons[ni].value = 1 / (1 + Math.exp(-inputValues));  // sigmoid
      this.neurons[ni].value = Math.tanh(inputValues);
      // this.neurons[ni].value = Math.max(0,inputValues); // ReLU
    }
  }

  Restore() {
    var oldBrain = JSON.parse(localStorage.getItem("reconnect"));
    if (oldBrain != null) {
      // does the net have the same amount of neurons?
      if (this.neurons.length === oldBrain.length) {

        // does the layer have the same amount of neurons?
        if (this.neurons.length === oldBrain.length) {
          for (let ni = 0; ni < this.neurons.length; ni++) {


            // does the neuron have the same amount of connections?
            if (this.neurons[ni].connections.length === oldBrain[ni].connections.length) {
              // copy that floppy.
              this.neurons[ni].connections = oldBrain[ni].connections;
            }
          }
        }

      }
    }
  }
  Save() {
    var dotString = JSON.stringify(this.neurons);
    localStorage.setItem("reconnect", dotString);

    var networkDiv = document.getElementById("mynetwork");
    if (networkDiv.style.display === "block") {
      draw();
    }
  }
}
