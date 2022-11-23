let permissionGranted = false;
let mic;
let mode;
let rainbow;
let hue;
let rate = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //for eventual movement
  cx = width / 2;
  cy = height / 2;

  //for landing pages
  mode = 0;

  //for rainbow brush
  hue = 0;

  setShakeThreshold(10);

  //for devices that ask permission and don't, learnt from "designers do code" on youtube
  if (DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
    DeviceOrientationEvent.requestPermission();
  }

  DeviceOrientationEvent.requestPermission()
    .catch(() => {
      button = createButton("click to allow access to sensors");
      button.style("font-size", "24px");
      button.center();
      button.mousePressed(requestAccess);
      throw error;
    })
    .then(() => {
      permissionGranted = true;
    });
}

function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then((response) => {
      if (response == "granted") {
        permissionGranted = true;
      } else {
        permissionGranted = false;
      }
    })
    .catch(console.error);
  this.remove();
}

function draw() {
  clear();

  if (!permissionGranted) return;
  if (permissionGranted) {
    mode = +1;
  }

  touchAmount = touches.length;
  //after permission, welcoming screen
  if (mode == 1) {
    noStroke();
    fill("orange");
    textFont("Open Sans");
    textSize(36);
    textAlign(CENTER);
    fill("ivory");
    text("Welcome!");
    textSize(24);
    text(
      "Are you ready to compose your drawing? You have to prep your voice... and when you are ready"
    );
    textSize(36);
    text("just shake your phone!");
  }

  //after welcoming screen, drawing board
  if (mode >= 1) {
    background("ivory");

    //contrain() learnt from "designers do code" on Youtube, determines highest and lowest limits for a specific value
    const dx = constrain(rotationY, -3, 3);
    const dy = constrain(rotationX, -3, 3);
    cx += dx * 2;
    cy += dy * 2;
    cx = constrain(cx, 0, width);
    cy = constrain(cy, 0, height);

    //using the mic to change size of the ellipses based on volume of audio caught by the mic
    if (mic) {
      const micLevel = mic.getLevel();
      let d = map(micLevel, 0.5, 6, width);
    }

    //rainbow brush that changes by itself, this is to ensure that it doesnt stop at a single color when done but starts all over again
    if (hue > 360) {
      hue = 0;
    } else {
      hue++;
    }

    //creating ellipses to become the brush stroke
    colorMode(HSL, 360);
    noStroke();
    fill(hue, 200, 200);
    ellipse(cx, cy, d);

    //to clear canvas when wanting to start over
    //if (touchAmount == 2) {
    //clear();
    //}
  }
}

function touchEnded() {
  userStartAudio();
  mic = new p5.AudioIn();
  mic.start();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function deviceShaken() {
  mode = +1;
}
