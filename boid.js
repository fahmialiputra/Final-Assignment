class Boid {
    constructor(index) {
        this.position = createVector(random(width/16, width/8), random(height*(3/4), height*(3/4) + 50));
        this.size = 10;
        this.heading = createVector();
        this.sensing = 50; // sensing radius
        this.velocity = createVector();
        // this.acceleration = createVector();
        this.Forcelimit = 10;
        this.maxSpeed = 3;
        this.v0 = 0.5;
        this.alpha = 0.1;
        this.betha = 1.2;
        this.k = 2;
        this.lij = 30;
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

    rij(i,j) {
        return p5.Vector.sub(j, i);
    }

    rF(i,j) {
        let r = i.rij(i.position, j.position);
        let exceed1 = createVector(j.radius*cos(r.heading()), j.radius*sin(r.heading()));
        r.sub(exceed1);
        let exceed2 = createVector(i.radius*cos(r.heading()), i.radius*sin(r.heading()));
        r.sub(exceed2);
        return r;
    }

    equilibrium(boids) {
        let r = createVector();
        for (let other of boids) {
            r.add(this.rij(this.position, other.position));
        }
        r.div(boids.length);
        // r.normalize();
        // r.mult(10);
        // push();
        //     strokeWeight(1);
        //     stroke(0,255,0);
        //     line(this.position.x, this.position.y, this.position.x + r.x, this.position.y + r.y);
        // pop();
        return r.mag();
    }

    Fi(boids) {
        let F = createVector();
        // stroke(100);
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

    Fg() {
        let F = createVector();
        F.add(this.vd);
        F.mult(this.wg);
        // if(this.index < 1) {
        //     print(F.x + ', ' + F.y);
        // }
        // let Fo = createVector();
        // Fo.add(F);
        // Fo.normalize();
        // Fo.mult(10);
        // push(); // draw a line to show where the Force is heading
        //     strokeWeight(1);
        //     stroke(255);
        //     line(this.position.x, this.position.y, this.position.x + Fo.x, this.position.y + Fo.y);
        // pop();
        return F;
    }

    check(obs) {
        let checked = [];
        for (let o of obs) {
            let d = dist(this.position.x, this.position.y,
                o.position.x, o.position.y);
            // print('|rio| <= rsens : ' + (r <= this.sensing)); false? why?
            // if(r <= this.sensing) {
            if (d - o.radius <= this.sensing) {
                // if (d - o.radius <= this.size/2) {
                //     this.color = color(255,0,0);
                // } else {
                //     this.color = color(0,255,0);
                // }
                // let r = this.rij(this.position, o.position);
                // let exceed1 = createVector(cos(r.heading())*o.radius, sin(r.heading())*o.radius);
                // let exceed2 = createVector(cos(r.heading())*this.size/2, sin(r.heading())*this.size/2);
                // push();
                //     strokeWeight(1);
                //     stroke(0,0,255);
                //     line(this.position.x, this.position.y, o.position.x - exceed1.x, o.position.y - exceed1.y);
                //     stroke(255,0,0);
                //     line(o.position.x, o.position.y, o.position.x - exceed1.x, o.position.y - exceed1.y);
                //     line(o.position.x, o.position.y, o.position.x - exceed1.x, o.position.y);
                //     line(o.position.x - exceed1.x, o.position.y, o.position.x - exceed1.x, o.position.y - exceed1.y);
                //     stroke(0,255,0);
                //     line(this.position.x, this.position.y, this.position.x + exceed2.x, this.position.y + exceed2.y);
                //     line(this.position.x, this.position.y + exceed2.y, this.position.x + exceed2.x, this.position.y + exceed2.y);
                //     line(this.position.x, this.position.y, this.position.x, this.position.y + exceed2.y);
                // pop();
                // r.sub(exceed1);
                // r.sub(exceed2);
                checked.push(o);
            }
            // else {
            //     this.color = color(255,255,255);
            // }
        }
        return checked;
    }

    Fobs(obs) {
        let F = createVector();
        F.mult(0);
        let sigmaobs = this.sensing*sqrt(2);
        for (let o of obs) {
            let r = this.rij(this.position, o.position);
            let exceed1 = createVector(cos(r.heading())*o.radius, sin(r.heading())*o.radius);
            let exceed2 = createVector(cos(r.heading())*this.size/2, sin(r.heading())*this.size/2);
            // push();
            //     strokeWeight(1);
            //     stroke(255);
            //     line(this.position.x, this.position.y, this.position.x + Fo.x, this.position.y + Fo.y); // draw a line to show where the Force is heading
            //     line(this.position.x, this.position.y, this.position.x + Fo.x, this.position.y + Fo.y); // draw a line to show where the Force is heading
            // pop();
            // // to obtain the actual distance between boid and obstacle
            r.sub(exceed1); // substract with obstacle radius
            r.sub(exceed2); // substract with boid radius
            r.mult(o.Eobs*(pow(sigmaobs/r.mag(),2*o.alphaLJ) - 2*pow(sigmaobs/r.mag(),o.alphaLJ))); // re-check the formula
            F.add(r);
        }
        // let Fo = createVector();
        // Fo.add(F);
        // Fo.limit(20);
        // push(); // draw a line to show where the Force is heading
        //     strokeWeight(1);
        //     stroke(255,0,0);
        //     line(this.position.x, this.position.y, this.position.x - Fo.x, this.position.y - Fo.y);
        // pop();
        return F;
    }

    Ftotal(boids,obs) {
        let F = createVector();
        F.mult(0);
        F.add(this.Fi(boids));
        F.add(this.Fg(this.vd));
        F.sub(this.Fobs(obs));
        push(); // draw a line to show where the Force is heading
            strokeWeight(1);
            stroke(255,0,0);
            line(this.position.x, this.position.y, this.position.x + F.x, this.position.y + F.y);
        pop();
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

    update(x, y) { // use this to moves the boids/individuals based on mouse position
        if(x > width) {x = width;}
        if(y > height) {y = height;}
        this.position.x = x;
        this.position.y = y;
    // update(boids,obs) {
    //     // this.acceleration.add(this.Ftotal(boids,obs));
    //     // this.velocity.add(this.acceleration);
    //     // this.heading.add(this.velocity);
    //     this.heading.add(this.vy(this.Ftotal(boids,obs)));
    //     this.heading.normalize();
    //     this.heading.mult(20);
    //     this.velocity.add(this.Ftotal(boids,obs));
    //     this.velocity.limit(this.maxSpeed);
    //     this.position.add(this.velocity);
    //     // this.acceleration.mult(0);
    //     this.velocity.mult(0);
    }

    show() {
        strokeWeight(this.size);
        // if (this.change) {
        //     stroke(0,255,0);
        // } else {
        //     stroke(255);
        // }
        stroke(this.color);
        point(this.position.x, this.position.y);
        push();
            strokeWeight(1);
            stroke(0,0,255);
            line(this.position.x, this.position.y, this.position.x + this.heading.x, this.position.y + this.heading.y); // orientation
            noFill();
            ellipse(this.position.x, this.position.y, this.sensing*2); // sensing radius
        pop();
    }
}
