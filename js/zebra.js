class Zebra {
  constructor(screen) {                                    // runs once when a new Zebra is created
    this.screen = screen;                                  // remember which screen div the zebra lives in
    this.x = 0;                                            // starting horizontal position (left edge)
    this.y = 270;                                           // starting vertical position
    this.width = 112;                                      // zebra width in pixels
    this.height = 55;                                      // zebra height in pixels
    this.facing = 1;                                       // 1 = facing right, -1 = facing left
    this.image = "https://i.pinimg.com/originals/f4/30/57/f4305767fe8cc6128a2628972b8f304c.gif"; 

    this.element = document.createElement("div");          // create the div that shows the zebra
    this.element.style.position = "absolute";              // lets us place it with left/top
    this.element.style.width = `${this.width}px`;          // apply the width
    this.element.style.height = `${this.height}px`;        // apply the height
    this.element.style.backgroundImage = `url('${this.image}')`; // show the GIF as the background
    this.element.style.backgroundSize = "cover";           // scale the GIF to fill the background div
    this.element.style.backgroundRepeat = "no-repeat";     // don't tile the GIF
    this.element.style.zIndex = "10";                      // draw the zebra above the lions (2)

    const bandTop = this.screen.offsetHeight * 0.60;       // lions can appear from 60% of the screen height
    const bandBottom = this.screen.offsetHeight * 0.95;    // down to 95% of the screen height


    this.updatePosition();                                 // place the div at x, y right away
    this.screen.appendChild(this.element);                 // add the div to the screen so it becomes visible
  }                                                        

  updatePosition() {                                       // redraws the zebra at its current x, y
    this.element.style.left = `${this.x}px`;               // move the div horizontally
    this.element.style.top = `${this.y}px`;                // move the div vertically
    this.element.style.transform = `scaleX(${this.facing})`; // flip the image when facing is -1
  }                                                        // end of updatePosition

  remove() {                                               // deletes the zebra from the page
    this.element.remove();                                 // remove the zebra's div
  }                                                        
}                                                          