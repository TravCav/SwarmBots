let cvs = document.getElementById("gridCanvas");
let ctx = cvs.getContext("2d");


ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let centerX = ctx.canvas.width / 2;
let centerY = ctx.canvas.height / 2;
let pixels = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
let density = 6000;
let dotCount = (ctx.canvas.width * ctx.canvas.height) / density;

let population = {
  data: {
    mostEnergy: 0,
    mostEnergyIndex: 0,
    highestAverage: 0,
    averageAge: 0,
    oldestAge: 0,
    oldestAgeIndex: 0,
    mostChildren: 0,
    mostChildrenIndex: 0
  },
  dots: []
};

function Init() {
  for (let i = 0; i < dotCount; i++) {
    population.dots.push(new Dot());

    if (i < dotCount * 0.90) { //===0) {
      population.dots[i].brain.Restore();
    }
  }

  DrawGrid();
}

function DoTheThings() {
  centerX = ctx.canvas.width / 2;
  centerY = ctx.canvas.height / 2;

  let totalEnergy = 0;
  population.data.oldestAge = 0;
  population.data.mostEnergy = 0;
  population.data.mostChildren = 0;

  for (let i = 0; i < dotCount; i++) {
    totalEnergy += population.dots[i].energy;
    population.dots[i].CheckDots(population);

    population.dots[i].DoMovement(centerX, centerY);

    if (population.dots[i].energy > population.data.mostEnergy) {
      population.data.mostEnergyIndex = i;
      population.data.mostEnergy = population.dots[i].energy;
    }

    if (population.dots[i].children > population.data.mostChildren) {
      population.data.mostChildrenIndex = i;
      population.data.mostChildren = population.dots[i].children;
    }

    if (population.dots[i].age > population.data.oldestAge) {
      population.data.oldestAgeIndex = i;
      population.data.oldestAge = population.dots[i].age;
    }
  }

  let averageEnergy = totalEnergy / dotCount;
  if (averageEnergy > population.data.highestAverage) {
    population.data.highestAverage = averageEnergy;
  }

  for (
    let dotIndex = 0; dotIndex < population.dots.length; dotIndex++
  ) {
    if (population.dots[dotIndex].CheckDeath() === true) {
      if (population.dots[dotIndex].age >= population.data.oldestAge) {
        population.dots[dotIndex].brain.Save();
      }

      let copyDot = population.data.oldestAgeIndex;
      if (Math.random() < 0.5) {
        copyDot = population.data.mostChildrenIndex;
      }

      // got et
      if (population.dots[dotIndex].consumed === true) {
        population.dots[dotIndex].brain.Copy(
          population.dots[dotIndex].nearestDot.brain
        );
        population.dots[dotIndex].CopyColor();
        population.dots[dotIndex].consumed = false;
        do {
          // // population.dots[dotIndex].x = population.dots[dotIndex].x + ((Math.random() * 200) - 100);
          // // population.dots[dotIndex].y = population.dots[dotIndex].y + ((Math.random() * 200) - 100);
          
          const r = (Math.random() * 50)+50;
          const a = Math.random() * 6.28;
          population.dots[dotIndex].x = Math.floor(r * Math.cos(a) + population.dots[dotIndex].x);
          population.dots[dotIndex].y = Math.floor(r * Math.sin(a) + population.dots[dotIndex].y);

        } while (population.dots[dotIndex].x < 0 && population.dots[dotIndex].x > ctx.canvas.width && population.dots[dotIndex].y < 0 && population.dots[dotIndex].y > ctx.canvas.height);

      } else {
        population.dots[dotIndex].brain.Copy(
          population.dots[copyDot].brain
        );

        let cDot = population.dots[copyDot];
        population.dots[dotIndex].color.r = cDot.color.r;
        population.dots[dotIndex].color.g = cDot.color.g;
        population.dots[dotIndex].color.b = cDot.color.b;

        // population.dots[dotIndex].x = Math.random() * ctx.canvas.width;
        // population.dots[dotIndex].y = Math.random() * ctx.canvas.height;
        const r = (Math.random() * 50)+50;
        const a = Math.random() * 6.28;
        population.dots[dotIndex].x = Math.floor(r * Math.cos(a) + cDot.x);
        population.dots[dotIndex].y = Math.floor(r * Math.sin(a) + cDot.y);
      }

      population.dots[dotIndex].brain.Mutate();

      population.dots[dotIndex].vector.x = 0;
      population.dots[dotIndex].vector.y = 0;
      population.dots[dotIndex].energy = 2;
      population.dots[dotIndex].age = 0;
      population.dots[dotIndex].children = 0;
    }
  }
}

function DrawGrid() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  DoTheThings();

  // clear screen
  pixels = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);

  ////let index = 0;

  // draw
  for (let i = 0; i < dotCount; i++) {
    let x = Math.floor(population.dots[i].x);
    let y = Math.floor(population.dots[i].y);

    ////let dotSize = 1;

    if (!(
        x < 1 ||
        y < 1 ||
        x > ctx.canvas.width ||
        y > ctx.canvas.height
      )) {

      PlacePixel(x - 1, y - 1, population.dots[i].color, 64);
      PlacePixel(x, y - 1, population.dots[i].color, 0);
      PlacePixel(x + 1, y - 1, population.dots[i].color, 64);

      PlacePixel(x - 1, y, population.dots[i].color, 0);
      PlacePixel(x, y, population.dots[i].color, 0);
      PlacePixel(x + 1, y, population.dots[i].color, 0);

      PlacePixel(x - 1, y + 1, population.dots[i].color, 64);
      PlacePixel(x, y + 1, population.dots[i].color, 0);
      PlacePixel(x + 1, y + 1, population.dots[i].color, 64);

      // // for (let xx = x - dotSize; xx <= x + dotSize; xx++) {
      // //   for (let yy = y - dotSize; yy <= y + dotSize; yy++) {
      // //     PlacePixel(xx, yy, population.dots[i].color);
      // //   }
      // // }
    }
  }

  DrawBrain(population.data.oldestAgeIndex, 0);
  DrawBrain(population.data.mostChildrenIndex, 230);

  ctx.putImageData(pixels, 0, 0);

  //ctx.font = "10px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("oldest: " + population.data.oldestAgeIndex + " - " + population.data.oldestAge , 20, 10);
  ctx.fillStyle = "lightgreen";
  ctx.fillText("most prolific: " + population.data.mostChildrenIndex + " - " + population.data.mostChildren, 20, 240);
  ctx.stroke();


  //ListDetails();
  CircleDot(population.data.oldestAgeIndex, "white", 50);
  CircleDot(population.data.mostChildrenIndex, "green", 45);

  setTimeout(function () {
    DrawGrid();
  }, 1);
  return;
}

function ListDetails() {
  const oldestDot = population.dots[population.data.oldestAgeIndex];
  ctx.fillText("children: " + oldestDot.children.toFixed(2), 10, 240);
  const inputLayer = oldestDot.brain.layers[0];
  for (let inputIndex = 0; inputIndex < inputLayer.length; inputIndex++) {
    ctx.fillText("input " + inputIndex + ": " + inputLayer[inputIndex].value.toFixed(2), 10, 260 + (20 * inputIndex));
  }

}

function CircleDot(dotIndex, color, size) {
  const oldDot = population.dots[dotIndex];
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(oldDot.x, oldDot.y, size, 0, 2 * Math.PI);
  ctx.stroke();
}

function DrawBrain(dotIndex, offset) {
  const dot = population.dots[dotIndex];
  const brain = dot.brain;
  const layerSize = 200 / brain.layers.length;
  for (let layerIndex = 1; layerIndex < brain.layers.length - 1; layerIndex++) {
    const layer = brain.layers[layerIndex];
    const neuronSize = 200 / layer.length;
    for (let neuronIndex = 0; neuronIndex < layer.length; neuronIndex++) {
      const neuronValue = layer[neuronIndex].value;
      PlaceSquare(Math.floor(layerIndex * layerSize), Math.floor((1 + neuronIndex) * neuronSize + offset), {
        r: (dot.color.r / 2) + (127 * neuronValue),
        g: (dot.color.g / 2) + (127 * neuronValue),
        b: (dot.color.b / 2) + (127 * neuronValue)
      }, 10);
    }
  }

  const lastLayer = dot.brain.layers[brain.layers.length - 1];
  const leftNeuronValue = lastLayer[1].value;
  const leftColor = {
    r: (dot.color.r / 2) + (127 * leftNeuronValue),
    g: (dot.color.g / 2) + (127 * leftNeuronValue),
    b: (dot.color.b / 2) + (127 * leftNeuronValue)
  };
  PlaceSquare(175, 100 + offset, leftColor, 10);

  const rightNeuronValue = lastLayer[0].value;
  const rightColor = {
    r: (dot.color.r / 2) + (127 * rightNeuronValue),
    g: (dot.color.g / 2) + (127 * rightNeuronValue),
    b: (dot.color.b / 2) + (127 * rightNeuronValue)
  };
  PlaceSquare(225, 100 + offset, rightColor, 10);

  const upNeuronValue = lastLayer[3].value;
  const upColor = {
    r: (dot.color.r / 2) + (127 * upNeuronValue),
    g: (dot.color.g / 2) + (127 * upNeuronValue),
    b: (dot.color.b / 2) + (127 * upNeuronValue)
  };
  PlaceSquare(200, 75 + offset, upColor, 10);

  const downNeuronValue = lastLayer[2].value;
  const downColor = {
    r: (dot.color.r / 2) + (127 * downNeuronValue),
    g: (dot.color.g / 2) + (127 * downNeuronValue),
    b: (dot.color.b / 2) + (127 * downNeuronValue)
  };
  PlaceSquare(200, 125 + offset, downColor, 10);

  const xVector = (lastLayer[0].value - lastLayer[1].value) * 3;
  const yVector = (lastLayer[2].value - lastLayer[3].value) * 3;

  PlaceSquare(Math.floor(dot.vector.x + 200 + 2.5), Math.floor(dot.vector.y + 100 + 2.5 + offset), dot.color, 5);

}

function PlacePixel(x, y, color, d) {
  const index = (x + y * ctx.canvas.width) * 4;
  pixels.data[index] = color.r - d;
  pixels.data[index + 1] = color.g - d;
  pixels.data[index + 2] = color.b - d;
  pixels.data[index + 3] = 255;
}

function PlaceSquare(x, y, color, s) {
  for (let xx = x; xx < x + s; xx++) {
    for (let yy = y; yy < y + s; yy++) {
      PlacePixel(xx, yy, color, 0);
    }
  }
}


Init();