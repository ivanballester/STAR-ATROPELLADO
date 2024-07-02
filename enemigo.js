class Enemigo {
  constructor(x, y, vida, w, h) {
    this.node = document.createElement("img");
    this.node.src = "/images/tie.png";
    gameBoxNode.append(this.node);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vida = vida;

    this.speed = 1;

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

  /*moveToPlayer(playerX, playerY) {
    //Calculo la diferencia coordenadas jugador/enemigo
    this.x += (playerX - this.x) * this.speed;
    this.y += (playerY - this.y) * this.speed;

    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
  }*/
}
