class Disparo {
  constructor(posicion1, posicion2, orientacion) {
    this.node = document.createElement("img");
    this.node.src = "/images/laserAB.png";
    gameBoxNode.append(this.node);

    this.orientacion = orientacion;
    this.x = posicion1;
    this.y = posicion2;
    this.w = 5;
    this.h = 5;
    this.speed = 10;
    this.damage = 1

    this.node.style.position = `absolute`;
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
  }

  disparoMovement() {
    if (this.orientacion === "derecha") {
      this.node.src = "/images/laserDI.png";
      this.w = 25;
      this.h = 3;
      this.x += this.speed;
    }
    if (this.orientacion === "izquierda") {
      this.node.src = "/images/laserDI.png";
      this.w = 25;
      this.h = 3;
      this.x -= this.speed;
    }
    if (this.orientacion === "abajo") {
      this.node.src = "/images/laserAB.png";
      this.w = 3;
      this.h = 25;
      this.y += this.speed;
    }
    if (this.orientacion === "arriba") {
      this.node.src = "/images/laserAB.png";
      this.w = 3;
      this.h = 25;
      this.y -= this.speed;
    }
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
  }
  
}
