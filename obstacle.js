class Obstacle {
    constructor(x, y, size, alphaLJ, Eobs, color) {
        this.position = createVector(x,y);
        this.radius = size;
        this.color = color;
        this.alphaLJ = 0.975;
        this.Eobs = 0.01;
    }

    show() {
        noStroke();
        fill(this.color);
        strokeWeight(0.1);
        ellipse(this.position.x, this.position.y, this.radius*2, this.radius*2);
    }
}
