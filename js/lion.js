class Lion {
  constructor(screen, x, y, speed) {
    this.screen = screen;      
    this.x = x;                
    this.y = y;                
    this.width = 110;           
    this.height = 60;          
    this.speed = speed;        
    this.image = "https://i.pinimg.com/originals/c1/0f/09/c10f09d7fe6f756c8abf441c92a0ba3c.gif";

    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.backgroundImage = `url('${this.image}')`;   
    this.element.style.backgroundSize = "cover";
    this.element.style.backgroundRepeat = "no-repeat";
    this.element.style.zIndex = "2";

    this.updatePosition();
    this.screen.appendChild(this.element);
  }

move() {
    this.x -= this.speed;     
    this.updatePosition();    
  }

  isOffScreen() {
    return this.x + this.width < 0;   
  }

  updatePosition() {                           
    this.element.style.left = `${this.x}px`;   
    this.element.style.top = `${this.y}px`;    
  }

  remove() {
    this.element.remove();    
  }
}