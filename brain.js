class Brain {
  constructor() {
    this.neurons = new Array(35);
    // this.neurons.push(new Array(26));
    // this.neurons.push(new Array(8));

    //13 inputs
    //26 hidden
    //8 output

    // fill neurons
    for (let ni = 0; ni < this.neurons.length; ni++) {
      this.neurons[ni] = new neuron(this.neurons.length);
    }

    let brainLen = this.neurons.length-1;
    this.neurons[brainLen-0].label = 'up left';
    this.neurons[brainLen-1].label = 'up';
    this.neurons[brainLen-2].label = 'up right';
    this.neurons[brainLen-3].label = 'left';
    this.neurons[brainLen-4].label = 'right';
    this.neurons[brainLen-5].label = 'down left';
    this.neurons[brainLen-6].label = 'down';
    this.neurons[brainLen-7].label = 'down right';
  }

  Copy(otherBrain) {
      // loop though neurons
      for (let ni = 0; ni < this.neurons.length; ni++) {
        // loop though connections
        for (let nc = 0; nc < this.neurons[ni].connections.length; nc++) {
          // copy that floppy
          this.neurons[ni].connections[nc].weight = otherBrain.neurons[ni].connections[nc].weight;
        }
      }
  }

  Mutate() { 
    // pick a random neuron
    let neuronIndex = Math.floor(Math.random() * (this.neurons.length - (13))) + 13;

    // pick a random connection
    let connectionIndex = Math.floor(Math.random() * (this.neurons[neuronIndex].connections.length));

    // TODO: all the neurons have references to the same connection.
    // randomly adjust it.
    this.neurons[neuronIndex].connections[connectionIndex].weight += Math.random() * 2 - 1;

    // chance to reset connection
    if(Math.random() < .5)
    {
      this.neurons[neuronIndex].connections[connectionIndex].weight=0;
    }
  }

  Processneurons() {
      for (let ni = 13; ni < this.neurons.length; ni++) {
        let inputValues = 0;
        let connectionCount = this.neurons[ni].connections.length;
        for (let ci = 0; ci < connectionCount - 1; ci++) {
          //console.log(0,ci,ni);
          // input times a weight
          inputValues += this.neurons[ci].value * this.neurons[ni].connections[ci].weight;
        }

        // add a bias
        inputValues += this.neurons[ni].connections[connectionCount - 1].weight;

        // activate
        //// this.neurons[ni].value = 1 / (1 + Math.exp(-inputValues));  // sigmoid
        this.neurons[ni].value = Math.tanh(inputValues);
        // this.neurons[ni].value = Math.max(0,inputValues); // ReLU
      }
  }

  Restore() {
    var oldBrain = JSON.parse(localStorage.getItem("Layer1"));
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
    localStorage.setItem("Layer1", dotString);

    var networkDiv = document.getElementById("mynetwork");
    if (networkDiv.style.display === "block") {
       draw();
    }
  }
}