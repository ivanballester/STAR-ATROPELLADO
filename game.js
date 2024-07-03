console.log("conectado");

//PANTALLAS
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const finalScreenNode = document.querySelector("#game-over-screen");
const timerNode = document.querySelector("#timer");

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
let timerInterval = null;
let minutos = 0;
let segundos = 0;
let mainInterval = null;
let player = null;
let tieInterval = null;
let laserInterval = null;
let miniBossCreated = false;
let tieArr = [];
let tieArr2 = [];
let disparoArr = [];
let velocidadDisparo = 300  // Limpiar intervalo, acto seguido inicar uno nuevo
//FUNCIONES DEL JUEGO

const startGame = () => {
  //console.log("Iniciando el juego");
  player = new Player();
  startTimer();
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
  }, velocidadDisparo);
};
const gameLoop = () => {
  disparoArr.forEach((disparo) => {
    disparo.disparoMovement();
  });
  enemyMove();
  playerEnemyCollision();
  tieDespawn();
  disparoDespawn();
  disparoEnemyCollision();
  newMiniBoss();
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
        gameBoxNode.offsetHeight,
        1,
        38,
        38
      )
    );
  }

  for (let i = 0; i < 5; i++) {
    tieArr2.push(
      new Enemigo(
        Math.random() * (gameBoxNode.offsetWidth - 38),
        -38,
        1,
        38,
        38
      )
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
  stopTimer();
  finalScreen()

  //1. remover todos los nodos del juego
  //2. vaciar los arrays y pasar a nulo los objetos de juego
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

  let disparoX = playerCenterX - 1;
  let disparoY = playerCenterY - 1;

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
  const disparosAQuitar = []; // Lista de índices de disparos a eliminar

  disparoArr.forEach((disparo, disparoIndice) => {
    // Iteramos sobre cada disparo y comprobamos colisión con los enemigos en tieArr
    tieArr.forEach((enemigo, enemigoIndice) => {
      if (
        disparo.x < enemigo.x + enemigo.w &&
        disparo.x + disparo.w > enemigo.x &&
        disparo.y < enemigo.y + enemigo.h &&
        disparo.y + disparo.h > enemigo.y
      ) {
        console.log("Enemy damaged!!!!");
        enemigo.vida -= disparo.damage; // Reduce la vida del enemigo según el daño del disparo

        // Si la vida del enemigo es menor o igual a 0, eliminar el nodo del enemigo
        if (enemigo.vida <= 0) {
          enemigo.node.remove();
          tieArr.splice(enemigoIndice, 1);
        }

        disparo.node.remove(); // Elimina el nodo del disparo
        disparosAQuitar.push(disparoIndice);
      }
    });

    // Comprobamos colisión con los enemigos en tieArr2
    tieArr2.forEach((enemigo, enemigoIndice) => {
      if (
        disparo.x < enemigo.x + enemigo.w &&
        disparo.x + disparo.w > enemigo.x &&
        disparo.y < enemigo.y + enemigo.h &&
        disparo.y + disparo.h > enemigo.y
      ) {
        console.log("Enemy damaged!!!");
        enemigo.vida -= disparo.damage; // Reduce la vida del enemigo según el daño del disparo

        // Si la vida del enemigo es menor o igual a 0, elimina el nodo del enemigo
        if (enemigo.vida <= 0) {
          enemigo.node.remove();
          tieArr2.splice(enemigoIndice, 1);
        }

        disparo.node.remove(); // Elimina el nodo del disparo
        disparosAQuitar.push(disparoIndice);
      }
    });
  });

  // Eliminar disparos en orden inverso para evitar problemas con el índice
  disparosAQuitar.reverse().forEach((index) => {
    disparoArr.splice(index, 1);
  });
};
const newMiniBoss = () => {
  //Creamos un setpoint(00.05) y aseguramos que no se ha creado
  if (segundos === 5 && !miniBossCreated) {
    let destructor = new Enemigo(
      gameBoxNode.offsetWidth / 2,
      -60,
      10,
      150,
      150
    );
    destructor.node.src = "/images/destructor.png";
    tieArr2.push(destructor);
    miniBossCreated = true; //Le damos true para que no vuelva a crearse
    console.log("Ay mi madre el bixooooo");
  }
};
const startTimer = () => {
  timerInterval = setInterval(updateTimer, 1000);
  // Llama la funcion updateTimer cada segundo y almacena dicho intervalo
};
const stopTimer = () => {
  clearInterval(timerInterval);
};
const updateTimer = () => {
  segundos++; //sumamos 1 cada vez que es llamada la funcion
  if (segundos === 60) {
    minutos++;
    segundos = 0;
  }
  if (minutos === 2) {
    gameOver();
  }
  // Dice: Si minutos es menor que 10, añadimos 0 a minutos(04:00), si no, string vacio + minutos(14:00)
  timerNode.innerText = `${minutos < 10 ? "0" : ""}${minutos}:${
    segundos < 10 ? "0" : ""
  }${segundos}`;
};
const finalScreen = () => {
  document.querySelector("body").style.backgroundColor = "#4B0706"
  timerNode.style.display = "none"
  finalScreenNode.style.display = "block";
  let posicion = -800
  let interval = setInterval(() => {
    if (posicion >= 0){
      clearInterval(interval)
    } else {
      posicion += 5;
      finalScreenNode.style.top = posicion +"px"
    }
  }, 20);
  setTimeout(() => {
    document.querySelector("#titulo1").innerText = "GAME"
    document.querySelector("#titulo2").innerText = "OVER"
  }, 1000);

}

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
