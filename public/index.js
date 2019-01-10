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
  if (input.isDown(37)) {
    tank.x -= 4;
  }

  if (input.isDown(39)) {
    tank.x += 4;
  }

  tank.x = Math.max(Math.min(tank.x, screen.width - (30 + taSprite.w)), 30);

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
  let len = aliens.length;
  for (let i = 0; i < len; i++) {
    let a = aliens[i];
    screen.drawSprite(a.sprite[spFrame], a.x, a.y);
  }
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
