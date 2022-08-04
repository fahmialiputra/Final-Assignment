class Boid {
    constructor(index) {
        // this.position = createVector(width/2, random(height*(3/4), height*(3/4) + 50));
        this.position = createVector(random(width/16, width/8), random(height*(3/4), height*(3/4) + 50));
        this.size = 5;
        this.heading = createVector();
        this.sensing = 50; // sensing radius
        this.velocity = createVector();
        this.acceleration = createVector();
        this.maxSpeed = 2;
        this.v0 = 1;
        this.k = 2;
        this.lij = 30;
        this.Dr = 0.5;
        this.Dt = 0.5;
        this.unitvector = createVector(1,0);
        this.unitvector_perpendicular = createVector(0,1);
        this.wg = 2;
        this.Er = createVector(random(0,0.1),0);
        this.Et = random(-PI/12,PI/12);
        this.change = false;
        this.index = index;
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
                let newr = createVector(other.size*cos(r.heading()), other.size*sin(r.heading()));
                r.sub(newr);
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

    // overlapPos(boids) {
    //     for (let other of boids) {
    //         let d = dist(this.position.x, this.position.y,
    //             other.position.x, other.position.y);
    //         if ( other != this && d - other.size < this.size) {
    //             // print('Boids-' + this.index + ' is overlapping with Boids-' + other.index);
    //             return true;
    //         }
    //     }
    // }

    // overlapping(boids) {
    //     for (let other of boids) {
    //         let d = dist(this.position.x, this.position.y,
    //             other.position.x, other.position.y);
    //         if ( other != this && d - other.size < this.size) {
    //             // print('Boids-' + this.index + ' is overlapping with Boids-' + other.index);
    //             return true;
    //         }
    //     }
    // }

    // overlapIn(boids) {
    //     for (let other of boids) {
    //         let d = dist(this.position.x, this.position.y,
    //             other.position.x, other.position.y);
    //         if ( other != this && d - other.size < this.size) {
    //             // print('Boids-' + this.index + ' is overlapping with Boids-' + other.index);
    //             return other.index;
    //         }
    //     }
    // }

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
            if (d - o.radius <= this.sensing) {
                checked.push(o);
                // push();
                    // let r = this.rij(this.position, o.position);
                    // let angle = r.heading();
                    // let newr = createVector(-o.radius*cos(angle), -o.radius*sin(angle));
                    // r.add(newr);
                    // strokeWeight(1);
                    // stroke(255,0,0);
                    // line(o.position.x, o.position.y, o.position.x + newr.x, o.position.y + newr.y);
                    // strokeWeight(1);
                    // stroke(155);
                    // line(this.position.x, this.position.y, this.position.x + r.x, this.position.y + r.y);
                    // if (degrees(angle) >= 135 ) {
                    //     noLoop();
                    //     print('Process terminated');
                    // }
                // pop();
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
            let newr = createVector(o.radius*cos(r.heading()), o.radius*sin(r.heading()));
            r.sub(newr);
            // print(' rio : (' + r.x + ', ' + r.y + ')');
            // print('|rio|: ' + r.mag());
            // re-check the formula below
            r.mult(o.Eobs*(pow(sigmaobs/r.mag(),2*o.alphaLJ) - 2*pow(sigmaobs/r.mag(),o.alphaLJ)));
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

    coherency(boids){
        let ds = 0;
        let N = boids.length;
        for (let i = 0; i < N-1; i++) {
            for (let j = 0; j < N; j++) {
                let r = boids[i].rij(boids[i].position,boids[j].position);
                ds += r.mag();
            }
        }
        ds *= (2 / (N*(N-1)));
        return ds;
    }

    // update(x, y) {
    //     if(x > width) {x = width;}
    //     if(y > height) {y = height;}
    //     this.position.x = x;
    //     this.position.y = y;
    update(boids,obs) {
        this.acceleration.add(this.Ftotal(boids,obs));
        this.velocity.add(this.acceleration);
        this.heading.add(this.velocity);
        this.heading.normalize();
        this.heading.mult(20);
        // if(this.overlapping(boids)) {
        //     let vOverlap = this.rij(this.position, boids[this.overlapIn(boids)].position).normalize();
        //     print(vOverlap.x + ', ' + vOverlap.y);
        //     this.maxSpeed = 2 + this.Fg(vOverlap);
        // } else {
        //     this.maxSpeed = 2;
        // }
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    show() {
        strokeWeight(this.size);
        if (this.change) {
            stroke(0,255,0);
        } else {
            stroke(255);
        }
        point(this.position.x, this.position.y);
        // strokeWeight(1);
        // stroke(0,0,255);
        // line(this.position.x, this.position.y, this.position.x + this.heading.x, this.position.y + this.heading.y); // orientation
        // noFill();
        // ellipse(this.position.x, this.position.y, this.sensing*2); // sensing radius
    }
}
