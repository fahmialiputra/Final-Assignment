const boids = [];
const obstacles = [];
const num = 15;
let aveY = 0;
// let imgnum = 1;
// let t = 0;

function setup() {
    createCanvas(600, 400);
    for (let i = 0; i < num; i++) {
    	boids.push(new Boid(i));
        // while(boids[i].overlapPos(boids)) { // changing boids position so its not overlapping each other
            // let newpos = createVector(random(width/16, width/8), random(height*(3/4), height*(3/4) + 50));
            // boids[i].position.mult(0);
            // boids[i].position.add(newpos);
        // }
        aveY += boids[i].position.y;
    }
    // Obstacle(x, y, radius, alphaLJ, Eobs, color)
    obstacles.push(new Obstacle(width*(5/8), aveY/num, 10, 0.975, 0.01, 150));
    // obstacles.push(new Obstacle(width*(5/8) + 50, aveY/num + 30, 10, 0.975, 0.01, 150));
    // obstacles.push(new Obstacle(width*(5/8) + 50, aveY/num - 30, 10, 0.975, 0.01, 150));
    // obstacles.push(new Obstacle(width*(5/8) + 120, aveY/num, 10, 0.975, 0.01, 150));
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
    for (let boid of boids) {
        // boid.update(mouseX, mouseY); // use this to moves the boids/individuals based on mouse position
        // boid.check(obstacles);
        boid.update(boids,boid.check(obstacles));
        boid.show();
        boid.change = false;
    }
    // noLoop();
    if (boidlast.position.x > width + boidlast.lij + 5) {
        print('Process terminated');
        noLoop();
    }
    // } else {
    //     savingimg();
    // }
}

function savingimg() { // saving img per frame
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
}
