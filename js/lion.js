class Lion {
  constructor(screen, x, y, speed) {
    this.screen = screen;      // the screen div the lion lives in
    this.x = x;                // horizontal position
    this.y = y;                // vertical position
    this.width = 110;           // lion width in pixels
    this.height = 30;          // lion height in pixels
    this.speed = speed;        // pixels moved per frame (negative = moving down)
    this.image = "https://i.pinimg.com/originals/c1/0f/09/c10f09d7fe6f756c8abf441c92a0ba3c.gif";

    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.backgroundImage = `url('${this.image}')`;   // FIX: use the lion GIF, not tree.png
    this.element.style.backgroundSize = "cover";
    this.element.style.backgroundRepeat = "no-repeat";
    this.element.style.zIndex = "2";

    this.updatePosition();
    this.screen.appendChild(this.element);
  }

move() {
    this.x -= this.speed;     // run to the left, toward the zebra
    this.updatePosition();    // redraw at the new position
  }

  isOffScreen() {
    return this.x + this.width < 0;   // true once the lion has fully left the left side
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  remove() {
    this.element.remove();    // delete the lion's div from the page
  }
}