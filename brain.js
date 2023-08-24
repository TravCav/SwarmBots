class Brain {
  constructor() {
    this.layers = [];
    this.layers.push(new Array(55));
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
    const layer = 0;
    let input = 14;
    let output = 8;
    let range = input + output;

    // pick a random neuron
    let neuronIndex = Math.floor(Math.random() * (this.layers[layer].length -(input))) + input;

    // pick a random connection
    let connectionIndex = Math.floor(Math.random() * (this.layers[layer][neuronIndex].connections.length));

    // TODO: all the neurons have references to the same connection.
    // randomly adjust it.
    this.layers[layer][neuronIndex].connections[connectionIndex].weight += Math.random() * 2 - 1;

    // chance to reset connection
    if(Math.random() < .5 || neuronIndex == connectionIndex)
    {
      this.layers[layer][neuronIndex].connections[connectionIndex].weight=0
    }
  }

  ProcessLayers() {
    //this.GetInputs();
    //for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
      let layerIndex = 0;
      for (let ni = 14; ni < this.layers[layerIndex].length; ni++) {

        let inputValues = 0;
        let connectionCount = this.layers[layerIndex][ni].connections.length;
        for (let ci = 0; ci < connectionCount - 1; ci++) {
          //console.log(layerIndex,ci,ni);
          // input times a weight
          inputValues += this.layers[layerIndex][ni].value * this.layers[layerIndex][ni].connections[ci].weight;
        }

        // add a bias
        inputValues += this.layers[layerIndex][ni].connections[connectionCount - 1].weight;

        // activate
        //// this.layers[layerIndex][ni].value = 1 / (1 + Math.exp(-inputValues));  // sigmoid
        this.layers[layerIndex][ni].value = Math.tanh(inputValues);
        // this.layers[layerIndex][ni].value = Math.max(0,inputValues); // ReLU
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