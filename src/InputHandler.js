class InputHandler {
  constructor() {
    this.down = {};
    this.pressed = {};
    document.addEventListener('keydown', (e) => {
      if ((e.keyCode < 41 && e.keyCode > 36) || e.keyCode === 32) {
        e.preventDefault();
      }
      this.down[e.keyCode] = true;
    });
    document.addEventListener('keyup', (e) => {
      delete this.down[e.keyCode];
      delete this.pressed[e.keyCode];
    });
  }

  isDown(code) {
    return this.down[code];
  }

  isPressed(code) {
    if (this.pressed[code]) {
      return false;
    } else if (this.down[code]) {
      return (this.pressed[code] = true);
    }
    return false;
  }
}

export default InputHandler;
