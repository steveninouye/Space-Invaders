function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;
}

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

class Sprite {
  constructor(image, xCoord, yCoord, width, height) {
    this.image = image;
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.width = width;
    this.height = height;
  }
}

// function Sprite(img, x, y, w, h) {
//   this.img = img;
//   this.x = x;
//   this.y = y;
//   this.w = w;
//   this.h = h;
// }

function InputHandeler() {
  this.down = {};
  this.pressed = {};
  var _this = this;
  document.addEventListener('keydown', function(evt) {
    _this.down[evt.keyCode] = true;
  });
  document.addEventListener('keyup', function(evt) {
    delete _this.down[evt.keyCode];
    delete _this.pressed[evt.keyCode];
  });
}

InputHandeler.prototype.isDown = function(code) {
  return this.down[code];
};

InputHandeler.prototype.isPressed = function(code) {
  if (this.pressed[code]) {
    return false;
  } else if (this.down[code]) {
    return (this.pressed[code] = true);
  }
  return false;
};

// InputHandler.prototype.isPressed = function(code) {
//   if (this.pressed[code]) {
//     return false;
//   } else if (this.down[code]) {
//     return (this.pressed[code] = true);
//   }
//   return false;
// };

// ///////////////////////////

let display,
  input,
  frames,
  spFrame,
  lvFrame,
  alSprite,
  taSprite,
  ciSprite,
  aliens,
  dir,
  tank,
  bullets,
  cities;

function main() {
  screen = new Screen(504, 600);
  screen.render();
  input = new InputHandeler();
  let image = new Image();
  image.addEventListener('load', function() {
    alSprite = [
      [new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)],
      [new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
      [new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
    ];
    taSprite = new Sprite(this, 62, 0, 22, 16);
    ciSprite = new Sprite(this, 84, 8, 36, 24);
    init();
    run();
  });
  image.src = 'img/sprites.png';
}

function init() {
  frames = 0;
  spFrame = 0;
  lvFrame = 40;
  dir = 1;

  tank = {
    sprite: taSprite,
    xCoord: (screen.width - taSprite.width) / 2,
    yCoord: screen.height - (30, +taSprite.height)
  };

  bullets = [];
  cities = {
    canvas: null,
    ctx: null,
    yCoord: tank.yCoord - (30 + ciSprite.height),
    height: ciSprite.height,
    init: function() {
      this.canvas = document.createElement('canvas');
      this.canvas.width = screen.width;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext('2d');

      for (let i = 0; i < 4; i++) {
        this.ctx.drawImage(
          ciSprite.image,
          ciSprite.xCoord,
          ciSprite.yCoord,
          ciSprite.width,
          ciSprite.height,
          68 + 111 * i,
          0,
          ciSprite.width,
          ciSprite.height
        );
      }
    },
    generateDamage: function(xCoord, yCoord) {
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
    hits: function(xCoord, yCoord) {
      yCoord -= this.yCoord;
      let data = this.ctx.getImageData(xCoord, yCoord, 1, 1);
      if (data.data[3] !== 0) {
        this.generateDamage(xCoord, yCoord);
        return true;
      }
      return false;
    }
  };

  cities.init();

  aliens = [];
  let rows = [1, 0, 0, 2, 2];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < 10; j++) {
      let a = rows[i];
      aliens.push({
        sprite: alSprite[a],
        xCoord: 30 + j * 30 + [0, 4, 0][a],
        yCoord: 30 + i * 30,
        width: alSprite[a][0].width,
        height: alSprite[a][0].height
      });
    }
  }
}

function run() {
  var loop = function() {
    update();
    render();
    window.requestAnimationFrame(loop, screen.canvas);
  };
  window.requestAnimationFrame(loop, screen.canvas);
}

function update() {
  // Left Key
  if (input.isDown(37)) {
    tank.xCoord -= 4;
  }

  // Right Key
  if (input.isDown(39)) {
    tank.xCoord += 4;
  }

  tank.xCoord = Math.max(
    Math.min(tank.xCoord, screen.width - (30 + taSprite.width)),
    30
  );

  // Space Key
  if (input.isPressed(32)) {
    bullets.push(new Bullet(tank.xCoord + 10, tank.yCoord, -8, 2, 6, '#fff'));
  }

  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    b.update();

    if (b.yCoord + b.height < 10 || b.yCoord > screen.height) {
      bullets.splice(i, 1);
      // i--;
      continue;
    }

    let h2 = b.height * 0.5;
    if (
      cities.yCoord < b.yCoord + h2 &&
      b.yCoord + h2 < cities.yCoord + cities.height
    ) {
      if (cities.hits(b.xCoord, b.yCoord + h2)) {
        bullets.splice(i, 1);
        // i--;
        continue;
      }
    }

    for (let j = 0; j < aliens.length; j++) {
      let a = aliens[j];
      if (
        AABBIntersect(
          b.xCoord,
          b.yCoord,
          b.width,
          b.height,
          a.xCoord,
          a.yCoord,
          a.width,
          a.height
        )
      ) {
        aliens.splice(j, 1);
        bullets.splice(i, 1);
      }
    }
  }

  if (Math.random() < 0.03 && aliens.length > 0) {
    let a = aliens[Math.round(Math.random() * (aliens.length - 1))];

    for (let i = 0; i < aliens.length; i++) {
      let b = aliens[i];

      if (
        AABBIntersect(
          a.xCoord,
          a.yCoord,
          a.width,
          100,
          b.xCoord,
          b.yCoord,
          b.width,
          b.height
        )
      ) {
        a = b;
      }
    }
    bullets.push(
      new Bullet(a.xCoord + a.width * 0.5, a.yCoord + a.height, 4, 2, 4, '#FFF')
    );
  }

  frames++;
  if (frames % lvFrame === 0) {
    spFrame = (spFrame + 1) % 2;

    let _max = 0;
    let _min = screen.width;

    let len = aliens.length;
    for (let i = 0; i < len; i++) {
      let a = aliens[i];
      a.xCoord += 30 * dir;

      _max = Math.max(_max, a.xCoord + a.width);
      _min = Math.min(_min, a.xCoord);
    }
    if (_max > screen.width - 30 || _min < 30) {
      dir *= -1;
      len = aliens.length;
      for (let i = 0; i < len; i++) {
        aliens[i].xCoord += 30 * dir;
        aliens[i].yCoord += 30;
      }
    }
  }
}

function render() {
  screen.clearRect();
  for (let i = 0; i < aliens.length; i++) {
    let a = aliens[i];
    screen.drawSprite(a.sprite[spFrame], a.xCoord, a.yCoord);
  }

  screen.ctx.save();
  for (let i = 0; i < bullets.length; i++) {
    screen.drawBullet(bullets[i]);
  }
  screen.ctx.restore();

  screen.ctx.drawImage(cities.canvas, 0, cities.yCoord);

  screen.drawSprite(tank.sprite, tank.xCoord, tank.yCoord);
}

main();
