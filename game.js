console.log("conectado");

//PANTALLAS
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const finalScreenNode = document.querySelector("#game-over-screen");

//BOTONES
const startBtnNode = document.querySelector("#start-btn");
startBtnNode.addEventListener("click", () => {
  startGame();
  startBtnNode.style.display = "none";
});

//GAME BOX
const gameBoxNode = document.querySelector("#game-box");

//VARIABLES
const keysPressed = new Set(); // Set almacena teclas activas y no dando lugar a una repeticion de las mismas
let mainInterval = null;
let player = null;
let tieInterval = null;
let laserInterval = null;
let tieArr = [];
let tieArr2 = [];
let disparoArr = [];

//FUNCIONES DEL JUEGO

const startGame = () => {
  //console.log("Iniciando el juego");
  player = new Player();
  mainInterval = setInterval(() => {
    gameLoop();
  }, Math.round(1000 / 60));

  tieInterval = setInterval(() => {
    tieSpawn();
    //console.log(tieArr);
  }, 5000);

  laserInterval = setInterval(() => {
    disparoSpawn();
    //console.log(disparoArr);
  }, 250);
};
const gameLoop = () => {
  enemyMove();
  playerEnemyCollision();
  tieDespawn();
  disparoArr.forEach((disparo) => {
    disparo.disparoMovement();
  });
  disparoDespawn();
  disparoEnemyCollision();
};
const movePlayer = () => {
  //".has" comprueba si existe en el Set
  if (keysPressed.has("d")) {
    player.node.src = "/images/wingXD.png";
    player.orientacion = "derecha";
    player.x += 10;
  }
  if (keysPressed.has("a")) {
    player.node.src = "/images/wingXI.png";
    player.orientacion = "izquierda";
    player.x -= 10;
  }
  if (keysPressed.has("s")) {
    player.node.src = "/images/wingXA.png";
    player.orientacion = "abajo";
    player.y += 10;
  }
  if (keysPressed.has("w")) {
    player.node.src = "/images/wingX.png";
    player.orientacion = "arriba";
    player.y -= 10;
  }

  player.node.style.left = `${player.x}px`;
  player.node.style.top = `${player.y}px`;
  //console.log(keysPressed);
};
const enemyMove = () => {
  tieArr.forEach((enemigo) => {
    enemigo.movement();
  });
  tieArr2.forEach((enemigo) => {
    enemigo.movement2();
  });
};
const tieSpawn = () => {
  for (let i = 0; i < 5; i++) {
    tieArr.push(
      new Enemigo(
        Math.random() * (gameBoxNode.offsetWidth - 38),
        gameBoxNode.offsetHeight
      )
    );
  }

  for (let i = 0; i < 5; i++) {
    tieArr2.push(
      new Enemigo(Math.random() * (gameBoxNode.offsetWidth - 38), -38)
    );
  }
};
const tieDespawn = () => {
  tieArr = tieArr.filter((tie) => {
    if (tie.y <= 0 - tie.h) {
      console.log("Enemy deleted");
      tie.node.remove();
      return false; // Removemos nodo del DOM y lo eliminamos del array
    }
    return true; // Se mantiene en el array
  });

  tieArr2 = tieArr2.filter((tie) => {
    if (tie.y <= 0 - tie.h) {
      console.log("Enemy deleted");
      tie.node.remove();
      return false; // Removemos nodo del DOM y lo eliminamos del array
    }
    return true; // Se mantiene en el array
  });
};

const gameOver = () => {
  clearInterval(mainInterval);
  clearInterval(tieInterval);
  clearInterval(laserInterval);
  /*gameScreenNode.style.display = "none"
gameOverScreenNode.style.display = "flex"*/
};
const playerEnemyCollision = () => {
  tieArr.forEach((eachTie) => {
    //Verificamos en cada array si hay colision
    if (
      eachTie.x < player.x + player.w &&
      eachTie.x + eachTie.w > player.x &&
      eachTie.y < player.y + player.h &&
      eachTie.y + eachTie.h > player.y
    ) {
      gameOver();
    }
  });

  tieArr2.forEach((eachTie) => {
    if (
      eachTie.x < player.x + player.w &&
      eachTie.x + eachTie.w > player.x &&
      eachTie.y < player.y + player.h &&
      eachTie.y + eachTie.h > player.y
    ) {
      gameOver();
    }
  });
};
const disparoSpawn = () => {
  let playerCenterX = player.x + player.node.offsetWidth / 2;
  let playerCenterY = player.y + player.node.offsetHeight / 2;

  let disparoX = playerCenterX -1;
  let disparoY = playerCenterY -1;

  let disparo = new Disparo(disparoX, disparoY, player.orientacion);
  disparoArr.push(disparo);
};
const disparoDespawn = () => {
  disparoArr = disparoArr.filter((disparo) => {
    //filtramos array principal
    if (
      disparo.x < 0 ||
      disparo.x > gameBoxNode.offsetWidth ||
      disparo.y < 0 ||
      disparo.y > gameBoxNode.offsetHeight
    ) {
      //console.log(disparo.x, disparo.y)
      disparo.node.remove();
      return false; // Elimina este elemento del array
    }
    return true; // Mantiene este elemento en el array
  });
};
const disparoEnemyCollision = () => {
  const disparosToRemove = []; //lista de indice de los disparos a eliminar
  const enemigosToRemove = []; //lista de enemigos a eliminar, incluyendo array e indice

  disparoArr.forEach((disparo, disparoIndice) => {
    // Iteramos sobre cada disparo
    tieArr.forEach((enemigo, enemigoIndice) => {
      if (
        disparo.x < enemigo.x + enemigo.w &&
        disparo.x + disparo.w > enemigo.x &&
        disparo.y < enemigo.y + enemigo.h &&
        disparo.y + disparo.h > enemigo.y
      ) {
        console.log("Colision con enemigo");
        //si hay colision, eliminamos nodos y almacenamos indices
        enemigo.node.remove();
        disparo.node.remove();
        disparosToRemove.push(disparoIndice);
        enemigosToRemove.push({ arr: tieArr, index: enemigoIndice });
      }
    });
    tieArr2.forEach((enemigo, enemigoIndice) => {
      if (
        disparo.x < enemigo.x + enemigo.w &&
        disparo.x + disparo.w > enemigo.x &&
        disparo.y < enemigo.y + enemigo.h &&
        disparo.y + disparo.h > enemigo.y
      ) {
        console.log("Colision con enemigo");
        //si hay colision, eliminamos nodos y almacenamos indices
        enemigo.node.remove();
        disparo.node.remove();
        disparosToRemove.push(disparoIndice);
        enemigosToRemove.push({ arr: tieArr2, index: enemigoIndice });
      }
    });
  });

  // Eliminar disparos en orden inverso para evitar problemas con el indice
  disparosToRemove.reverse().forEach((index) => {
    disparoArr.splice(index, 1);
  });
  enemigosToRemove.reverse().forEach(({ arr, index }) => {
    arr.splice(index, 1);
  });
};

//EVENTOS

document.addEventListener("keydown", (event) => {
  //Keydown se activa cuando se presiona una tecla
  keysPressed.add(event.key); // Añade tecla presionada al Set y activa la funcion
  movePlayer(); //Llama la funcion y lo que hace es mover el player
});

document.addEventListener("keyup", (event) => {
  //Se activa cuando se suelta una tecla
  keysPressed.delete(event.key); //Borra la tecla que esta en el Set
});
