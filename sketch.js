const boids = [];
const obstacles = [];
const num = 1;
let aveY = 0;
// let imgnum = 1;
// let t = 0;
let table;

function dataTable() {
    table = new p5.Table();
    table.addColumn('i'); // boids index
    table.addColumn('x');
    table.addColumn('y');
    table.addColumn('theta');
    table.addColumn('Fg.x');
    table.addColumn('Fg.y');
    table.addColumn('Fi.x');
    table.addColumn('Fi.y');
    table.addColumn('Fobs.x');
    table.addColumn('Fobs.y');
    table.addColumn('Ftot.x');
    table.addColumn('Ftot.y');
    table.addColumn('v.x');
    table.addColumn('v.y');
    table.addColumn('ds'); // coherency
}

function setup() {
    createCanvas(600, 400);
    dataTable();
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
    for (let i = 0; i < 5; i++) {
        if(i < 1) {
            obstacles.push(new Obstacle(width*(3/8), aveY/num, 10, 0.975, 0.01, 150));
        } else {
            obstacles.push(new Obstacle(obstacles[i-1].position.x + 75, aveY/num, 10, 0.975, 0.01, 150));
        }
    }
    // obstacles.push(new Obstacle(width*(5/8), aveY/num, 10, 0.975, 0.01, 150));
    // obstacles.push(new Obstacle(width*(5/8) + 50, aveY/num + 30, 10, 0.975, 0.01, 150));
    // obstacles.push(new Obstacle(width*(5/8) + 50, aveY/num - 30, 10, 0.975, 0.01, 150));
    // obstacles.push(new Obstacle(width*(5/8) + 120, aveY/num, 10, 0.975, 0.01, 150));
}

function draw() {
    background(50);
    // let boidlast = boids[0]; // checking who's the last
    // let last = 0;
    // for (let i = 1; i < boids.length; i++ ) {
    //     if( boids[i].position.x < boidlast.position.x ) {
    //         boidlast = boids[i];
    //         last = i;
    //     }
    // }
    // boids[last].change = true;
    for (let obs of obstacles) {
        obs.show();
    }
    for (let boid of boids) {
        boid.update(mouseX, mouseY); // use this to moves the boids/individuals based on mouse position
        boid.Ftotal(boids, boid.check(obstacles));
        // let F = boid.Ftotal(boids,boid.check(obstacles));
        // let newRow = table.addRow();
        // newRow.setNum('i', boid.index + 1); // boids index
        // newRow.setNum('x', boid.position.x);
        // newRow.setNum('y', boid.position.y);
        // newRow.setNum('theta', degrees(boid.thetai(F)));
        // newRow.setNum('Fg.x', boid.Fg().x);
        // newRow.setNum('Fg.y', boid.Fg().y);
        // newRow.setNum('Fi.x', boid.Fi(boids).x);
        // newRow.setNum('Fi.y', boid.Fi(boids).y);
        // newRow.setNum('Fobs.x', boid.Fobs(boid.check(obstacles)).x);
        // newRow.setNum('Fobs.y', boid.Fobs(boid.check(obstacles)).y);
        // newRow.setNum('Ftot.x', F.x);
        // newRow.setNum('Ftot.y', F.y);
        // newRow.setNum('v.x', p5.Vector.add(boid.velocity, F).x);
        // newRow.setNum('v.y', p5.Vector.add(boid.velocity, F).y);
        // newRow.setNum('ds', boid.coherency(boids)); // coherency
        // newRow.setNum('vy');
        // F.normalize();
        // F.mult(10);
        // boid.update(boids,boid.check(obstacles));
        boid.show();
        // push();
        //     strokeWeight(1);
        //     stroke(0,0,255);
        //     line(boid.position.x, boid.position.y, boid.position.x + F.x, boid.position.y + F.y);
        // pop();
        // print(boid.equilibrium(boids));
        // boid.change = false;
    }
    // noLoop();
    // if (boidlast.position.x > width + boidlast.lij + 5) {
    //     print('Process terminated');
    //     // saveTable(table, 'new.csv');
    //     noLoop();
    // }
    // } else {
    //     saveimg();
    // }
}

function saveimg() { // saving img per frame
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
