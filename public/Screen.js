class Screen {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  clearRect() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawSprite(sprite, initX, initY) {
    // debugger;
    this.ctx.drawImage(
      sprite.image,
      sprite.xCoord,
      sprite.yCoord,
      sprite.width,
      sprite.height,
      initX,
      initY,
      sprite.width,
      sprite.height
    );
  }

  drawBullet(bullet) {
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(
      bullet.xCoord,
      bullet.yCoord,
      bullet.width,
      bullet.height
    );
  }

  render() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }
}
