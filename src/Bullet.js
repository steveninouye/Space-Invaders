class Bullet {
  constructor(xCoord, yCoord, velocityY, width, height, color) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.velocityY = velocityY;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  update() {
    this.yCoord += this.velocityY;
  }
}

export default Bullet;
