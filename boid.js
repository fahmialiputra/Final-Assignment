class Boid {
    constructor(index) {
        this.position = createVector(random(width/16, width/8), random(height*(3/4), height*(3/4) + 50));
        this.size = 5;
        this.heading = createVector();
        this.sensing = 20; // sensing radius
        this.velocity = createVector();
        // this.acceleration = createVector();
        this.maxSpeed = 2;
        this.v0 = 0.5;
        this.alpha = 0.1;
        this.betha = 1.2;
        this.k = 3;
        this.lij = 30;
        this.Dr = 0.15;
        this.Dt = 0.25;
        this.unitvector = createVector(1,0);
        this.unitvector_perpendicular = createVector(0,1);
        this.wg = 4;
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

    check(obs) {
        let checked = [];
        for (let o of obs) {
            let d = dist(this.position.x, this.position.y,
                o.position.x, o.position.y);
            // let r = this.rij(this.position, o.position);
            // print('|rio| <= rsens : ' + (r <= this.sensing)); false? why?
            // if(r <= this.sensing) {
            if (d - o.radius <= this.sensing) {
                checked.push(o);
            }
        }
        return checked;
    }

    Fobs(obs) {
        let F = createVector();
        let sigmaobs = this.sensing*sqrt(2);
        for (let o of obs) {
            let r = this.rij(this.position, o.position);
            let newr = createVector(o.radius*cos(r.heading()), o.radius*sin(r.heading()));
            r.sub(newr);
            r.mult(o.Eobs*(pow(sigmaobs/r.mag(),2*o.alphaLJ) - 2*pow(sigmaobs/r.mag(),o.alphaLJ))); // re-check the formula
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
        return F; // returns a vector number
    }

    vx(Fi) { // xi vector function
        return this.v0 + this.alpha*p5.Vector.dot(
            p5.Vector.add(Fi, p5.Vector.mult(this.Er,this.Dr)),
            this.unitvector
        ); // returns a scalar number
    }

    thetai(Fi) {
        return this.betha*p5.Vector.dot(
            p5.Vector.add(Fi, p5.Vector.mult(this.Er,this.Dr)),
            this.unitvector_perpendicular
        ) + this.Dt*this.Et;
    }

    vy(Fi) {
        return this.vx(Fi)*tan(thetai(Fi));
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

    // update(x, y) { // use this to moves the boids/individuals based on mouse position
    //     if(x > width) {x = width;}
    //     if(y > height) {y = height;}
    //     this.position.x = x;
    //     this.position.y = y;
    update(boids,obs) {
        // this.acceleration.add(this.Ftotal(boids,obs));
        // this.velocity.add(this.acceleration);
        // this.heading.add(this.velocity);
        this.heading.add(this.vy(this.Ftotal(boids,obs)));
        this.heading.normalize();
        this.heading.mult(20);
        // this.velocity.limit(this.maxSpeed);
        this.velocity.x += this.vx(this.Ftotal(boids,obs));
        this.velocity.y += this.vy(this.Ftotal(boids,obs));
        this.position.add(this.velocity);
        // this.acceleration.mult(0);
        this.velocity.mult(0);
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
