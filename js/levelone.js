class LevelOne {
  constructor() {                                          
    this.screen = document.querySelector(".levelOneScreen"); 
    this.tryAgainBtn = this.screen.querySelector(".tryAgainBtn"); 
    this.zebraSound = this.screen.querySelector(".zebraSound");   
    this.lionSound = this.screen.querySelector(".lionSound");   
    this.timerEl = this.screen.querySelector(".timer");    
    this.messageEl = this.screen.querySelector(".message");   
    this.scoreEl = this.screen.querySelector(".score");   
    this.bestEl = this.screen.querySelector(".best");                    
    this.bestScore = Number(localStorage.getItem("bestScore")) || 0;     
    this.bestEl.textContent = "Best: " + this.bestScore;                 
    this.score = 0;                                       
    this.timeLimit = 25;                                   
    this.startTime = 0;                                    
    this.zebras = null;                                    
    this.lions = [];                                       
    this.isRunning = false;                                
    this.hasMoved = false;                                 
    this.nextSpawnTime = 0;                                
    this.delayMin = 1000;                                  
    this.delayMax = 2000;                                  
    this.maxLions = 18;                                     
    this.zebraSound.volume = 0.5;          
    this.lionSound.volume = 0.8;          

    

    document.addEventListener("keydown", (e) => {          
      if (!this.isRunning || !this.zebras) return;         
      if (e.key.startsWith("Arrow")) e.preventDefault();   

      const step = 12;                                     
      if (e.key === "ArrowRight") { this.zebras.x += step; this.zebras.facing = 1; }  
      if (e.key === "ArrowLeft")  { this.zebras.x -= step; this.zebras.facing = -1; } 
      if (e.key === "ArrowUp")    this.zebras.y -= step;   
      if (e.key === "ArrowDown")  this.zebras.y += step;   

      if (!this.hasMoved && e.key.startsWith("Arrow")) {   
        this.hasMoved = true;                              
        this.startTime = performance.now();                
        this.nextSpawnTime = performance.now() + 1000;     
        this.zebraSound.currentTime = 0;     
        this.zebraSound.play();              
      
      }                                                    

      this.zebras.x = Math.max(0, Math.min(this.zebras.x, this.screen.offsetWidth - this.zebras.width));   
      const limits = this.getZebraLimits();                                        
      this.zebras.y = Math.max(limits.top, Math.min(this.zebras.y, limits.bottom)); 
      this.zebras.updatePosition();                        
    });                                                    
  }                                                       
 // end of constructor defining the elemnts in Level One

  start() {                                                
    this.stopSound();                                      
    this.tryAgainBtn.classList.add("hidden");              
    this.timerEl.textContent = this.timeLimit;
    this.score = 0;                                       
    this.scoreEl.textContent = "Score: 0";                
    this.messageEl.classList.add("hidden");                    

    if (this.zebras) this.zebras.remove();                 
    this.zebras = new Zebra(this.screen);                  

    const limits = this.getZebraLimits();
    this.zebras.y = (limits.top + limits.bottom) / 2;     
    this.zebras.updatePosition();                         

    this.lions.forEach(lion => lion.remove());             
    this.lions = [];                                       
    this.hasMoved = false;                                 
    this.timerEl.textContent = this.timeLimit;             
    this.lionSound.pause();                                
    this.lionSound.currentTime = 0;

    this.isRunning = true;                                 
    this.animate();                                        
  }                                                        
// end of game start


  spawnLion() {                                            
    if (this.lions.length >= this.maxLions) return;        

    const lionHeight = 30;                                 
    const bandTop = this.screen.offsetHeight * 0.55;       
    const bandBottom = this.screen.offsetHeight * 0.95;    

    const y = bandTop + Math.random() * (bandBottom - bandTop - lionHeight); 
    const x = this.screen.offsetWidth;                     
    const speed = 3 + Math.floor(Math.random() * 5);       

    this.lions.push(new Lion(this.screen, x, y, speed));   
  }                                                        
// end of how lion will behave in the game


  animate() {                                              
  if (!this.isRunning) return;                           

  const now = performance.now();                         
  if (this.hasMoved && now >= this.nextSpawnTime) {      
    this.spawnLion();                                    
    this.nextSpawnTime = now + this.delayMin + Math.random() * (this.delayMax - this.delayMin); 
  }

  this.lions.forEach(lion => lion.move());               

  this.lions = this.lions.filter(lion => {               
    if (lion.isOffScreen()) {
      lion.remove();                                     
      return false;                                      
    }
    return true;                                         
  });

  for (const lion of this.lions) {                       
    if (this.collides(this.zebras, lion)) {              
      return this.lose(true, lion);                     
    }
  }

  if (this.hasMoved) {                                   
    const elapsed = (performance.now() - this.startTime) / 1000;         
    const remaining = Math.max(0, Math.ceil(this.timeLimit - elapsed)); 
    this.timerEl.textContent = remaining;                

    this.score = Math.floor(elapsed);                    
    this.scoreEl.textContent = "Score: " + this.score;   

    if (remaining <= 0) {                                
      return this.lose();                                
    }
  }

  if (this.zebras.x + this.zebras.width >= this.screen.offsetWidth) { 
    return this.win();                                   
  }

  requestAnimationFrame(() => this.animate());           
}

collides(zebra, lion) {
  const sameLine = 20;          
  const overlapNeeded = 20;     

  
  const zebraMiddleY = zebra.y + zebra.height / 2;
  const lionMiddleY = lion.y + lion.height / 2;

  
  const zebraLeft = zebra.x;
  const zebraRight = zebra.x + zebra.width;
  const lionLeft = lion.x;
  const lionRight = lion.x + lion.width;

  
  if (Math.abs(zebraMiddleY - lionMiddleY) > sameLine) {
    return false;                                       
  }

  
  const rightMostLeftEdge = Math.max(zebraLeft, lionLeft);     
  const leftMostRightEdge = Math.min(zebraRight, lionRight);   
  const overlap = leftMostRightEdge - rightMostLeftEdge;       

  if (overlap < overlapNeeded) {
    return false;                                       
  }

  
  if (zebra.facing !== 1) {
    return false;
  }

  
  return true;
}

stopSound() {
  this.zebraSound.pause();             
  this.zebraSound.currentTime = 0;     
}

getZebraLimits() {
  const zebraHeight = 55;                                    
  const top = this.screen.offsetHeight * 0.55;               
  const bottom = this.screen.offsetHeight * 0.95 - zebraHeight;   
  return { top: top, bottom: bottom };                       
}

saveBest() {
  if (this.score > this.bestScore) {                       
    this.bestScore = this.score;                           
    localStorage.setItem("bestScore", this.bestScore);     
    this.bestEl.textContent = "Best: " + this.bestScore;   
  }
}


  win() {                                                  
    this.isRunning = false;                                
    this.saveBest();                                       

    this.stopSound();                                      
    this.lions.forEach(lion => lion.remove());             
    this.lions = [];                                       

    const finalScoreEl = document.querySelector(".finalScore");   
    finalScoreEl.textContent = "Score: " + this.score;            

    const finalScreen = document.querySelector(".finalScreen"); 
    this.screen.style.display = "none";                    
    finalScreen.style.display = "flex";                    
  }                                                        

lose(caughtByLion, hitLion) {                           
  this.isRunning = false;                              
  this.stopSound();                                    
  this.saveBest();                                    

  if (caughtByLion) {  
    this.lionSound.currentTime = 0;                    
    this.lionSound.play();                             
    this.messageEl.textContent = "The 🦁 got me";   
  } else {                                                 
    this.messageEl.textContent = "My ⏰ is up, too old";         
  }
  this.messageEl.classList.remove("hidden");               
  

  this.tryAgainBtn.classList.remove("hidden");         
}
}
