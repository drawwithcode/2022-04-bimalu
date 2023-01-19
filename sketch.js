let start = false; //welcome screen
let isMobile; //check for mobile device
let mic;
let circleX, circleY;
let circleColor; //rainbow brush
let circleHue = 0; //rainbow brush
let circleChanging = true; //changing brush color
let backgroundColor; //changing background color
//instruction icons
let drawIcon;
let shakeIcon;
let micIcon;
let dragIcon;
//initial circle size
let circleSize = 5;
//rainbow text
let textColor;
let textHue = 0;


function preload(){
  //instruction icons
  drawIcon = loadImage("./assets/draw.png");
  shakeIcon = loadImage("./assets/shake.png");
  micIcon = loadImage("./assets/mic.png");
  dragIcon = loadImage("./assets/drag.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //check if mobile device
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
  } else {
    isMobile = false;
  }
  //mic sound input
  mic = new p5.AudioIn();
  mic.start();
  circleX = width/2;
  circleY = height/2;
  //rainbow brush and text
  circleColor = color(circleHue, 100, 100);
  textColor = color(textHue,100,100);
  backgroundColor = color(255);
  angleMode(DEGREES);
  rectMode(CENTER);
  background(backgroundColor);
}

function draw() {
  //if it is a mobile device start experience
  if (isMobile) {
  if (!start) {
    welcomeScreen();
  } else {
    drawing();
  }
} else {
  //if it is not a mobile device show message
  background('black')
  textSize(32);
  textAlign(CENTER, CENTER);
  textHue = (textHue + 1) % 360;
  textColor = color(`hsl(${textHue}, 100%, 50%)`)
  fill(textColor);
  textFont("Coming Soon")
  text("Oh no! It's no fun over here, you need to access this with a phone.", width/2, height/2);
}
}

//instruction screen before starting experience
function welcomeScreen() {
  background('black')
  textFont("Coming Soon")
  textSize(32);
  textAlign(CENTER, CENTER);
  //rainbow fill for the text
  textHue = (textHue + 1) % 360;
  textColor = color(`hsl(${textHue}, 100%, 50%)`)
  fill(textColor);
  text("Welcome!", width/2, height/8);
  textSize(18);
  fill('white');
  text("If you enjoy drawing", width/2, height/8+50);
  text("and like a little creativity,", width/2, height/8+80);
  text("then you are in the right place...", width/2, height/8+110);

  //instruction icons
  image(drawIcon, width/4-40, height/8+160, 130, 130);
  image(micIcon, width/2+15, height/8+160, 130, 130);
  image(shakeIcon, width/4-40, height/8+320, 130, 130);
  image(dragIcon, width/2+15, height/8+320, 130, 130)

  //'start' button
  fill(textColor);
  rect(width/2, height/2+280, 150, 50);
  fill(0);
  textSize(18);
  text("Start", width/2, height/2+282);
}

//if the button is pressed the canvas is cleared
function touchStarted() {
  if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > height/2 + 105 && mouseY < height/2 + 355) {
    start = true;
    clear();
    //time delay after button is pressed before the drawing experience
    setTimeout(drawing, 2000);
  }
}

//drawing experience
function drawing() {
  //if statement to go from rainbow brush to random solid colours
  if (circleChanging) {
    //starting with rainbow brush
    circleHue = (circleHue + 1) % 360;
    circleColor = color(`hsl(${circleHue}, 100%, 50%)`);
  }
  fill(circleColor);
  noStroke();
  //creating circle to change size based on mic sound input and position based on device rotation
  let vol = mic.getLevel();
  circleSize = map(vol, 0, 1, 10, width);
  ellipse(circleX, circleY, circleSize);
  circleX += map(rotationY, -90, 90, -5, 5);
  circleY += map(rotationX, -90, 90, -5, 5);
  circleX = constrain(circleX, 0, width);
  circleY = constrain(circleY, 0, height);
}

//changing circle colour based on touch
function touchMoved() {
  circleChanging = false;
  circleColor = color(random(255), random(255), random(255));
}

//changing background colour when device is shaken
function deviceShaken() {
  backgroundColor = color(random(255), random(255), random(255));
  background(backgroundColor);
}

//requesting permission to access device orientation sensors for experience
function touchEnded(event) {
	if(DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
		DeviceOrientationEvent.requestPermission()
	}
}
