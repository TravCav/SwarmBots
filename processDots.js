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
    mostChildrenIndex: 0,
    previousMostChildrenIndex: 0
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

  let r = (Math.random() * 50);
  const a = Math.random() * 6.28;
  population.dots[dotIndex].x = Math.floor(r * Math.cos(a) + copyDot.x);
  population.dots[dotIndex].y = Math.floor(r * Math.sin(a) + copyDot.y);
  if (population.dots[dotIndex].x < 0) { population.dots[dotIndex].x = 0; }
  if (population.dots[dotIndex].x > ctx.canvas.width) { population.dots[dotIndex].x = ctx.canvas.width; }
  if (population.dots[dotIndex].y < 0) { population.dots[dotIndex].y = 0; }
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

  if (population.data.mostChildrenIndex != population.data.previousMostChildrenIndex) {
    population.data.previousMostChildrenIndex = population.data.mostChildrenIndex;
    population.dots[population.data.mostChildrenIndex].brain.Save();

  }

  let yeetAndDelete = [];
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
        yeetAndDelete.push(dotIndex);
      }

    }
  }

  // population control
  if (fps > 30) {
    AddDots(1);
  }

  if (fps < 20 && population.dots.length > 100) {
    for (let index = 0; index < yeetAndDelete.length; index++) {
      population.dots.splice(yeetAndDelete[index], 1);
    }
  }

}


function blendColors(color1, color2) {
  const blendedR = Math.floor((color1.r + color2.r) / 2);
  const blendedG = Math.floor((color1.g + color2.g) / 2);
  const blendedB = Math.floor((color1.b + color2.b) / 2);

  return { r: blendedR, g: blendedG, b: blendedB };
}
function drawConnections(dots) {
  for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];

      // Check if the dot has found the nearest dot
      if (dot.nearestDot) {
          const dx = dot.x - dot.nearestDot.x;
          const dy = dot.y - dot.nearestDot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Blend the colors of the two dots
          const blendedColor = blendColors(dot.color, dot.nearestDot.color);

          // Line color based on the blended color of the dots
          const opacity = 1 - (distance / 300); // Adjust opacity with distance
          ctx.strokeStyle = `rgba(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b}, ${Math.max(0, opacity)})`;

          ctx.lineWidth = 0.5;

          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(dot.nearestDot.x, dot.nearestDot.y);
          ctx.stroke();
      }

      // Check if the dot has found an edible target (most energetic food)
      if (dot.mostEnergeticFood) {
          const dx = dot.x - dot.mostEnergeticFood.x;
          const dy = dot.y - dot.mostEnergeticFood.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Blend the colors of the two dots
          const blendedColor = blendColors(dot.color, dot.mostEnergeticFood.color);

          // Line color based on the blended color of the dots
          const opacity = 1 - (distance / 100); // Adjust opacity with distance
          ctx.strokeStyle = `rgba(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b}, ${Math.max(0, opacity)})`;

          ctx.lineWidth = 1.0; // Make this line slightly thicker

          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(dot.mostEnergeticFood.x, dot.mostEnergeticFood.y);
          ctx.stroke();
      }
  }
}



function drawParticle(x, y, color, radius) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
  gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 1)`);
  gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}


function DrawGrid() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  DoTheThings();

  // Clear the screen
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // First, each dot finds its nearest and most energetic food
  for (let i = 0; i < population.dots.length; i++) {
      let dot = population.dots[i];
      dot.CheckDots(population); // Find nearest and most energetic food dots
  }

  // Draw the connections to both nearest and most energetic dots
  drawConnections(population.dots);

  // Draw each dot as a particle
  for (let i = 0; i < population.dots.length; i++) {
      let dot = population.dots[i];

      // Calculate the radius based on energy
      let radius = dot.calculateRadius();

      // Draw the particle with a glow
      drawParticle(dot.x, dot.y, dot.color, radius);
  }

  // Track and display frame rate and dot count
  const now = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
  }
  times.push(now);
  fps = times.length;

  var networkDiv = document.getElementById("mynetwork");
  if (networkDiv.style.display === "block") {
      ctx.fillStyle = "white";
      ctx.fillText("fps: " + fps + ", DotCount: " + population.dots.length, 20, 15);
  }

  CircleDot(population.data.mostChildrenIndex, "green", 45);

  setTimeout(function () {
      DrawGrid();
  }, 1);
}




function PlacePixel(x, y, color, d) {
  d = d * 0.5;
  const index = (x + y * ctx.canvas.width) * 4;
  pixels.data[index] = color.r - d;
  pixels.data[index + 1] = color.g - d;
  pixels.data[index + 2] = color.b - d;
  pixels.data[index + 3] = 255;
}


AddDots(25);
for (let i = 0; i < 120; i++) {
  times.push(performance.now());
}
DrawGrid();
