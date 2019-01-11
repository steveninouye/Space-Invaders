class Game {
  constructor() {}

  main() {
    this.screen = new Screen(504, 600);
    this.screen.render();
    this.input = new InputHandeler();
    let image = new Image();
    image.addEventListener('load', () => {
      alSprite = [
        [new Sprite(this, 0, 0, 22, 16), new Sprite(image, 0, 16, 22, 16)],
        [new Sprite(this, 22, 0, 16, 16), new Sprite(image, 22, 16, 16, 16)],
        [new Sprite(this, 38, 0, 24, 16), new Sprite(image, 38, 16, 24, 16)]
      ];
      this.taSprite = new Sprite(image, 62, 0, 22, 16);
      this.ciSprite = new Sprite(image, 84, 8, 36, 24);
      this.init();
      this.run();
    });
    image.src = 'img/sprites.png';
  }

  init() {
    this.frames = 0;
    this.spFrame = 0;
    this.lvFrame = 40;
    this.dir = 1;

    this.tank = {
      sprite: this.taSprite,
      xCoord: (this.screen.width - this.taSprite.width) / 2,
      yCoord: this.screen.height - (30, this.taSprite.height)
    };

    this.bullets = [];
    this.cities = {
      canvas: null,
      ctx: null,
      yCoord: this.tank.yCoord - (30 + this.ciSprite.height),
      height: this.ciSprite.height,
      init: function() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.screen.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');

        for (let i = 0; i < 4; i++) {
          this.ctx.drawImage(
            this.ciSprite.image,
            this.ciSprite.xCoord,
            this.ciSprite.yCoord,
            this.ciSprite.width,
            this.ciSprite.height,
            68 + 111 * i,
            0,
            this.ciSprite.width,
            this.ciSprite.height
          );
        }
      },
      generateDamage: (xCoord, yCoord) => {
        xCoord = Math.floor(xCoord / 2) * 2;
        yCoord = Math.floor(yCoord / 2) * 2;
        this.ctx.clearRect(xCoord - 2, yCoord - 2, 4, 4);
        this.ctx.clearRect(xCoord + 2, yCoord - 4, 2, 4);
        this.ctx.clearRect(xCoord + 4, yCoord, 2, 2);
        this.ctx.clearRect(xCoord + 2, yCoord + 2, 2, 2);
        this.ctx.clearRect(xCoord - 4, yCoord + 2, 2, 2);
        this.ctx.clearRect(xCoord - 6, yCoord, 2, 2);
        this.ctx.clearRect(xCoord - 4, yCoord - 4, 2, 2);
        this.ctx.clearRect(xCoord - 2, yCoord - 6, 2, 2);
      },
      hits: (xCoord, yCoord) => {
        yCoord -= this.yCoord;
        let data = this.ctx.getImageData(xCoord, yCoord, 1, 1);
        if (data.data[3] !== 0) {
          this.generateDamage(xCoord, yCoord);
          return true;
        }
        return false;
      }
    };

    this.cities.init();

    this.aliens = [];
    let rows = [1, 0, 0, 2, 2];
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < 10; j++) {
        let a = rows[i];
        this.aliens.push({
          sprite: this.alSprite[a],
          xCoord: 30 + j * 30 + [0, 4, 0][a],
          yCoord: 30 + i * 30,
          width: this.alSprite[a][0].width,
          height: this.alSprite[a][0].height
        });
      }
    }
  }

  run() {
    let loop = () => {
      this.update();
      this.render();
      window.requestAnimationFrame(loop, this.screen.canvas);
    };
    window.requestAnimationFrame(loop, this.screen.canvas);
  }

  update() {
    // Left Key
    if (this.input.isDown(37)) {
      this.tank.xCoord -= 4;
    }

    // Right Key
    if (this.input.isDown(39)) {
      this.tank.xCoord += 4;
    }

    this.tank.xCoord = Math.max(
      Math.min(
        this.tank.xCoord,
        this.screen.width - (30 + this.taSprite.width)
      ),
      30
    );

    // Space Key
    if (this.input.isPressed(32)) {
      this.bullets.push(
        new Bullet(this.tank.xCoord + 10, this.tank.yCoord, -8, 2, 6, '#FFF')
      );
    }

    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = bullets[i];
      bullet.update();

      if (bullet.yCoord + bullet.height < 10 || bullet.yCoord > screen.height) {
        this.bullets.splice(i, 1);
        continue;
      }

      let h2 = bullet.height * 0.5;
      if (
        this.cities.yCoord < this.bullet.yCoord + h2 &&
        bullet.yCoord + h2 < this.cities.yCoord + this.cities.height
      ) {
        if (this.cities.hits(bullet.xCoord, bullet.yCoord + h2)) {
          this.bullets.splice(i, 1);
          continue;
        }
      }

      for (let j = 0; j < this.aliens.length; j++) {
        let alien = this.aliens[j];
        if (
          AABBIntersect(
            bullet.xCoord,
            bullet.yCoord,
            bullet.width,
            bullet.height,
            alien.xCoord,
            alien.yCoord,
            alien.width,
            alien.height
          )
        ) {
          this.aliens.splice(j, 1);
          this.bullets.splice(i, 1);
        }
      }
    }

    if (Math.random() < 0.03 && this.aliens.length > 0) {
      let alien1 = this.aliens[
        Math.round(Math.random() * (this.aliens.length - 1))
      ];

      for (let i = 0; i < this.aliens.length; i++) {
        let alien2 = this.aliens[i];

        if (
          AABBIntersect(
            alien1.xCoord,
            alien1.yCoord,
            alien1.width,
            100,
            alien2.xCoord,
            alien2.yCoord,
            alien2.width,
            alien2.height
          )
        ) {
          alien1 = alien2;
        }
      }
      this.bullets.push(
        new Bullet(
          alien1.xCoord + alien1.width * 0.5,
          alien1.yCoord + alien1.height,
          4,
          2,
          4,
          '#FFF'
        )
      );
    }

    this.frames++;
    if (this.frames % this.lvFrame === 0) {
      this.spFrame = (this.spFrame + 1) % 2;

      let _max = 0;
      let _min = this.screen.width;

      for (let i = 0; i < this.aliens.length; i++) {
        let alien = this.aliens[i];
        alien.xCoord += 30 * this.dir;

        _max = Math.max(_max, alien.xCoord + alien.width);
        _min = Math.min(_min, alien.xCoord);
      }
      if (_max > this.screen.width - 30 || _min < 30) {
        this.dir *= -1;

        for (let i = 0; i < this.aliens.length; i++) {
          this.aliens[i].xCoord += 30 * this.dir;
          this.aliens[i].yCoord += 30;
        }
      }
    }
  }

  render() {
    this.screen.clearRect();
    for (let i = 0; i < this.aliens.length; i++) {
      let alien = this.aliens[i];
      this.screen.drawSprite(alien.sprite[spFrame], alien.xCoord, alien.yCoord);
    }

    this.screen.ctx.save();
    for (let i = 0; i < this.bullets.length; i++) {
      this.screen.drawBullet(this.bullets[i]);
    }
    this.screen.ctx.restore();

    this.screen.ctx.drawImage(this.cities.canvas, 0, this.cities.yCoord);

    this.screen.drawSprite(
      this.tank.sprite,
      this.tank.xCoord,
      this.tank.yCoord
    );
  }
}
