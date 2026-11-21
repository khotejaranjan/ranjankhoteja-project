class LevelOne {
  constructor() {                                          // runs once when the level object is created
    this.screen = document.querySelector(".levelOneScreen"); // find the level screen in the HTML
    this.tryAgainBtn = this.screen.querySelector(".tryAgainBtn"); // find the try again button inside it
    this.zebraSound = this.screen.querySelector(".zebraSound");   // find the audio tag in the HTML
    this.lionSound = this.screen.querySelector(".lionSound");   // find the audio tag in the HTML
    this.timerEl = this.screen.querySelector(".timer");    // the countdown display element
    this.messageEl = this.screen.querySelector(".message");   // the message box
    this.scoreEl = this.screen.querySelector(".score");   // the score display
    this.bestEl = this.screen.querySelector(".best");                    // the best score display
    this.bestScore = Number(localStorage.getItem("bestScore")) || 0;     // load the saved score, or 0 if there isn't one
    this.bestEl.textContent = "Best: " + this.bestScore;                 // show it on screen
    this.score = 0;                                       // points earned so far
    this.timeLimit = 25;                                   // seconds allowed to cross
    this.startTime = 0;                                    // when the countdown began (ms)
    this.zebras = null;                                    // no zebra yet; created in start()
    this.lions = [];                                       // list of lions currently on screen
    this.isRunning = false;                                // the game loop is off until start()
    this.hasMoved = false;                                 // becomes true when the zebra first moves
    this.nextSpawnTime = 0;                                // time (ms) when the next lion should appear
    this.delayMin = 1000;                                  // shortest wait between lions (ms)
    this.delayMax = 3000;                                  // longest wait between lions (ms)
    this.maxLions = 8;                                     // most lions allowed on screen at once
    this.zebraSound.volume = 0.5;          // volume from 0 (silent) to 1 (full)
    this.lionSound.volume = 0.8;          // volume from 0 (silent) to 1 (full)

    

    document.addEventListener("keydown", (e) => {          // run this code on every key press
      if (!this.isRunning || !this.zebras) return;         // ignore keys if the game isn't running
      if (e.key.startsWith("Arrow")) e.preventDefault();   // stop arrow keys from scrolling the page

      const step = 10;                                     // pixels moved per key press
      if (e.key === "ArrowRight") { this.zebras.x += step; this.zebras.facing = 1; }  // move right, face right
      if (e.key === "ArrowLeft")  { this.zebras.x -= step; this.zebras.facing = -1; } // move left, face left
      if (e.key === "ArrowUp")    this.zebras.y -= step;   // move up
      if (e.key === "ArrowDown")  this.zebras.y += step;   // move down

      if (!this.hasMoved && e.key.startsWith("Arrow")) {   // first arrow key press of this round
        this.hasMoved = true;                              // remember the zebra has started moving
        this.startTime = performance.now();                // the 20 second countdown starts now
        this.nextSpawnTime = performance.now() + 1000;     // first lion appears 1 second later
        this.zebraSound.currentTime = 0;     // rewind to the start
        this.zebraSound.play();              // NEW: play the sound
        //this.zebraSound.volume = 0.5;    // volume from 0 (silent) to 1 (full); put this in the constructor
        //this.zebraSound.pause();         // stop the sound
      }                                                    // end of first-move block

      this.zebras.x = Math.max(0, Math.min(this.zebras.x, this.screen.offsetWidth - this.zebras.width));   // keep x between 0 and the right edge
      const limits = this.getZebraLimits();                                        // get the top and bottom limits
      this.zebras.y = Math.max(limits.top, Math.min(this.zebras.y, limits.bottom)); // keep y between the two limits
      this.zebras.updatePosition();                        // redraw the zebra at its new position
    });                                                    // end of keydown listener
  }                                                        // end of constructor

  start() {                                                // starts (or restarts) the level
    this.stopSound();                    // NEW
    this.tryAgainBtn.classList.add("hidden");              // hide the try again button
    this.timerEl.textContent = this.timeLimit;
    this.score = 0;                                       // NEW: back to zero
    this.scoreEl.textContent = "Score: 0";                // NEW: show zero again
    this.messageEl.classList.add("hidden");                    // hide the old message

    if (this.zebras) this.zebras.remove();                 // delete the old zebra if restarting
    this.zebras = new Zebra(this.screen);                  // create a fresh zebra

    const limits = this.getZebraLimits();
    this.zebras.y = (limits.top + limits.bottom) / 2;     // start in the middle of the allowed area
    this.zebras.updatePosition();                         // redraw the zebra there

    this.lions.forEach(lion => lion.remove());             // delete all old lions from the page
    this.lions = [];                                       // start with an empty lion list
    this.hasMoved = false;                                 // lions and timer wait until the zebra moves
    this.timerEl.textContent = this.timeLimit;             // show 20 again on every retry
    this.lionSound.pause();                                // stop a roar still playing from the last round
    this.lionSound.currentTime = 0;

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
  }

  this.lions.forEach(lion => lion.move());               // move every lion one step to the left

  this.lions = this.lions.filter(lion => {               // keep only lions that are still on screen
    if (lion.isOffScreen()) {
      lion.remove();                                     // delete its div from the page
      return false;                                      // drop it from the list
    }
    return true;                                         // otherwise keep it
  });

  for (const lion of this.lions) {                       // check every lion
    if (this.collides(this.zebras, lion)) {              // zebra and lion overlap
      return this.lose(true, lion);                            // true = caught by a lion (plays the roar)
    }
  }

  if (this.hasMoved) {                                   // the clock only runs after the first move
    const elapsed = (performance.now() - this.startTime) / 1000;         // seconds since the first move
    const remaining = Math.max(0, Math.ceil(this.timeLimit - elapsed)); // whole seconds left
    this.timerEl.textContent = remaining;                // update the countdown display

    this.score = Math.floor(elapsed);                    // 1 point per full second alive
    this.scoreEl.textContent = "Score: " + this.score;   // show the score

    if (remaining <= 0) {                                // time is up
      return this.lose();                                // no roar, because no lion hit the zebra
    }
  }

  if (this.zebras.x + this.zebras.width >= this.screen.offsetWidth) { // zebra reached the right edge
    return this.win();                                   // player wins
  }

  requestAnimationFrame(() => this.animate());           // schedule the next frame
}

collides(zebra, lion) {
  // Settings you can change (in pixels)
  const sameLine = 20;          // max height difference between the two middles
  const overlapNeeded = 20;     // how far the zebra must push INTO the lion before it counts

  // Step 1: the middle height of each animal
  const zebraMiddleY = zebra.y + zebra.height / 2;
  const lionMiddleY = lion.y + lion.height / 2;

  // Step 2: the sideways edges
  const zebraLeft = zebra.x;
  const zebraRight = zebra.x + zebra.width;
  const lionLeft = lion.x;
  const lionRight = lion.x + lion.width;

  // Step 3: must be almost exactly on the same line
  if (Math.abs(zebraMiddleY - lionMiddleY) > sameLine) {
    return false;                                       // different lines: no hit
  }

  // Step 4: how much do they overlap sideways?
  const rightMostLeftEdge = Math.max(zebraLeft, lionLeft);     // the later of the two left edges
  const leftMostRightEdge = Math.min(zebraRight, lionRight);   // the earlier of the two right edges
  const overlap = leftMostRightEdge - rightMostLeftEdge;       // size of the shared part (negative = not touching)

  if (overlap < overlapNeeded) {
    return false;                                       // only barely touching: no hit
  }

  // Step 5: must be face to face (the lions run left, so the zebra must face right)
  if (zebra.facing !== 1) {
    return false;
  }

  // Step 6: same line, deep overlap, face to face
  return true;
}




stopSound() {
  this.zebraSound.pause();             // stop playing
  this.zebraSound.currentTime = 0;     // rewind to the start for next time
}

getZebraLimits() {
  const zebraHeight = 55;                                    // must match the Zebra class height
  const top = this.screen.offsetHeight * 0.55;               // highest the zebra can go (55% down the screen)
  const bottom = this.screen.offsetHeight * 0.95 - zebraHeight;   // lowest the zebra's TOP edge can go, so its feet stay above 95%
  return { top: top, bottom: bottom };                       // give both numbers back
}

saveBest() {
  if (this.score > this.bestScore) {                       // is this round better than the saved best?
    this.bestScore = this.score;                           // yes: remember it
    localStorage.setItem("bestScore", this.bestScore);     // save it in the browser
    this.bestEl.textContent = "Best: " + this.bestScore;   // update the screen
  }
}


  win() {                                                  // called when the zebra crosses the screen
    this.isRunning = false;                                // stop the game loop
    this.saveBest();                 // NEW: save if it's a new record

    this.stopSound();                    // NEW: stop the sound when level one ends
    this.lions.forEach(lion => lion.remove());             // clear the lions from the level
    this.lions = [];                                       // empty the lion list

    const finalScoreEl = document.querySelector(".finalScore");   // find the score text on the final screen
    //document.querySelector(".finalBest").textContent = "Best: " + this.bestScore;
    finalScoreEl.textContent = "Score: " + this.score;            // copy the score into it

    const finalScreen = document.querySelector(".finalScreen"); // find the final screen
    this.screen.style.display = "none";                    // hide level one
    finalScreen.style.display = "flex";                    // show the final screen
  }                                                        // end of win

lose(caughtByLion, hitLion) {                                   // caughtByLion is true only when a lion hit the zebra
  this.isRunning = false;                              // stop the game loop
  this.stopSound();                                    // stop the zebra sound
  this.saveBest();                 // NEW: save if it's a new record

  if (caughtByLion) {  
    this.lionSound.currentTime = 0;                    // rewind to the start
    this.lionSound.play();                             // play the lion sound
    this.messageEl.textContent = "The 🦁 got me";   // NEW: collision message
  } else {                                                 // time ran out
    this.messageEl.textContent = "My ⏰ is up, too old";         // NEW: time-up message
  }
  this.messageEl.classList.remove("hidden");               // NEW: show the message
  

  this.tryAgainBtn.classList.remove("hidden");         // show the try again button
}
}
