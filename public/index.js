function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;
}

function Bullet(x, y, velocityY, w, h, color) {
  this.x = x;
  this.y = y;
  this.velocityY = velocityY;
  this.width = w;
  this.height = h;
  this.color = color;
}

Bullet.prototype.update = function() {
  this.y += this.velocityY;
};

function Screen(width, height) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width = width;
  this.canvas.height = this.height = height;
  this.ctx = this.canvas.getContext('2d');
  document.body.appendChild(this.canvas);
}

Screen.prototype.clearRect = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
};

Screen.prototype.drawSprite = function(sp, x, y) {
  this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

Screen.prototype.drawBullet = function(bullet) {
  this.ctx.fillStyle = bullet.color;
  this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};

function Sprite(img, x, y, w, h) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

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
  input = new InputHandeler();
  var img = new Image();
  img.addEventListener('load', function() {
    alSprite = [
      [new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)],
      [new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
      [new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
    ];
    taSprite = new Sprite(this, 62, 0, 22, 16);
    ciSprite = new Sprite(this, 84, 8, 36, 24);
    // initate and run the game
    init();
    run();
  });
  img.src = 'img/sprites.png';
}

function init() {
  frames = 0;
  spFrame = 0;
  lvFrame = 40;
  dir = 1;

  tank = {
    sprite: taSprite,
    x: (screen.width - taSprite.w) / 2,
    y: screen.height - (30, +taSprite.h)
  };

  bullets = [];
  cities = {
    canvas: null,
    ctx: null,
    y: tank.y - (30 + ciSprite.h),
    h: ciSprite.h,
    init: function() {
      this.canvas = document.createElement('canvas');
      this.canvas.width = screen.width;
      this.canvas.height = this.h;
      this.ctx = this.canvas.getContext('2d');

      for (let i = 0; i < 4; i++) {
        this.ctx.drawImage(
          ciSprite.img,
          ciSprite.x,
          ciSprite.y,
          ciSprite.w,
          ciSprite.h,
          68 + 111 * i,
          0,
          ciSprite.w,
          ciSprite.h
        );
      }
    },
    generateDamage: function(x, y) {
      x = Math.floor(x / 2) * 2;
      y = Math.floor(y / 2) * 2;
      this.ctx.clearRect(x - 2, y - 2, 4, 4);
      this.ctx.clearRect(x + 2, y - 4, 2, 4);
      this.ctx.clearRect(x + 4, y, 2, 2);
      this.ctx.clearRect(x + 2, y + 2, 2, 2);
      this.ctx.clearRect(x - 4, y + 2, 2, 2);
      this.ctx.clearRect(x - 6, y, 2, 2);
      this.ctx.clearRect(x - 4, y - 4, 2, 2);
      this.ctx.clearRect(x - 2, y - 6, 2, 2);
    },
    hits: function(x, y) {
      y -= this.y;
    }
  };

  cities.init();

  aliens = [];
  let rows = [1, 0, 0, 2, 2];
  let len = rows.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < 10; j++) {
      let a = rows[i];
      aliens.push({
        sprite: alSprite[a],
        x: 30 + j * 30 + [0, 4, 0][a],
        y: 30 + i * 30,
        w: alSprite[a][0].w,
        h: alSprite[a][0].h
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
    tank.x -= 4;
  }

  // Right Key
  if (input.isDown(39)) {
    tank.x += 4;
  }

  tank.x = Math.max(Math.min(tank.x, screen.width - (30 + taSprite.w)), 30);

  // Space Key
  if (input.isPressed(32)) {
    bullets.push(new Bullet(tank.x + 10, tank.y, -8, 2, 6, '#fff'));
  }

  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    b.update();

    if (b.y + b.height < 10 || b.y > screen.height) {
      bullets.splice(i, 1);
      i--;
      continue;
    }

    for (let j = 0; j < aliens.length; j++) {
      let a = aliens[j];
      if (AABBIntersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)) {
        aliens.splice(j, 1);
        bullets.splice(i, 1);
      }
    }
  }

  if (Math.random() < 0.03 && aliens.length > 0) {
    let a = aliens[Math.round(Math.random() * (aliens.length - 1))];

    for (let i = 0; i < aliens.length; i++) {
      let b = aliens[i];

      if (AABBIntersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)) {
        a = b;
      }
    }
    bullets.push(new Bullet(a.x + a.w * 0.5, a.y + a.h, 4, 2, 4, '#FFF'));
  }

  frames++;
  if (frames % lvFrame === 0) {
    spFrame = (spFrame + 1) % 2;

    let _max = 0;
    let _min = screen.width;

    let len = aliens.length;
    for (let i = 0; i < len; i++) {
      let a = aliens[i];
      a.x += 30 * dir;

      _max = Math.max(_max, a.x + a.w);
      _min = Math.min(_min, a.x);
    }
    if (_max > screen.width - 30 || _min < 30) {
      dir *= -1;
      len = aliens.length;
      for (let i = 0; i < len; i++) {
        aliens[i].x += 30 * dir;
        aliens[i].y += 30;
      }
    }
  }
}

function render() {
  screen.clearRect();
  for (let i = 0; i < aliens.length; i++) {
    let a = aliens[i];
    screen.drawSprite(a.sprite[spFrame], a.x, a.y);
  }

  screen.ctx.save();
  for (let i = 0; i < bullets.length; i++) {
    screen.drawBullet(bullets[i]);
  }
  screen.ctx.restore();

  screen.ctx.drawImage(cities.canvas, 0, cities.y);

  screen.drawSprite(tank.sprite, tank.x, tank.y);
}

main();

///////////////////

/**
 * Check if to axis aligned bounding boxes intersects
 *
 * @return {bool}  the check result
 */
// function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
//   return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;
// }

// function Bullet(x, y, vely, w, h, color) {
//   this.x = x;
//   this.y = y;
//   this.vely = vely;
//   this.width = w;
//   this.height = h;
//   this.color = color;
// }

// /**
//  * Update bullet position
//  */
// Bullet.prototype.update = function() {
//   this.y += this.vely;
// };

// /**
//  * Abstracted canvas class usefull in games
//  *
//  * @param {number} width  width of canvas in pixels
//  * @param {number} height height of canvas in pixels
//  */

// /**
//  * Clear the complete canvas
//  */
// Screen.prototype.clear = function() {
//   this.ctx.clearRect(0, 0, this.width, this.height);
// };

// Screen.prototype.drawBullet = function(bullet) {
//   // set the current fillstyle and draw bullet
//   this.ctx.fillStyle = bullet.color;
//   this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
// };

// function Sprite(img, x, y, w, h) {
//   this.img = img;
//   this.x = x;
//   this.y = y;
//   this.w = w;
//   this.h = h;
// }
