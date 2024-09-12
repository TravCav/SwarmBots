class Dot {
  constructor() {
    this.vector = { x: 0, y: 0 };
    this.color = { r: 127, g: 127, b: 127 };
    this.age = 0;
    this.energy = 10;
    this.tickRate = 0.02;
    this.nearestDot = null;
    this.nearestFood = null;
    this.mostEnergeticFood = null;
    this.x = Math.random() * ctx.canvas.width;
    this.y = Math.random() * ctx.canvas.height;
    this.brain = new Brain();
    this.population = [];
    this.consumed = false;
    this.children = 0;
    this.generation = 0;
    this.nearbyDistance = 50;
    this.nearbyDotCount = 0;
    this.nearbyFoodCount = 0;
  }



  // Method to calculate the radius based on energy using a logarithmic scale
  calculateRadius() {
    const minSize = 1;
    const maxSize = 5;
    const logEnergy = Math.log(this.energy + 1); // Add 1 to avoid log(0)
    const scale = (maxSize - minSize) / Math.log(100 + 1); // Adjust 100 based on max expected energy
    return Math.max(minSize, Math.min(maxSize, minSize + logEnergy * scale));
  }

  CheckDots(pop) {
    let smallestDistance = 100000000;
    let nearestDistance = 100000000;
    this.nearbyDotCount = 0;

    for (let closeIndex = 0; closeIndex < pop.dots.length; closeIndex++) {
        if (this !== pop.dots[closeIndex]) {
            const distance = this.GetDistance(pop.dots[closeIndex]);

            // Track the nearest dot regardless of energy
            if (distance < nearestDistance) {
                nearestDistance = distance;
                this.nearestDot = pop.dots[closeIndex];
            }

            // Track the most energetic food that this dot can eat (lower energy)
            if (this.energy > pop.dots[closeIndex].energy) {
                if (!this.mostEnergeticFood || pop.dots[closeIndex].energy > this.mostEnergeticFood.energy) {
                    this.mostEnergeticFood = pop.dots[closeIndex];
                }
            }
        }
    }
}



  CheckDeath() {
    const died = this.Consumed() || this.energy < 0 || this.WallDeath();
    return died;
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
          if (this.energy > 100) { this.energy = 100; }

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
    let brainLen = this.brain.neurons.length - 1;
    let vectorModifier = 0.1;
    // this.vector.x += ((this.brain.neurons[brainLen-5].value + this.brain.neurons[brainLen-6].value + this.brain.neurons[brainLen-7].value) - (this.brain.neurons[brainLen-0].value + this.brain.neurons[brainLen-1].value + this.brain.neurons[brainLen-2].value)) / 3;
    // this.vector.y += ((this.brain.neurons[brainLen-2].value + this.brain.neurons[brainLen-4].value + this.brain.neurons[brainLen-7].value) - (this.brain.neurons[brainLen-0].value + this.brain.neurons[brainLen-3].value + this.brain.neurons[brainLen-5].value)) / 3;

    // 0,1,2
    // 3,-,4
    // 5,6,7

    // this.vector.x += ((this.brain.neurons[5].value + this.brain.neurons[6].value + this.brain.neurons[7].value) - (this.brain.neurons[0].value + this.brain.neurons[1].value + this.brain.neurons[2].value)) / 3;
    // this.vector.y += ((this.brain.neurons[2].value + this.brain.neurons[4].value + this.brain.neurons[7].value) - (this.brain.neurons[0].value + this.brain.neurons[3].value + this.brain.neurons[5].value)) / 3;

    this.vector.x += ((this.brain.neurons[brainLen - 4].value + this.brain.neurons[brainLen - 1].value + this.brain.neurons[brainLen].value) - (this.brain.neurons[brainLen - 7].value + this.brain.neurons[brainLen - 6].value + this.brain.neurons[brainLen - 5].value)) / 3;
    this.vector.y += ((this.brain.neurons[brainLen - 5].value + this.brain.neurons[brainLen - 3].value + this.brain.neurons[brainLen].value) - (this.brain.neurons[brainLen - 7].value + this.brain.neurons[brainLen - 4].value + this.brain.neurons[brainLen - 2].value)) / 3;

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

    // know thyself
    this.brain.neurons[0] = {
      value: this.age,
      label: "age",
      connections: []
    };

    this.brain.neurons[1] = {
      value: this.energy,
      label: "energy",
      connections: []
    };
    this.brain.neurons[2] = {
      value: this.vector.x,
      label: "x vector",
      connections: []
    };
    this.brain.neurons[3] = {
      value: this.vector.y,
      label: "y vector",
      connections: []
    };

    // closest dot that it can see. if any.
    if (this.GetDistance(this.nearestDot) < this.nearbyDistance) {
      this.brain.neurons[4] = {
        value: this.nearestDot.x - this.x,
        label: "nearest dot x distance",
        connections: []
      };
      this.brain.neurons[5] = {
        value: this.nearestDot.y - this.y,
        label: "nearest dot y distance",
        connections: []
      };
      this.brain.neurons[6] = {
        value: this.nearestDot.energy - this.energy,
        label: "nearest dot energy",
        connections: []
      };

      this.brain.neurons[7] = {
        value: Math.abs(this.color.r - this.nearestDot.color.r),
        label: "nearest dot r diff",
        connections: []
      };
      this.brain.neurons[8] = {
        value: Math.abs(this.color.g - this.nearestDot.color.g),
        label: "nearest dot g diff",
        connections: []
      };
      this.brain.neurons[9] = {
        value: Math.abs(this.color.b - this.nearestDot.color.b),
        label: "nearest dot b diff",
        connections: []
      };
    } else {
      // can't see anything.
      this.brain.neurons[4] = { value: 0, label: "nearest dot x distance", connections: [] };
      this.brain.neurons[5] = { value: 0, label: "nearest dot y distance", connections: [] };
      this.brain.neurons[6] = { value: 0, label: "nearest dot energy", connections: [] };
      this.brain.neurons[7] = { value: 0, label: "nearest dot r diff", connections: [] };
      this.brain.neurons[8] = { value: 0, label: "nearest dot g diff", connections: [] };
      this.brain.neurons[9] = { value: 0, label: "nearest dot b diff", connections: [] };
    }

    // closest most energetic dot that it can eat. if any.
    if (this.mostEnergeticFood != null) {
      this.brain.neurons[10] = {
        value: this.mostEnergeticFood.x - this.x,
        label: "best food x", connections: []
      };
      this.brain.neurons[11] = {
        value: this.mostEnergeticFood.y - this.y,
        label: "best food y", connections: []
      };
    } else {
      // can't see anything.
      this.brain.neurons[10] = { value: 0, label: "best food x", connections: [] };
      this.brain.neurons[11] = { value: 0, label: "best food y", connections: [] };
    }


  }

  ThinkAboutStuff(cWidth, cHeight) {
    this.GetInputs(cWidth, cHeight);
    this.brain.Processneurons();
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