class Zebra {
  constructor(screen) {                                   
    this.screen = screen;                                  
    this.x = 0;                                            
    this.y = 270;                                           
    this.width = 112;                                      
    this.height = 55;                                      
    this.facing = 1;                                       
    this.image = "https://i.pinimg.com/originals/f4/30/57/f4305767fe8cc6128a2628972b8f304c.gif"; 

    this.element = document.createElement("div");          
    this.element.style.position = "absolute";              
    this.element.style.width = `${this.width}px`;          
    this.element.style.height = `${this.height}px`;        
    this.element.style.backgroundImage = `url('${this.image}')`; 
    this.element.style.backgroundSize = "cover";           
    this.element.style.backgroundRepeat = "no-repeat";     
    this.element.style.zIndex = "10";                      

    const bandTop = this.screen.offsetHeight * 0.60;       
    const bandBottom = this.screen.offsetHeight * 0.95;    


    this.updatePosition();                                 
    this.screen.appendChild(this.element);                 
  }                                                        

  updatePosition() {                                       
    this.element.style.left = `${this.x}px`;               
    this.element.style.top = `${this.y}px`;                
    this.element.style.transform = `scaleX(${this.facing})`; 
  }                                                        

  remove() {                                               
    this.element.remove();                                 
  }                                                        
}                                                          