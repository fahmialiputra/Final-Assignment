class Boid {
    constructor() {
        // this.position = createVector(width / 2 + round(200*random(0,1)), height / 2 + round(200*random(0,1)));
        this.position = createVector(random(width/16, width/8), random(height*(3/4), height*(3/4) + 50));
        this.heading = createVector();
        this.or = 0;
        this.sensing = 50; // sensing radius
        this.velocity = createVector();
        this.acceleration = createVector();
        this.maxSpeed = 2;
        this.v0 = 0.5;
        this.k = 0.01;
        this.lij = 35;
        this.Dr = 1;
        this.Dt = 1;
        this.unitvector = createVector(1,0);
        this.unitvector_perpendicular = createVector(0,1);
        this.wg = 2;
        this.Er = createVector(random(0,0.1),0);
        this.Et = random(-PI/12,PI/12);
    }

    rij(i,j) {
        return p5.Vector.sub(j, i);
    }

    Fi(boids) {
        let F = createVector();
        stroke(100);
        for (let other of boids) {
            if (other != this) {
                let r = this.rij(this.position, other.position);
                // line(this.position.x, this.position.y, other.position.x, other.position.y);
                r.mult(-this.k*((1/r.mag()) - (1/this.lij)));
                F.add(r);
            }
        }
        return F;
    }

    Fg(v) {
        let F = v;
        F.mult(this.wg);
        return F;
    }

    check(obs) {
        let checked = [];
        // print('Obs be counted    : ' + obs.length);
        // print('Obs count (before): ' + checked.length);
        for (let o of obs) {
            let d = dist(this.position.x, this.position.y,
                o.position.x, o.position.y);
            // let r = this.rij(this.position, o.position);
            // print('rsens > |rio|: ' + (this.sensing > r));
            // print(' dobs <= rsens : ' + (d <= this.sensing));
            // print('|rio| <= rsens : ' + (r <= this.sensing)); false? why?
            // if(r <= this.sensing) {
            if (d <= this.sensing) {
                checked.push(o);
            }
        }
        // print('Obs count (after) : ' + checked.length);
        return checked;
    }

    Fobs(obs) {
        let F = createVector();
        let sigmaobs = this.sensing*sqrt(2);
        for (let o of obs) {
            let r = this.rij(this.position, o.position);
            // print(' rio : (' + r.x + ', ' + r.y + ')');
            // print('|rio|: ' + r.mag());
            r.mult(o.pobs*(pow(sigmaobs/r.mag(),2*o.alphaLJ) - 2*pow(sigmaobs/r.mag(),o.alphaLJ)));
            F.add(r);
        }
        return F;
    }

    Ftotal(boids,obs) {
        let vd = createVector(1,0);
        let F = createVector();
        F.add(this.Fi(boids));
        F.add(this.Fg(vd));
        F.sub(this.Fobs(obs));
        return F;
    }

    ds(boids){
        let sum = 0;
        let coherency = createVector();
        let N = boids.length;
        stroke(255,0,0);
        strokeWeight(1);
        for (let i = 0; i < N-1; i++) {
            for (let j = 0; j < N; j++) {
                let r = boids[i].rij(boids[i].position,boids[j].position);
                coherency.add(r);
                sum += r.mag();
            }
        }
        print('1:' + sum);
        print('2:' + (sum *= (2 / (N*(N-1)))));
        print('3:' + sum);
        coherency.mult(2 / (N*(N-1)));
        line(this.position.x, this.position.y, this.position.x + coherency.x, this.position.y + coherency.y);
        return sum;
        // return (2*sum / (N*(N-1)));
    }

    update(boids,obs) {
        // this.ds(boids);
        this.acceleration.add(this.Ftotal(boids,obs));
        this.velocity.add(this.acceleration);
        this.heading.add(this.velocity);
        this.heading.normalize();
        this.heading.mult(20);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.show();
    }

    show() {
        strokeWeight(this.sensing/10);
        stroke(255);
        point(this.position.x, this.position.y);
        // strokeWeight(1);
        // stroke(0,255,0);
        // line(this.position.x, this.position.y, this.position.x + this.heading.x, this.position.y + this.heading.y); // orientation
        // noFill();
        // ellipse(this.position.x, this.position.y, this.sensing*2); // sensing radius
    }
}