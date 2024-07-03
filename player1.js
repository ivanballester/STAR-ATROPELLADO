class Player {
    constructor (){
        this.node = document.createElement("img")
        this.node.src = "./images/wingX.png"
        gameBoxNode.append(this.node)
        this.x = 300 
        this.y = 400 
        this.w = 50 
        this.h = 50 
        this.orientacion = "arriba"

       
        this.node.style.position = `absolute`
        this.node.style.width = `${this.w}px`
        this.node.style.height = `${this.h}px`
        this.node.style.top = `${this.y}px`
        this.node.style.left = `${this.x}px`
    }

    /*movement (){
        document.addEventListener("keydown",(event) => {
            if (event.key === "ArrowRight"){
                this.x += 1
                this.node.style.left = `${this.x}px`
            }
        
            if (event.key === "ArrowLeft"){
                this.x -= 1
                this.node.style.left = `${this.x}px`
            }
            if (event.key === "ArrowRight"){
                paddleX += 10
                paddleNode.style.left = `${paddleX}px`
            }
        
            if (event.key === "ArrowLeft"){
                paddleX -= 10
                paddleNode.style.left = `${paddleX}px`
            }
        })
    }*/
}