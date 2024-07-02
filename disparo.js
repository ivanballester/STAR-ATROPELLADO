class Disparo {
    constructor(posicion1, posicion2, orientacion){
        this.node = document.createElement("img")
        this.node.src = "/images/laserAB.png"
        gameBoxNode.append(this.node)

        this.orientacion = orientacion
        this.x = posicion1
        this.y = posicion2
        this.w = 10
        this.h = 10
        this.speed = 4

        this.node.style.position = `absolute`
        this.node.style.width = `${this.w}px`
        this.node.style.width = `${this.h}px`
        this.node.style.top = `${this.y}px`
        this.node.style.left = `${this.x}px`

    }

    disparoMovement(){
        if (this.orientacion === "derecha") {
            this.node.src = "/images/laserDI.png"
            this.x += 10;
        }
        if (this.orientacion === "izquierda") {
            this.node.src = "/images/laserDI.png"
            this.x -= 10;
        }
        if (this.orientacion === "abajo") {
            this.node.src = "/images/laserAB.png"
            this.y += 10;
        }
        if (this.orientacion === "arriba") {
            this.node.src = "/images/laserAB.png"
            this.y -= 10;
        }
    
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
    }


}