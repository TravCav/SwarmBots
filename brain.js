class Brain {
  constructor() {
    this.layers = [];
    this.layers.push(new Array(35));
    // this.layers.push(new Array(26));
    // this.layers.push(new Array(8));

    //13 inputs
    //26 hidden
    //8 output

    // fill layers
    for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
      for (let ni = 13; ni < this.layers[layerIndex].length; ni++) {
        this.layers[layerIndex][ni] = new neuron(this.layers[layerIndex].length);
      }
    }

    let brainLen = this.layers[0].length-1;
    this.layers[0][brainLen-0].label = 'up left';
    this.layers[0][brainLen-1].label = 'up';
    this.layers[0][brainLen-2].label = 'up right';
    this.layers[0][brainLen-3].label = 'left';
    this.layers[0][brainLen-4].label = 'right';
    this.layers[0][brainLen-5].label = 'down left';
    this.layers[0][brainLen-6].label = 'down';
    this.layers[0][brainLen-7].label = 'down right';
  }

  Copy(otherBrain) {
    // loop through layers
    // for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
      let layerIndex = 0;
      // loop though neurons
      for (let ni = 14; ni < this.layers[layerIndex].length; ni++) {
        // loop though connections
        for (let nc = 0; nc < this.layers[layerIndex][ni].connections.length; nc++) {
          // copy that floppy
          this.layers[layerIndex][ni].connections[nc].weight = otherBrain.layers[layerIndex][ni].connections[nc].weight;
        }
      }
    //}
  }

  Mutate() {
    // pick a random layer
 
    // pick a random neuron
    let neuronIndex = Math.floor(Math.random() * (this.layers[0].length - (13))) + 13;

    // pick a random connection
    let connectionIndex = Math.floor(Math.random() * (this.layers[0][neuronIndex].connections.length));

    // TODO: all the neurons have references to the same connection.
    // randomly adjust it.
    this.layers[0][neuronIndex].connections[connectionIndex].weight += Math.random() * 2 - 1;

    // chance to reset connection
    if(Math.random() < .5)
    {
      this.layers[0][neuronIndex].connections[connectionIndex].weight=0;
    }
  }

  ProcessLayers() {
    //this.GetInputs();
    //for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
      for (let ni = 13; ni < this.layers[0].length; ni++) {

        let inputValues = 0;
        let connectionCount = this.layers[0][ni].connections.length;
        for (let ci = 0; ci < connectionCount - 1; ci++) {
          //console.log(0,ci,ni);
          // input times a weight
          inputValues += this.layers[0][ci].value * this.layers[0][ni].connections[ci].weight;
        }

        // add a bias
        inputValues += this.layers[0][ni].connections[connectionCount - 1].weight;

        // activate
        //// this.layers[0][ni].value = 1 / (1 + Math.exp(-inputValues));  // sigmoid
        this.layers[0][ni].value = Math.tanh(inputValues);
        // this.layers[0][ni].value = Math.max(0,inputValues); // ReLU
      }
    //}
  }

  Restore() {
    var oldBrain = JSON.parse(localStorage.getItem("Layer1"));
    if (oldBrain != null) {
      // does the net have the same amount of layers?
      if (this.layers.length === oldBrain.length) {
        for (let li = 1; li < this.layers.length; li++) {

          // does the layer have the same amount of neurons?
          if (this.layers[li].length === oldBrain[li].length) {
            for (let ni = 0; ni < this.layers[li].length; ni++) {

              // does the neuron have the same amount of connections?
              if (this.layers[li][ni].connections.length === oldBrain[li][ni].connections.length) {
                // copy that floppy.
                this.layers[li][ni].connections = oldBrain[li][ni].connections;
              }
            }
          }
        }
      }
    }
  }
  Save() {
    var dotString = JSON.stringify(this.layers);
    localStorage.setItem("Layer1", dotString);

    var networkDiv = document.getElementById("mynetwork");
    if (networkDiv.style.display === "block") {
       draw();
    }
  }
}