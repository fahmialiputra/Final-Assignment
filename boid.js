class Boid {
    constructor(index) {
        this.position = createVector(random(10, width/6 - 50), random(height*(1/4), height*(3/4)));
        this.radius = 2.5;
        this.heading = createVector();
        this.sensing = 50; // sensing radius
        this.velocity = createVector();
        this.maxSpeed = 4;
        this.v0 = 0.5;
        this.alpha = 0.5;
        this.betha = 1.2;
        this.k = 3;
        this.lij = 50;
        this.Dr = 0.15;
        this.Dt = 0.25;
        this.unitvector = createVector(1,0);
        this.unitvector_perpendicular = createVector(0,1);
        this.vd = createVector(1,0);
        this.wg = 4;
        this.Er = createVector(random(0,0.1),random(0,0.1));
        this.Et = random(-PI/12,PI/12);
        this.change = false;
        this.index = index;
        this.color = color(255,255,255);
    }

    drawForceLine(F, linecolor) {
        let Fline = createVector();
        Fline.add(F);
        Fline.setMag(10);
        push(); // draw a line to show where the Force is heading
            strokeWeight(1);
            stroke(linecolor);
            line(this.position.x, this.position.y, this.position.x + Fline.x, this.position.y + Fline.y);
        pop();
    }

    rij(i,j) {
        return p5.Vector.sub(j, i); // return a vector
    }

    equilibrium(boids) {
        let r0 = createVector();
        for (let other of boids) {
            r0.add(this.rij(this.position, other.position));
        }
        r0.div(boids.length);
        return r0;
    }

    Fi(boids) {
        let F = createVector();
        for (let other of boids) {
            if (other != this) {
                let r = this.rij(this.position, other.position);
                let r1 = createVector(other.size*cos(r.heading()), other.size*sin(r.heading()));
                let r2 = createVector(this.radius*cos(r.heading()), this.radius*sin(r.heading()));
                r.sub(r1);
                r.sub(r2);
                r.mult(-this.k*((1/r.mag()) - (1/this.lij)));
                F.add(r);
            }
        }
        // this.drawForceLine(F, color(0,255,0));
        return F;
    }

    Fg() {
        let F = createVector();
        F.add(this.vd);
        F.mult(this.wg);
        // this.drawForceLine(F, color(0,0,255));
        return F;
    }

    check(obs) {
        let checked = [];
        for (let o of obs) {
            let d = dist(this.position.x, this.position.y,
                o.position.x, o.position.y);
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
            let exceed1 = createVector(cos(r.heading())*o.radius, sin(r.heading())*o.radius);
            let exceed2 = createVector(cos(r.heading())*this.radius/2, sin(r.heading())*this.radius/2);
            r.sub(exceed1); // substract with obstacle radius
            r.sub(exceed2); // substract with boid radius
            r.mult(o.Eobs*(pow(sigmaobs/r.mag(),2*o.alphaLJ) - 2*pow(sigmaobs/r.mag(),o.alphaLJ))); // re-check the formula
            F.add(r);
        }
        // this.drawForceLine(p5.Vector.mult(F,-1), color(255,0,0));
        return F;
    }

    Ftotal(boids,obs) {
        let F = createVector();
        F.add(this.Fi(boids));
        F.add(this.Fg(this.vd));
        F.sub(this.Fobs(obs));
        this.drawForceLine(F, color(0,255,0));
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
        ) + this.Dt*this.Et; // returns a scalar number
    }

    vy(Fi) {
        return this.vx(Fi)*tan(this.thetai(Fi));
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

    update(boids,obs) {
        this.velocity.add(this.Ftotal(boids,obs));
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.velocity.mult(0);
    }

    show() {
        strokeWeight(this.radius*2);
        stroke(this.color);
        point(this.position.x, this.position.y);
    }
}