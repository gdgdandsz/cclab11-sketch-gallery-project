//the image of the fish,;the reminds on top(die with time), the number of the shells, the size of the fish

let bubbles = [];
let water;
let fish;
let shells = [];
function setup() {
  let canvas = createCanvas(1.5*450, 450);//Here, I adjust the width and height of the canvas
  canvas.parent("canvasContainer");
  water = new Water(width / 2, 450 * 1.7);
  fish = new Fish(
    random(10, width - 10),
    random(450 - 100, 450 - 20)
  );//the fish will appear anywhere when the mouse is in Canvas
  for (let i = 0; i < 20; i++) {
    bubbles[i] = new Bubbles(
      random(10, width - 10),
      random(450 - 150, 450)
    );
  }
  let s = new Shells(
    random(10, width - 10),
    random(450 - 100, 450 - 20)
  );
  shells.push(s);
}

function draw() {
  background(213, 245, 242);
  water.update();
  water.display();

  //fish
  fish.checkDist();//check the distance between the fish and the shells
  fish.update();
  fish.checkWater();
  //update should be above checkWater, or the d and the r are 0
  //console.log(fish.isAboveWater);
  if (
    fish.check == false &&
    fish.isAboveWater == false &&
    mouseX > 0 &&
    mouseX < width
  ) {//these are the conditions that the fish is still alive
    fish.attractedTo(mouseX, mouseY);
    fish.move();
    fish.slowDown();
    fish.display();
    //fish.checkWater();//bug: lose at first click
    //put everything within the condition
  }
  
  //three possible conditions of losing
  noFill();
  if (fish.check == true && fish.sizeX <= 120) {
    textSize(40);
    text("You Lose!!!", 10, 40);
    stroke(255);
    text("Caught by Men", 10, 450 - 40);
  } //#1
  else if (fish.isAboveWater == true && fish.sizeX <= 120) {
    stroke(0);
    textSize(40);
    text("You Lose!!!", 10, 40);
    stroke(255);
    text("Above the Water", 10, 450 - 40);
  } //#2
  else if (shells.length >= 10 && fish.sizeX <= 120) {
    stroke(0);
    textSize(40);
    text("You Lose!!!", 10, 40);
    stroke(255);
    text("Hungry", 10, 450 - 40);
  } //#3
  
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].update();
    bubbles[i].move();
    // bubbles[i].update1();
    // bubbles[i].update2();
    // bubbles[i].update3();
    // //is this necessary?//not necessary, can be solved in one method
    bubbles[i].display();
    bubbles[i].reappear();
  }
  for (let i = 0; i < shells.length; i++) {
    shells[i].update();
    shells[i].display();
    shells[i].repelledFrom(mouseX, mouseY);
    shells[i].move();
    shells[i].slowDown();
    shells[i].checkDistSF();//check the distance between the fish and the shells
    shells[i].bounce();//in case the shells are out of the canvas or above the water
  }
  if (frameCount % 250 == 0) {
    let s = new Shells(
      random(10, width - 10),
      random(450 - 100, 450 - 20)
    );
    shells.push(s);
    //the appearance of the shells
  }

  for (let i = 0; i < 20; i++) {
    fill(255, random(120, 180));
    circle(random(width), random((3 * height) / 5, height), random(2));//to create the feeling of water
  }

  //light/glow (mouse)
  noCursor();
  push();
  noStroke();
  fill(255, 20);
  for (i = 0; i < 20; i++) {
    ellipse(mouseX, mouseY, i * 2);
  }
  fill(255);
  stroke(0);
  pop(); //reference:https://editor.p5js.org/jesse_harding/sketches/WpONQ8o6u
  
  for (let i = shells.length - 1; i >= 0; i--) {
    if (shells[i].checkDis == true) {
      shells.splice(i, 1);
      fish.sizeX += 10;
      fish.sizeY += 10;
      //console.log(fish.sizeX);
      //if the fish touches the shell, the shell will be eaten/disappear from the canvas
    }
  }
  if (fish.sizeX > 120) {
    textSize(40);
    stroke(0);
    text("You Win!!!", 10, 40);
  }//the condition of winning
  textSize(20);
  stroke(0);
  fill(255);
  text('Number of shells: '+shells.length,2*width/3+40,35);
  text('Weight of fish: '+fish.sizeX,2*width/3+40,70);
  stroke(0);
  //noFill();
  textSize(20);
  text('You can control the fish',10,70)//based on the feedback
  textSize(10)
  text('Avoid touching the fishing rod, or you will be caught by men',width/2+35,450-40);
  text('Avoid moving above the water, or you will die of water loss',width/2+35,450-25);
  text('Try to eat the shells as many as you can, or you will die of hunger',width/2+35,450-10);
}//reminding of the numbers

class Water {
  constructor(x, y) {
    this.angle = 0;
    this.x = x;
    this.y = y;
    this.diaWidth = 2.8 * 450;
    this.diaHeight = 2.6 * 450;
    this.lineX = random(width / 6, width / 2);
    this.lineY1 = random(450 / 17, 450 / 10);
    this.lineY = random((2 * 450) / 3, (5 * 450) / 6);
    this.lineY2=0
    this.transparency = 0;
  }
  update() {
    this.angle = 0 + 0.5 * frameCount;
    this.lineY2 = this.lineY+45*sin(frameCount*0.05);//based on the feedback, add the change to the fishing rod
    this.transparency = 220 + 60 * sin(frameCount * 0.01);
  }
  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(6, 43, 89, this.transparency);
    rotate(radians(this.angle));
    //console.log(this.angle);
    //console.log(radians(this.angle))
    ellipse(0, 0, this.diaWidth, this.diaHeight);
    //rotate(radians(this.angle));
    //a rotating ellipse to create the feeling of moving water
    pop();
    stroke(0);
    strokeWeight(5);
    line(0, this.lineY1, this.lineX, this.lineY1);
    line(this.lineX, this.lineY1, this.lineX, this.lineY2);
    strokeWeight(3);
    noFill();
    circle(this.lineX - 12, this.lineY2, 24);//fishing rod
  }
}

class Bubbles {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dia = random(5, 20);
    this.xSpd = 0;
    this.ySpd = 0;
    this.c1 = random(220, 255);
    this.c2 = random(220, 255);
    this.c3 = random(220, 255);
    this.transparency = random(130, 180);
    this.transparency = random(130, 180);
    this.r = 0;
    this.angle1 = 0;
    this.s = 0;
    this.c = 0;
    this.d = 0;
  }
  update() {
    this.xSpd = random(-3, 3);
    this.ySpd = random(-5, -0.5);
    this.dia -= 0.1;
    //in order to make the bubbles under water, need to calculate the angle of a point on surface of water to the center of the ellipse
    this.angle1 = atan2(this.y - water.y, this.x - water.x) * (180 / PI);
    this.s = sin(radians(water.angle + this.angle1));
    this.c = cos(radians(water.angle + this.angle1));
    this.r =
      (0.5 * (water.diaWidth * water.diaHeight)) /
      sqrt(
        water.diaWidth * water.diaWidth * this.s * this.s +
          water.diaHeight * water.diaHeight * this.c * this.c
      );
    //r is the distance between the water surface and the center of the ellipse
    //reference from: https://www.folkstalk.com/2022/09/how-to-find-angle-between-two-points-with-code-examples.html
    this.d = dist(this.x, this.y, water.x, water.y);
    //d is the distance between the bubbles and the center of the ellipse
    // console.log('d',this.d);
    // console.log('s',this.s);
    // console.log('a',this.angle1);
    // console.log('r',this.r);//testing
  }
  move() {
    this.x += this.xSpd;
    this.y += this.ySpd;
  }
  // update1() {
  //   this.angle1 = atan2(this.y - water.y, this.x - water.x) * (180 / PI);
  // }
  // update2() {
  //   this.s = sin(radians(water.angle + this.angle1));
  //   this.c = cos(radians(water.angle + this.angle1));
  // }
  // update3() {
  //   this.r =
  //     (0.5 * (water.diaWidth * water.diaHeight)) /
  //     sqrt(
  //       water.diaWidth * water.diaWidth * this.s * this.s +
  //         water.diaHeight * water.diaHeight * this.c * this.c
  //     );
  //   //r is the distance between the water surface and the center of the ellipse
  //   //reference from: https://www.folkstalk.com/2022/09/how-to-find-angle-between-two-points-with-code-examples.html
  //   this.d = dist(this.x, this.y, water.x, water.y);
  //   //d is the distance between the bubbles and the center of the ellipse
  //   // console.log('d',this.d);
  //   // console.log('s',this.s);
  //   // console.log('a',this.angle1);
  //   // console.log('r',this.r);//testing
  // }

  reappear() {
    if (this.d >= this.r - 20) {
      this.y = 450;
      this.dia = random(5, 20);
      //the bubbles will reappear from the bottom, with different sizes
    }
  }
  display() {
    fill(this.c1, this.c2, this.c3, this.transparency);
    noStroke();
    circle(this.x, this.y, this.dia);
  }
}

function mousePressed() {
  for (let i = 0; i < 5; i++) {
    bb = new Bubbles(mouseX, mouseY);
    bubbles.push(bb);
  }//create new bubbles
}

class Shells {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dia = random(5, 15);
    this.angle = 0;
    this.r = random(180, 255);
    this.g = random(180, 255);
    this.b = random(180, 255);
    this.trans = random(150, 255);
    this.offset = 0;
    this.xSpd = random(-1, 1);
    this.ySpd = random(-5, -3);
    this.distSF = 0;
    this.checkDis = false;
    this.d = 0;
  }
  update() {
    this.angle++;
    this.offset = map(sin(radians(this.angle)), -1, 1, -50, 50);
    //this.offset to create the effect of moving regularly horizontally
  }
  display() {
    push();
    translate(this.x + this.offset, this.y);
    rectMode(CENTER);
    fill(this.r, this.g, this.b, this.trans);
    rect(0, 0, this.dia);
    fill(this.r, this.g, this.b);
    arc(
      0,
      this.dia / 2,
      3 * this.dia,
      3.8 * this.dia,
      (7 * PI) / 6,
      (11 * PI) / 6
    );
    pop();
    //the shape of the shells
  }
  repelledFrom(targetX, targetY) {
    let distance = dist(this.x, this.y, targetX, targetY);
    if (distance < 50) {
      let xAcc = (targetX - this.x) * -1 * 0.05;
      let yAcc = (targetY - this.y) * -0.05;
      this.xSpd += xAcc;
      this.ySpd += yAcc;
      //the shells are repelled from the position of the fish, adding difficulty to this game
    }
  }
  move() {
    this.x += this.xSpd;
    this.y += this.ySpd;
    this.distSF = dist(this.x + this.offset, this.y, fish.x, fish.y);//the distance between the fish and the shells
    this.d = dist(this.x, this.y, water.x, water.y);
  }
  slowDown() {
    this.xSpd = this.xSpd * 0.9;
    this.ySpd = this.ySpd * 0.9; // 10% less per frame
  }
  checkDistSF() {
    if (this.distSF < 20) {
      this.checkDis = true;
    }
    //boolen: check whether the fish eats the shell
  }
  bounce() {
    if (this.x < 0) {
      this.x = 0;
      this.xSpd = this.xSpd * -1;
    } else if (this.x > width) {
      this.x = width;
      this.xSpd = this.xSpd * -1;
    }
    if (this.y > height) {
      this.y = height;
      this.ySpd = this.ySpd * -1;
    } else if (this.y < 450 / 2) {
      this.y = 450 / 2;
      this.ySpd = this.ySpd * -1;
    }
    //in case the shells are out of the canvas or above the water
    // else if (this.y > height) {
    //   this.y = height;
    //   this.ySpd = this.ySpd * -1;
    // }
  }
}

class Fish {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xSpd = random(-1, 1);
    this.ySpd = random(-4, -2);
    this.dia = 50;
    this.m = 0;
    //this.c = color(0, 0, 0, 0);
    this.sizeX = 60;
    this.sizeY = 30;
    this.check = false;
    this.r = 0;
    this.angle1 = 0;
    this.s = 0;
    this.c = 0;
    this.d = 0;
    this.isAboveWater = false;
  }

  attractedTo(targetX, targetY) {
    let xAcc = (targetX - this.x) * 0.001;
    let yAcc = (targetY - this.y) * 0.001;
    this.xSpd += xAcc;
    this.ySpd += yAcc;
    //the fish will chase the mouse
  }
  slowDown() {
    this.xSpd = this.xSpd * 0.97;
    this.ySpd = this.ySpd * 0.97; // 3% less per frame
  }
  move() {
    this.x += this.xSpd;
    this.y += this.ySpd;
  }
  update() {
    this.angle1 = atan2(this.y - water.y, this.x - water.x) * (180 / PI);
    //same as the bubbles, calculate the angle of certain point on surface to calculate the distance
    this.s = sin(radians(water.angle + this.angle1));
    this.c = cos(radians(water.angle + this.angle1));
    this.r =
      (0.5 * (water.diaWidth * water.diaHeight)) /
      sqrt(
        water.diaWidth * water.diaWidth * this.s * this.s +
          water.diaHeight * water.diaHeight * this.c * this.c
      );
    //r is the distance between the water surface and the center of the ellipse
    //reference from: https://www.folkstalk.com/2022/09/how-to-find-angle-between-two-points-with-code-examples.html
    this.d = dist(this.x, this.y, water.x, water.y);
    // console.log('d',this.d)
    // console.log('r',this.r);
    // console.log(bubbles[i].r)// i is not defined
    //use console.log to test 
    //since bubbles is an array, we cannot directly call it
    //can only write a this.r for this class
  }
  checkWater() {
    if (this.d > this.r - 10) {
      // console.log('d',this.d)
      // console.log('r',this.r)//test
      this.isAboveWater = true;
    }
    //check whether the fish is above water
  }
  display() {
    push();
    noStroke();
    //this.c=color(88,252,244，1);//the last two colors should be within 100//finally decide not to use HSL
    if (this.x < mouseX) {
      fill(148, 235, 232);
      triangle(this.x-30,this.y,this.x-20-1.1*this.sizeX,this.y-10+this.sizeY,this.x-20-1.1*this.sizeX,this.y+10-this.sizeY);
      triangle(
        this.x,
        this.y,
        this.x - this.sizeX,
        this.y + this.sizeY,
        this.x - this.sizeX,
        this.y - this.sizeY
      );
      fill(0)
      circle(this.x-15,this.y,8)
    }
    if (this.x > mouseX) {
      fill(148, 235, 232);
      triangle(this.x+30,this.y,this.x+20+1.1*this.sizeX,this.y-10+this.sizeY,this.x+20+1.1*this.sizeX,this.y+10-this.sizeY)
      triangle(
        this.x,
        this.y,
        this.x + this.sizeX,
        this.y + this.sizeY,
        this.x + this.sizeX,
        this.y - this.sizeY
      );
      fill(0)
      circle(this.x+15,this.y,8)
    }
    pop();
  }
  //the direction of the fish
  checkDist() {
    if (dist(this.x, this.y, water.lineX, water.lineY2) < 30) {
      this.check = true;
    }
    //check whether the fish is caught by men
  }
}
