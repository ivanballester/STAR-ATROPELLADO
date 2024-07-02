class Enemigo {
    constructor(x, y, vida){
        this.node = document.createElement("img")
        this.node.src = "/images/tie.png"
        gameBoxNode.append(this.node)

        this.x = x
        this.y = y
        this.w = 38 
        this.h = 38
        this.vida = 1
        

        this.speed = 1

         
         this.node.style.position = `absolute`
         this.node.style.width = `${this.w}px`
         this.node.style.height = `${this.h}px`
         this.node.style.top = `${this.y}px`
         this.node.style.left = `${this.x}px`
    }
    movement (){
        this.y -= this.speed
        this.node.style.top = `${this.y}px` 
    }
    movement2(){
        this.y += this.speed
        this.node.style.top = `${this.y}px` 
    }

    recibirDisparo (){
        this.vida--;
        if (this.vida <= 0){
            this.node.remove();
            return true // Enemigo tiene vida aun
        }
        return false // Enemigo eliminado?

    }

}  