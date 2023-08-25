class Dot {
  constructor() {
    this.vector = {
      x: 0,
      y: 0
    };
    this.color = {
      r: 127, 
      g: 127, 
      b: 127, 
    };
    this.age = 0;
    this.energy = 10;
    this.tickRate = 0.02;
    this.nearestDot = null;
    this.nearestFood = null;
    this.x = Math.random() * ctx.canvas.width;
    this.y = Math.random() * ctx.canvas.height;
    this.brain = new Brain();
    this.population = [];
    this.consumed = false;
    this.children = 0;
    this.generation = 0;
    this.nearbyDistance = 50;
    this.nearbyDotCount = 0;
  }

  CheckDots(pop) {
    let smallestdistance = 100000000;
    let smallestfooddistance = 100000000;
    this.nearbyDotCount = 0;
    for (
      let closeIndex = 0; closeIndex < pop.dots.length; closeIndex++
    ) {
      if (this !== pop.dots[closeIndex]) {
        // check closeness
        const distance = this.GetDistance(pop.dots[closeIndex]);
        if (distance < this.nearbyDistance) {
          this.nearbyDotCount++;
        }

        if (distance < smallestdistance) {
          smallestdistance = distance;
          this.nearestDot = pop.dots[closeIndex];
        }
        
        if (distance < smallestfooddistance && this.energy > pop.dots[closeIndex].energy) {
          smallestfooddistance = distance;
          this.nearestFood = pop.dots[closeIndex];
        }
      }
    }
  }

  CheckDeath() {
    return this.Consumed() || this.energy < 0 || this.WallDeath();
  }

  CopyColor(dotToCopy) {
    do {
      this.color.r = this.ColorBoundCheck(dotToCopy.color.r + Math.floor((Math.random() * 32) - 16));
      this.color.g = this.ColorBoundCheck(dotToCopy.color.g + Math.floor((Math.random() * 32) - 16));
      this.color.b = this.ColorBoundCheck(dotToCopy.color.b + Math.floor((Math.random() * 32) - 16));
    } while (this.color.r + this.color.g + this.color.b < 127);
  }

  ColorBoundCheck(color) {
    if (color > 255) { return 255; }
    if (color < 0) { return 0; }
    return color;
  }

  Consumed() {
    if (this.nearestDot !== null) {
      const dx = this.x - this.nearestDot.x;
      const dy = this.y - this.nearestDot.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 1) {
        if (this.energy < this.nearestDot.energy) {
          this.energy = -2;
          this.consumed = true;
          return true;
        } else {
          this.children++;
          this.energy += this.nearestDot.energy;

          return false;
        }
      }
    }
    return false;
  }

  DifferentColor(otherColor) {
    return (
      this.color.r !== otherColor.r ||
      this.color.g !== otherColor.g ||
      this.color.b !== otherColor.b
    );
  }

  DoMovement(cWidth, cHeight) {
    this.ThinkAboutStuff(cWidth, cHeight);
    let lastLayerIndex = this.brain.layers.length - 1;
    let lastLayer = this.brain.layers[lastLayerIndex];
    let brainLen = this.brain.layers[0].length-1;
    let vectorModifier = 0.1;
    // this.vector.x += ((lastLayer[brainLen-5].value + lastLayer[brainLen-6].value + lastLayer[brainLen-7].value) - (lastLayer[brainLen-0].value + lastLayer[brainLen-1].value + lastLayer[brainLen-2].value)) / 3;
    // this.vector.y += ((lastLayer[brainLen-2].value + lastLayer[brainLen-4].value + lastLayer[brainLen-7].value) - (lastLayer[brainLen-0].value + lastLayer[brainLen-3].value + lastLayer[brainLen-5].value)) / 3;
 
    // 0,1,2
    // 3,-,4
    // 5,6,7
    
    // this.vector.x += ((lastLayer[5].value + lastLayer[6].value + lastLayer[7].value) - (lastLayer[0].value + lastLayer[1].value + lastLayer[2].value)) / 3;
    // this.vector.y += ((lastLayer[2].value + lastLayer[4].value + lastLayer[7].value) - (lastLayer[0].value + lastLayer[3].value + lastLayer[5].value)) / 3;

    this.vector.x += ((lastLayer[brainLen-4].value + lastLayer[brainLen-1].value + lastLayer[brainLen].value) - (lastLayer[brainLen-7].value + lastLayer[brainLen-6].value + lastLayer[brainLen-5].value)) / 3;
    this.vector.y += ((lastLayer[brainLen-5].value + lastLayer[brainLen-3].value + lastLayer[brainLen].value) - (lastLayer[brainLen-7].value + lastLayer[brainLen-4].value + lastLayer[brainLen-2].value)) / 3; 
  
    this.x += (this.vector.x * vectorModifier);
    this.y += (this.vector.y * vectorModifier);

    const lastVector = Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y) / 1000;
    this.energy -= this.tickRate + lastVector;
    this.age++;
  }

  GetDistance(otherDot) {
    const dx = this.x - otherDot.x;
    const dy = this.y - otherDot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
  }

  GetInputs(cWidth, cHeight) {
    
    // previous outputs
    // let outputLayer = this.brain.layers.length - 1;
    // let outputLayerLen = this.brain.layers[outputLayer].length
    // for (let index = 0; index < outputLayerLen; index++) {
    //   this.brain.layers[0].push({
    //     value: this.brain.layers[outputLayer][index].value,
    //     label: "read output " + index
    //   });
    // }

    // know thyself
    this.brain.layers[0][0] = {
      value: this.age,
      label: "age"
    };

    this.brain.layers[0][1] = {
      value: this.energy,
      label: "energy"
    };
    this.brain.layers[0][2] = {
      value: this.vector.x,
      label: "x vector"
    };
    this.brain.layers[0][3] = {
      value: this.vector.y,
      label: "y vector"
    };

    // closest dot that it can see. if any.
    if (this.GetDistance(this.nearestDot) < this.nearbyDistance) {
      this.brain.layers[0][4] = {
        value: this.nearestDot.x - this.x,
        label: "nearest dot x distance"
      };
      this.brain.layers[0][5] = {
        value: this.nearestDot.y - this.y,
        label: "nearest dot y distance"
      };
      this.brain.layers[0][6] = {
        value: this.nearestDot.energy - this.energy,
        label: "nearest dot energy"
      };

      this.brain.layers[0][7] = {
        value: Math.abs(this.color.r - this.nearestDot.color.r),
        label: "nearest dot r diff"
      };
      this.brain.layers[0][8] = {
        value: Math.abs(this.color.g - this.nearestDot.color.g),
        label: "nearest dot g diff"
      };
      this.brain.layers[0][9] = {
        value: Math.abs(this.color.b - this.nearestDot.color.b),
        label: "nearest dot b diff"
      };
    } else {
      // can't see anything.
      this.brain.layers[0][4] = { value: 0, label: "nearest dot x distance" };
      this.brain.layers[0][5] = { value: 0, label: "nearest dot y distance"};
      this.brain.layers[0][6] = { value: 0, label: "nearest dot energy" };
      this.brain.layers[0][7] = { value: 0, label: "nearest dot r diff" };
      this.brain.layers[0][8] = { value: 0, label: "nearest dot g diff" };
      this.brain.layers[0][9] = { value: 0, label: "nearest dot b diff" };
    }

        // closest dot that it can see. if any.
    if (this.nearestFood != null &&  (this.GetDistance(this.nearestFood) < this.nearbyDistance * 2)) {
      this.brain.layers[0][10] = {
        value: this.nearestFood.x - this.x,
        label: "closest food x"
      };
      this.brain.layers[0][11] = {
        value: this.nearestFood.y - this.y,
        label: "closest food y"
      };
      
    } else {
      // can't see anything.
      this.brain.layers[0][10] = { value: 0, label: "closest food x" };
      this.brain.layers[0][11] = { value: 0, label: "closest food y" };
    }

    // what's around me
    this.brain.layers[0][12] = {
      value: this.nearbyDotCount,
      label: "number of visible dots"
    };

  }

  ThinkAboutStuff(cWidth, cHeight) {
    this.GetInputs(cWidth, cHeight);
    this.brain.ProcessLayers();
  }

  WallDeath() {
    return (
      this.x > ctx.canvas.width ||
      this.x < 1 ||
      this.y > ctx.canvas.height ||
      this.y < 1
    );
  }
}