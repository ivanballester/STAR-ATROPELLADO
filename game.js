console.log("conectado")

//PANTALLAS
const startScreenNode = document.querySelector("#start-screen")
const gameScreenNode = document.querySelector("#game-screen")
const finalScreenNode = document.querySelector("#game-over-screen")

//BOTONES
const startBtnNode = document.querySelector("#start-btn")
startBtnNode.addEventListener("click",()=>{
    startGame()
    startBtnNode.style.display = "none"
})

//GAME BOX 
const gameBoxNode = document.querySelector("#game-box")


//VARIABLES
const keysPressed = new Set(); // Set almacena teclas activas y no dando lugar a una repeticion de las mismas
let mainInterval = null;
let player = null;
let tieInterval = null;
let tieArr = []
let tieArr2 = []

//FUNCIONES DEL JUEGO

const startGame = ()=>{
    console.log("Iniciando el juego")
    player = new Player ()
    mainInterval = setInterval(()=>{
        gameLoop()


    }, Math.round(1000/60))

    tieInterval = setInterval(() => {
        tieSpawn()
        console.log(tieArr)
        tieDespawn()
    }, 3000);
}
const gameLoop = ()=>{
    enemyMove()
}
const movePlayer = () => { //".has" comprueba si existe en el Set
    if (keysPressed.has("d")) {
        player.node.src = "/images/wingXD.png"
        player.x += 10;
    }
    if (keysPressed.has("a")) {
        player.node.src = "/images/wingXI.png"
        player.x -= 10;
    }
    if (keysPressed.has("s")) {
        player.node.src = "/images/wingXA.png"
        player.y += 10;
    }
    if (keysPressed.has("w")) {
        player.node.src = "/images/wingX.png"
        player.y -= 10;
    }

    player.node.style.left = `${player.x}px`;
    player.node.style.top = `${player.y}px`;
    console.log(keysPressed)
}
const enemyMove = () =>{
    tieArr.forEach(enemigo =>{
         enemigo.movement()
    })
    tieArr2.forEach(enemigo =>{
        enemigo.movement2()
   })

}
const tieSpawn = () => {
    
for (let i = 0; i < 5; i++) {
    tieArr.push(new Enemigo(Math.random() * (gameBoxNode.offsetWidth - 50), gameBoxNode.offsetHeight));
}

for (let i = 0; i < 5; i++) {
    tieArr2.push(new Enemigo(Math.random() * (gameBoxNode.offsetWidth - 50), -50))
}
}
const tieDespawn = () =>{
    let firstTie = tieArr[0]
    if (firstTie && firstTie.y <= 0 - firstTie.h){     

        tieArr.splice(0, 5)
        tieArr2.splice(0 ,5)
        firstTie.node.remove()
    }
}
const gameOver = ()=>{
clearInterval(mainInterval)
clearInterval(tieInterval)
gameScreenNode.style.display = "none"
gameOverScreenNode.style.display = "flex"
}


//EVENTOS

document.addEventListener("keydown", (event) => { //Keydown se activa cuando se presiona una tecla
    keysPressed.add(event.key); // Añade tecla presionada al Set y activa la funcion
    movePlayer(); //Llama la funcion y lo que hace es mover el player
});

document.addEventListener("keyup", (event) => { //Se activa cuando se suelta una tecla
    keysPressed.delete(event.key);  //Borra la tecla que esta en el Set
});

