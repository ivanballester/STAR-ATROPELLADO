class Enemigo {
    constructor(x, y, ){
        this.node = document.createElement("img")
        this.node.src = "/images/tie.png"
        gameBoxNode.append(this.node)

        this.x = x
        this.y = y
        this.w = 50 
        this.h = 50
        

        this.speed = 1

         
         this.node.style.position = `absolute`
         this.node.style.width = `${this.w}px`
         this.node.style.width = `${this.h}px`
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

}  