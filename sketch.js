const boids = [];
const obstacles = [];
const num = 15;
let aveY = 0;
// let newposCount = 0;
// let t = 0;
// let imgnum = 1;

function setup() {
    createCanvas(600, 400);
    for (let i = 0; i < num; i++) {
    	boids.push(new Boid(i));
        // while(boids[i].overlapPos(boids)) { // changing boids position so its not overlapping each other
            // let newpos = createVector(random(width/16, width/8), random(height*(3/4), height*(3/4) + 50));
            // boids[i].position.mult(0);
            // boids[i].position.add(newpos);
            // newposCount++;
        // }
        aveY += boids[i].position.y;
    }
    // print('Changing boids position: ' + newposCount + 'x');
    obstacles.push(new Obstacle(width*(5/8), aveY/num, 10, 150));
    obstacles.push(new Obstacle(width*(5/8) + 50, aveY/num + 30, 10, 150));
    obstacles.push(new Obstacle(width*(5/8) + 50, aveY/num - 30, 10, 150));
    obstacles.push(new Obstacle(width*(5/8) + 120, aveY/num, 10, 150));
    // background(50);
}

function draw() {
    background(50);
    let boidlast = boids[0]; // checking who's the last
    let last = 0;
    for (let i = 1; i < boids.length; i++ ) {
        if( boids[i].position.x < boidlast.position.x ) {
            boidlast = boids[i];
            last = i;
        }
    }
    boids[last].change = true;
    for (let obs of obstacles) {
        obs.show();
    }
    // boids[0].check(obstacles);
    // boids[0].update(mouseX, mouseY);
    // boids[0].show();
    // push();
    //     strokeWeight(1);
    //     stroke(255,0,0);
    //     line(boids[0].position.x, boids[0].position.y, obstacles[0].position.x, obstacles[0].position.y);
    // pop();
    for (let boid of boids) {
        // if( boid != boids[0] ){
        //     push();
        //         strokeWeight(1);
        //         stroke(0,255,0);
        //         line(boids[0].position.x, boids[0].position.y, boid.position.x, boid.position.y);
        //     pop();
        // }
        // boid.overlap(boids);
        boid.update(boids,boid.check(obstacles));
        boid.show();
        boid.change = false;
    }
    // noLoop();
    // print('Boid-1 coherency: ' + boids[0].coherency(boids));
    // if (t > 0) {
    if (boidlast.position.x > width + boidlast.lij + 5) {
        print('Process terminated');
        // print('Boid-1 v(' + boids[0].velocity.x + ', ' + boids[0].velocity.y +
        // ') heading to ' + degrees(boids[0].or).toFixed(2));// boids[0].heading.x + ', ' + boids[0].heading.y + ')');
        // t++;
        noLoop();
    }
    // } else {
    //     savingimg();
    // }
}

function savingimg() {
    // if (t < 300) {
    // if (t < 300 &&  t % 2 < 1) {
        let numimg = 1;
        if(imgnum.toString().length < 3) {
            if(imgnum.toString().length < 2) {
                numimg = '00' + imgnum;
            } else {
                numimg = '0' + imgnum;
            }
        } else {
            numimg = imgnum.toString();
        }
        saveCanvas('Flocking' + numimg, 'png');
        imgnum++;
    // }
    // t++;
}