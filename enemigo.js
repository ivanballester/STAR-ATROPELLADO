class Enemigo {
  constructor(x, y, vida, w, h, speed, speedX, speedY) {
    this.node = document.createElement("img");
    this.node.src = "./images/tie.png";
    gameBoxNode.append(this.node);

    this.speedX = speedX
    this.speedY = speedY
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vida = vida;

    this.speed = speed;

    this.node.style.position = `absolute`;
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
  }
  movement() {
    this.y -= this.speed;
    this.node.style.top = `${this.y}px`;
  }
  movement2() {
    this.y += this.speed;
    this.node.style.top = `${this.y}px`;
  }
  bossMovement (){
    this.x += this.speedX //Movimiento horizontal
    this.y += this.speedY //Movimiento vertical

    //Creamos colisiones
    if (this.x <= 0 || this.x + this.w >= gameBoxNode.offsetWidth){
      this.speedX *= -1; //Invierto la direccion X en el borde
    }
    if (this.y <= 0 || this.y + this.h >= gameBoxNode.offsetHeight) {
      this.speedY *= -1;//Invierto la direccion Y en el borde
    }

    //Actualizo
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
  }
}
