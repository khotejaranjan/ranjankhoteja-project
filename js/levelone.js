class Zebra {
  constructor(screen) {                                    // runs once when a new Zebra is created
    this.screen = screen;                                  // remember which screen div the zebra lives in
    this.x = 0;                                            // starting horizontal position (left edge)
    this.y = 270;                                           // starting vertical position
    this.width = 112;                                      // zebra width in pixels
    this.height = 55;                                      // zebra height in pixels
    this.facing = 1;                                       // 1 = facing right, -1 = facing left
    this.image = "https://i.pinimg.com/originals/f4/30/57/f4305767fe8cc6128a2628972b8f304c.gif"; // sprite URL

    this.element = document.createElement("div");          // create the div that shows the zebra
    this.element.style.position = "absolute";              // lets us place it with left/top
    this.element.style.width = `${this.width}px`;          // apply the width
    this.element.style.height = `${this.height}px`;        // apply the height
    this.element.style.backgroundImage = `url('${this.image}')`; // show the GIF as the background
    this.element.style.backgroundSize = "cover";           // scale the GIF to fill the div
    this.element.style.backgroundRepeat = "no-repeat";     // don't tile the GIF
    this.element.style.zIndex = "10";                      // draw the zebra above the lions (2)

    const bandTop = this.screen.offsetHeight * 0.60;       // lions can appear from 60% of the screen height
    const bandBottom = this.screen.offsetHeight * 0.95;    // down to 95% of the screen height
    //this.y = (bandTop + bandBottom) / 2 - 55 / 2;          // center of the lion band, minus half the zebra's height (55)

    this.updatePosition();                                 // place the div at x, y right away
    this.screen.appendChild(this.element);                 // add the div to the screen so it becomes visible
  }                                                        // end of constructor

  updatePosition() {                                       // redraws the zebra at its current x, y
    this.element.style.left = `${this.x}px`;               // move the div horizontally
    this.element.style.top = `${this.y}px`;                // move the div vertically
    this.element.style.transform = `scaleX(${this.facing})`; // flip the image when facing is -1
  }                                                        // end of updatePosition

  remove() {                                               // deletes the zebra from the page
    this.element.remove();                                 // remove the zebra's div
  }                                                        // end of remove
}                                                          // end of Zebra class

class LevelOne {
  constructor() {                                          // runs once when the level object is created
    this.screen = document.querySelector(".levelOneScreen"); // find the level screen in the HTML
    this.tryAgainBtn = this.screen.querySelector(".tryAgainBtn"); // find the try again button inside it
    this.zebraSound = this.screen.querySelector(".zebraSound");   // find the audio tag in the HTML
    this.timerEl = this.screen.querySelector(".timer");    // the countdown display element
    this.timeLimit = 25;                                   // seconds allowed to cross
    this.startTime = 0;                                    // when the countdown began (ms)
    this.player = null;                                    // no zebra yet; created in start()
    this.lions = [];                                       // list of lions currently on screen
    this.isRunning = false;                                // the game loop is off until start()
    this.hasMoved = false;                                 // becomes true when the zebra first moves
    this.nextSpawnTime = 0;                                // time (ms) when the next lion should appear
    this.delayMin = 1000;                                  // shortest wait between lions (ms)
    this.delayMax = 3000;                                  // longest wait between lions (ms)
    this.maxLions = 8;                                     // most lions allowed on screen at once
    this.zebraSound.volume = 0.5;          // volume from 0 (silent) to 1 (full)
    

    document.addEventListener("keydown", (e) => {          // run this code on every key press
      if (!this.isRunning || !this.player) return;         // ignore keys if the game isn't running
      if (e.key.startsWith("Arrow")) e.preventDefault();   // stop arrow keys from scrolling the page

      const step = 10;                                     // pixels moved per key press
      if (e.key === "ArrowRight") { this.player.x += step; this.player.facing = 1; }  // move right, face right
      if (e.key === "ArrowLeft")  { this.player.x -= step; this.player.facing = -1; } // move left, face left
      if (e.key === "ArrowUp")    this.player.y -= step;   // move up
      if (e.key === "ArrowDown")  this.player.y += step;   // move down

      if (!this.hasMoved && e.key.startsWith("Arrow")) {   // first arrow key press of this round
        this.hasMoved = true;                              // remember the zebra has started moving
        this.startTime = performance.now();                // the 20 second countdown starts now
        this.nextSpawnTime = performance.now() + 1000;     // first lion appears 1 second later
        this.zebraSound.currentTime = 0;     // rewind to the start
        this.zebraSound.play();              // NEW: play the sound
        //this.zebraSound.volume = 0.5;    // volume from 0 (silent) to 1 (full); put this in the constructor
        //this.zebraSound.pause();         // stop the sound
      }                                                    // end of first-move block

      this.player.x = Math.max(0, Math.min(this.player.x, this.screen.offsetWidth - this.player.width));   // keep x between 0 and the right edge
      this.player.y = Math.max(0, Math.min(this.player.y, this.screen.offsetHeight - this.player.height)); // keep y between 0 and the bottom
      this.player.updatePosition();                        // redraw the zebra at its new position
    });                                                    // end of keydown listener
  }                                                        // end of constructor

  start() {                                                // starts (or restarts) the level
    this.stopSound();                    // NEW
    this.tryAgainBtn.classList.add("hidden");              // hide the try again button

    if (this.player) this.player.remove();                 // delete the old zebra if restarting
    this.player = new Zebra(this.screen);                  // create a fresh zebra

    this.lions.forEach(lion => lion.remove());             // delete all old lions from the page
    this.lions = [];                                       // start with an empty lion list
    this.hasMoved = false;                                 // lions and timer wait until the zebra moves
    this.timerEl.textContent = this.timeLimit;             // show 20 again on every retry

    this.isRunning = true;                                 // turn the game on
    this.animate();                                        // start the game loop
  }                                                        // end of start

  spawnLion() {                                            // creates one lion
    if (this.lions.length >= this.maxLions) return;        // stop if there are already too many

    const lionHeight = 30;                                 // must match the Lion class height
    const bandTop = this.screen.offsetHeight * 0.55;       // lions can appear from 60% of the screen height
    const bandBottom = this.screen.offsetHeight * 0.95;    // down to 95% of the screen height

    const y = bandTop + Math.random() * (bandBottom - bandTop - lionHeight); // random y inside the band
    const x = this.screen.offsetWidth;                     // start at the right edge of the screen
    const speed = 3 + Math.floor(Math.random() * 6);       // random speed from 3 to 8

    this.lions.push(new Lion(this.screen, x, y, speed));   // create the lion and add it to the list
  }                                                        // end of spawnLion

  animate() {                                              // the game loop, runs every frame
    if (!this.isRunning) return;                           // stop the loop if the game is over

    const now = performance.now();                         // current time in milliseconds
    if (this.hasMoved && now >= this.nextSpawnTime) {      // zebra has moved and the wait is over
      this.spawnLion();                                    // create a lion
      this.nextSpawnTime = now + this.delayMin + Math.random() * (this.delayMax - this.delayMin); // schedule the next one
    }                                                      // end of spawn block

    this.lions.forEach(lion => lion.move());               // move every lion one step to the left

    this.lions = this.lions.filter(lion => {               // keep only lions that return true
      if (lion.isOffScreen()) {                            // lion is fully past the left edge
        lion.remove();                                     // delete its div from the page
        return false;                                      // drop it from the list
      }                                                    // end of off-screen check
      return true;                                         // otherwise keep it
    });                                                    // end of filter

    for (const lion of this.lions) {                       // check every lion
      if (this.collides(this.player, lion)) {              // zebra and lion overlap
        return this.lose();                                // zebra was caught: game over
      }                                                    // end of collision check
    }                                                      // end of loop

    if (this.hasMoved) {                                   // the clock only runs after the first move
      const elapsed = (performance.now() - this.startTime) / 1000;        // seconds since the first move
      const remaining = Math.max(0, Math.ceil(this.timeLimit - elapsed)); // whole seconds left, never below 0
      this.timerEl.textContent = remaining;                // update the countdown display

      if (remaining <= 0) {                                // time is up
        return this.lose();                                // game over
      }                                                    // end of time-up check
    }                                                      // end of countdown block

    if (this.player.x + this.player.width >= this.screen.offsetWidth) { // zebra reached the right edge
      return this.win();                                   // player wins
    }                                                      // end of win check

    requestAnimationFrame(() => this.animate());           // schedule the next frame (about 60 per second)
  }                                                        // end of animate


stopSound() {
  this.zebraSound.pause();             // stop playing
  this.zebraSound.currentTime = 0;     // rewind to the start for next time
}

  win() {                                                  // called when the zebra crosses the screen
    this.isRunning = false;                                // stop the game loop

    this.stopSound();                    // NEW: stop the sound when level one ends
    this.lions.forEach(lion => lion.remove());             // clear the lions from the level
    this.lions = [];                                       // empty the lion list

    const finalScreen = document.querySelector(".finalScreen"); // find the final screen
    this.screen.style.display = "none";                    // hide level one
    finalScreen.style.display = "flex";                    // show the final screen
  }                                                        // end of win

  lose() {                                                 // called when the zebra is caught or time runs out
    this.isRunning = false;                                // stop the game loop

      this.stopSound();                    // NEW
    this.tryAgainBtn.classList.remove("hidden");           // show the try again button
  }                                                        // end of lose
}                                                          // end of LevelOne class

                                                         // end of Alive class