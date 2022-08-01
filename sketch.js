const boids = [];
const obstacles = [];
const num = 10;
let t = 0;

function setup() {
    createCanvas(600, 400);
    for (let i = 0; i < num; i++) {
    	boids.push(new Boid());
    }
    for (let i = 0; i < 1; i++) {
        // Obstacle(x, y, r, color)
        obstacles.push(new Obstacle(random(width*(2/3), width*(7/8)), random(height*(2/3), height*(7/8)), 10, 150));
    }
}

function draw() {
    background(50);
    for (let obs of obstacles) {
        obs.show();
    }
    // push();
    //     strokeWeight(1);
    //     stroke(255,0,0);
    //     line(boids[0].position.x, boids[0].position.y, obstacles[0].position.x, obstacles[0].position.y);
    // pop();
    for (let boid of boids) {
        // boid.edges();
        // boid.update(boids, obstacles);
        boid.update(boids,boid.check(obstacles));
        // boid.show();
    }
    // noLoop();
    // boids[0].ds(boids);
    if (t >= num*2) {
    // if (t > 0) {
        print('Process terminated');
    //     print('Boid-1 v(' + boids[0].velocity.x + ', ' + boids[0].velocity.y +
    //     ') heading to ' + degrees(boids[0].or).toFixed(2));// boids[0].heading.x + ', ' + boids[0].heading.y + ')');
        t++;
        noLoop();
    }
}
