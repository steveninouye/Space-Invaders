function Screen(width, height) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width = width;
  this.canvas.height = this.height = height;
  this.ctx = this.canvas.getContext('2d');

  document.body.appendChild(this.canvas);
}

Screen.prototype.drawSprite = function(sp, x, y) {
  this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

function Sprite(img, x, y, w, h) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

function InputHandler() {
  this.down = {};
  this.pressed = {};
  let _this = this;
  document.addEventListener('keydown', function(evt) {
    _this.down[evt.keyCode] = true;
  });
  document.addEventListener('keyup', function(evt) {
    delete _this.down[evt.keyCode];
    delete _this.pressed[evt.keyCode];
  });
}

InputHandler.prototype.isDown = function(code) {
  return this.down[code];
};

InputHandler.prototype.isPressed = function(code) {
  if (this.pressed[code]) {
    return false;
  } else if (this.down[code]) {
    return (this.pressed[code] = true);
  }
  return false;
};

///////////////////////////

let screen,
  input,
  frames,
  alSprite,
  taSprite,
  ciSprite,
  aliens,
  dir,
  tank,
  bullets,
  cities;

const main = () => {
  screen = new Screen(510, 600);
  input = new InputHandler();
  let img = new Image();
  img.addEventListener('load', function() {
    alSprite = [
      [new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)],
      [new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
      [new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
    ];
    taSprite = new Sprite(this);
    ciSprite = new Sprite(this);
    init();
    run();
  });
  img.src = 'img/sprites.png';
};

const init = () => {};

const run = () => {};

const update = () => {};

const render = () => {};
