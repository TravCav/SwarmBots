let cvs = document.getElementById("gridCanvas");
let ctx = cvs.getContext("2d");

const times = [];
let fps;

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let centerX = ctx.canvas.width / 2;
let centerY = ctx.canvas.height / 2;
let pixels = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
let density = 100000;

let lowerLimit = ((ctx.canvas.width * ctx.canvas.height) / 10000) * 1;
let upperLimit = ((ctx.canvas.width * ctx.canvas.height) / 10000) * density;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let mode = params.mode; // "some_value"

let population = {
  data: {
    mostChildren: 0,
    mostChildrenIndex: 0
  },
  dots: []
};

function AddDots(dotsToAdd) {
  for (let i = 0; i < dotsToAdd; i++) {
    population.dots.push(new Dot());

    population.dots[i].brain.Restore();
    population.dots[i].brain.Mutate();
  }
}

function CircleDot(dotIndex, color, size) {
  const oldDot = population.dots[dotIndex];
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(oldDot.x, oldDot.y, size, 0, 2 * Math.PI);
  ctx.stroke();
}

function CopyDot(dotIndex, copyDot) {
  population.dots[dotIndex].brain.Copy(
    copyDot.brain
  );

  population.dots[dotIndex].CopyColor(copyDot);

  let r = (Math.random() * 25);
  const a = Math.random() * 6.28;
  population.dots[dotIndex].x = Math.floor(r * Math.cos(a) + copyDot.x);
  population.dots[dotIndex].y = Math.floor(r * Math.sin(a) + copyDot.y);
  if (population.dots[dotIndex].x < 0) { population.dots[dotIndex].x = 0; }
  if (population.dots[dotIndex].x > ctx.canvas.width) { population.dots[dotIndex].x = ctx.canvas.width; }
  if (population.dots[dotIndex].y < 0)  {population.dots[dotIndex].y = 0; }
  if (population.dots[dotIndex].y > ctx.canvas.height) { population.dots[dotIndex].y = ctx.canvas.height; }

  population.dots[dotIndex].brain.Mutate();

  population.dots[dotIndex].vector.x = 0;
  population.dots[dotIndex].vector.y = 0;
  population.dots[dotIndex].energy = 5;
  population.dots[dotIndex].age = 0;
  population.dots[dotIndex].children = 0;
  population.dots[dotIndex].consumed = false;
  population.dots[dotIndex].generation++;
}

function DoTheThings() {
  centerX = ctx.canvas.width / 2;
  centerY = ctx.canvas.height / 2;

  let totalEnergy = 0;
  population.data.mostChildren = 0;

  for (let i = 0; i < population.dots.length; i++) {
    totalEnergy += population.dots[i].energy;
    population.dots[i].CheckDots(population);

    population.dots[i].DoMovement(centerX, centerY);

    if (population.dots[i].children > population.data.mostChildren) {
      population.data.mostChildrenIndex = i;
      population.data.mostChildren = population.dots[i].children;
    }

  }


  for (
    let dotIndex = 0; dotIndex < population.dots.length; dotIndex++
  ) {
    if (population.dots[dotIndex].CheckDeath() === true) {
      if (population.dots[dotIndex].children >= population.data.mostChildren) {
        population.dots[dotIndex].brain.Save();
      }

      let copyDot = {};

      // got et
      if (population.dots[dotIndex].consumed === true) {
        copyDot = population.dots[dotIndex].nearestDot;
        CopyDot(dotIndex, copyDot);
      } else {
        let copyIndex = Math.floor(Math.random() * population.dots.length);
        copyDot = population.dots[copyIndex];
        CopyDot(dotIndex, copyDot);
      }

    }
  }

  if (population.dots.length < upperLimit && fps > 40) {
    AddDots(1);
  }
}

function DrawGrid() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  DoTheThings();

  if (mode !== 'art') {
    // clear screen
    pixels = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
  }
  ////let index = 0;

  // draw
  for (let i = 0; i < population.dots.length; i++) {
    let x = Math.floor(population.dots[i].x);
    let y = Math.floor(population.dots[i].y);

    ////let dotSize = 1;

    if (!(
      x < 1 ||
      y < 1 ||
      x > ctx.canvas.width ||
      y > ctx.canvas.height
    )) {

      PlacePixel(x, y, population.dots[i].color, 0);
      if (mode!=='art') {
        PlacePixel(x - 1, y - 1, population.dots[i].color, 64);
        PlacePixel(x, y - 1, population.dots[i].color, 32);
        PlacePixel(x + 1, y - 1, population.dots[i].color, 64);

        PlacePixel(x - 1, y, population.dots[i].color, 32);
        
        PlacePixel(x + 1, y, population.dots[i].color, 32);

        PlacePixel(x - 1, y + 1, population.dots[i].color, 64);
        PlacePixel(x, y + 1, population.dots[i].color, 32);
        PlacePixel(x + 1, y + 1, population.dots[i].color, 64);
      }

    }
  }

  ctx.putImageData(pixels, 0, 0);
  
  const now = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift();
  }
  times.push(now);
  fps = times.length;

  // ctx.fillStyle = "white";
  // ctx.fillText("fps: " + fps + ", DotCount: " + population.dots.length, 20, 15);
  
  CircleDot(population.data.mostChildrenIndex, "green", 45);
  
  setTimeout(function () {
    DrawGrid();
  }, 1);
  
  return;
}


function PlacePixel(x, y, color, d) {
  const index = (x + y * ctx.canvas.width) * 4;
  pixels.data[index] = color.r - d;
  pixels.data[index + 1] = color.g - d;
  pixels.data[index + 2] = color.b - d;
  pixels.data[index + 3] = 255;
}


AddDots(10);
for (let i = 0; i < 120; i++) {
  times.push(performance.now());
}
DrawGrid();
