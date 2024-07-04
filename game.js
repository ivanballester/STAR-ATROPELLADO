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
  backgroundMusic.play();
});

const restartBtn = document.querySelector("#restart-btn");
restartBtn.addEventListener("click", () => {
  finalScreenNode.style.display = "none";
  document.querySelector("#titulo1").innerText = "STAR";
  document.querySelector("#titulo2").innerText = "ATROPELLAO'";
  document.querySelector("#titulo1").style.color = "white";
  document.querySelector("#titulo2").style.color = "white";
  document.querySelector("body").style.backgroundImage =
    "url(./images/fondo2.jpg)";
  player = null;
  startBtnNode.style.display = "flex";
  restartBtn.style.display = "none";
  timerNode.style.display = "flex";
  gameoverSound.pause()
  gameoverSound.currentTime = 0;
  backgroundMusic.play()
});

//GAME BOX
const gameBoxNode = document.querySelector("#game-box");

//AUDIOS
const backgroundMusic = new Audio ("./sounds/gamesound.mp3")
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1
backgroundMusic.currentTime = 0;
const gameoverSound = new Audio ("./sounds/gameover.mp3");
gameoverSound.loop = true;
gameoverSound.volume = 0.1
gameoverSound.currentTime = 0;


//VARIABLES
const keysPressed = new Set(); // Set almacena teclas activas y no dando lugar a una repeticion de las mismas
let timerInterval = null;
let minutos = 0;
let segundos = 0;
let mainInterval = null;
let player = null;
let tieInterval = null;
let laserInterval = null;
let destructor1 = null;
let destructor2 = null;
let vadertie1 = null;
let vadertie2 = null;
let vadertie3 = null;
let vadertie4 = null;
let finalBoss = null;
let isFinalBossCreated = false;
let finalBossSpeed = 5;
let isDestructorCreated = false;
let isVadertieCreated = false;
let tieArr = [];
let tieArr2 = [];
let disparoArr = [];
let attackRate = 300; // Limpiar intervalo, acto seguido inicar uno nuevo
let attackSpeed = 10;
let playerMoveSpeed = 20




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
  }, attackRate);
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
  finalBossF()
  bosssoundtrack()
};
const movePlayer = () => {
  //".has" comprueba si existe en el Set
  if (keysPressed.has("d")) {
    player.node.src = "./images/wingXD.png";
    player.orientacion = "derecha";
    player.x += playerMoveSpeed;
  }
  if (keysPressed.has("a")) {
    player.node.src = "./images/wingXI.png";
    player.orientacion = "izquierda";
    player.x -= playerMoveSpeed;
  }
  if (keysPressed.has("s")) {
    player.node.src = "./images/wingXA.png";
    player.orientacion = "abajo";
    player.y += playerMoveSpeed;
  }
  if (keysPressed.has("w")) {
    player.node.src = "./images/wingX.png";
    player.orientacion = "arriba";
    player.y -= playerMoveSpeed;
  }

  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.node.offsetWidth > gameBoxNode.offsetWidth) {
    player.x = gameBoxNode.offsetWidth - player.node.offsetWidth;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.y + player.node.offsetHeight > gameBoxNode.offsetHeight) {
    player.y = gameBoxNode.offsetHeight - player.node.offsetHeight;
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
  if (isFinalBossCreated){
    finalBoss.bossMovement()
  }
};
const tieSpawn = () => {
  for (let i = 0; i < 5; i++) {
    tieArr.push(
      new Enemigo(
        Math.random() * (gameBoxNode.offsetWidth - 38),
        gameBoxNode.offsetHeight,
        1,
        38,
        38,
        1
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
        38,
        1
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
  finalScreen();
  finalClear();
  backgroundMusic.pause()
  backgroundMusic.currentTime = 0;
  gameoverSound.play();
  new Audio ("./sounds/boss.mp3").pause()
  new Audio ("./sounds/boss.mp3"). currentTime = 0;
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
  bossPlayerCollision()
};
const disparoSpawn = () => {
  let playerCenterX = player.x + player.node.offsetWidth / 2;
  let playerCenterY = player.y + player.node.offsetHeight / 2;

  let disparoX = playerCenterX - 1;
  let disparoY = playerCenterY - 1;

  let disparo = new Disparo(disparoX, disparoY, player.orientacion, attackSpeed);
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
        //console.log("Enemy damaged!!!!");
        enemigo.vida -= disparo.damage; // Reduce la vida del enemigo según el daño del disparo

        // Si la vida del enemigo es menor o igual a 0, eliminar el nodo del enemigo
        if (enemigo.vida <= 0) {
          enemigo.node.remove();
          tieArr.splice(enemigoIndice, 1);
          if (enemigo === vadertie3 || enemigo === vadertie4){
            attackSpeed += 20
            playerMoveSpeed += 2
          }
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
       // console.log("Enemy damaged!!!");
        enemigo.vida -= disparo.damage; // Reduce la vida del enemigo según el daño del disparo

        // Si la vida del enemigo es menor o igual a 0, elimina el nodo del enemigo
        if (enemigo.vida <= 0) {
          enemigo.node.remove();
          tieArr2.splice(enemigoIndice, 1);
          if (enemigo === destructor1 || enemigo === destructor2) {
            attackRate -= 60; // Aumentar velocidad (disminuir intervalo)
            playerMoveSpeed += 2
            clearInterval(laserInterval);
            laserInterval = setInterval(() => {
              disparoSpawn();
            }, attackRate);
            console.log("Attack speed increased!");
          }
          
          if (enemigo === vadertie1 || enemigo === vadertie2){
            attackSpeed += 20
            playerMoveSpeed += 2
          }
        }

        disparo.node.remove(); // Elimina el nodo del disparo
        disparosAQuitar.push(disparoIndice);
      }
    });
     //Comprobamos colision con el finalBoss
     if (isFinalBossCreated && finalBoss){
     if (
      disparo.x < finalBoss.x + finalBoss.w &&
      disparo.x + disparo.w > finalBoss.x &&
      disparo.y < finalBoss.y + finalBoss.h &&
      disparo.y + disparo.h > finalBoss.y
    ) {
      finalBoss.vida -= disparo.damage;
      disparo.node.remove();
      disparoArr.splice(index, 1);

      // Si la vida del boss llega a cero o menos, muere
      if (finalBoss.vida <= 0) {
        finalBoss.node.remove();
        isFinalBossCreated = false; // Reiniciar bandera de creación del boss
      }
    }}
  });

   

  // Eliminar disparos en orden inverso para evitar problemas con el índice
  disparosAQuitar.reverse().forEach((index) => {
    disparoArr.splice(index, 1);
  });
};
const newMiniBoss = () => {
  //MINIBOSS NUMBER 1
  if ((segundos === 5 || timerNode.innerText ==="01:05") && !isDestructorCreated) {
    const tercioI = gameBoxNode.offsetWidth / 3;
    const randomX1 = Math.random() * tercioI;

    destructor1 = new Enemigo(
      randomX1, // Posición en el tercio izquierdo del gameBox
      -60,
      10,
      150,
      150,
      0.5
    );
    destructor1.node.src = "./images/destructor.png";

    const tercioD = (gameBoxNode.offsetWidth / 3) * 2;
    const randomX2 = tercioD + Math.random() * tercioI;

    destructor2 = new Enemigo(
      randomX2, // Posición en el tercio derecho del gameBox
      -60,
      10,
      150,
      150,
      0.5
    );
    destructor2.node.src = "./images/destructor.png";

    tieArr2.push(destructor1, destructor2);
    isDestructorCreated = true; // Le damos true para que no vuelva a crearse
    //console.log("Ay mi madre el bichooooooooooo");
    //Reset del  booleano
    setTimeout(() => {
      isDestructorCreated = false;
    }, 1000);
  }

// MINIBOSS NUMBER 2 from top
  if ((segundos === 25|| timerNode.innerText ==="01:25") && !isVadertieCreated) {
    new Audio ("./sounds/vadertie12.mp3").play()
    new Audio ("./sounds/vadertie12.mp3").volume = 0.5
    const tercioI = gameBoxNode.offsetWidth / 3;
    const randomX1 = Math.random() * tercioI;

    vadertie1 = new Enemigo(
      randomX1, // Posición en el tercio izquierdo del gameBox
      -60,
      5,
      100,
      100,
      2
    );
    vadertie1.node.src = "./images/vadertie.png";

    const tercioD = (gameBoxNode.offsetWidth / 3) * 2;
    const randomX2 = tercioD + Math.random() * tercioI;

    vadertie2 = new Enemigo(
      randomX2, // Posición en el tercio derecho del gameBox
      -60,
      5,
      100,
      100,
      2
    );
    vadertie2.node.src = "./images/vadertie.png";

    tieArr2.push(vadertie1, vadertie2);

    isVadertieCreated = true; // Le damos true para que no vuelva a crearse
    //console.log("Ay mi madre el bichooooooooooo");
    //Reset del  booleano
    setTimeout(() => {
      isVadertieCreated = false;
    }, 1000);
  }

  //MINIBOSS 2 from bot

  if ((segundos === 35 || timerNode.innerText ==="01:35") && !isVadertieCreated) {
    new Audio ("./sounds/vadertie34.mp3").play()
    new Audio ("./sounds/vadertie34.mp3").volume = 0.5
    const tercioI = gameBoxNode.offsetWidth / 3;
    const randomX1 = Math.random() * tercioI;

    vadertie3 = new Enemigo(
      randomX1, // Posición en el tercio izquierdo del gameBox
      gameBoxNode.offsetHeight,
      5,
      100,
      100,
      2
    );
    vadertie3.node.src = "./images/vadertie.png";

    const tercioD = (gameBoxNode.offsetWidth / 3) * 2;
    const randomX2 = tercioD + Math.random() * tercioI;

    vadertie4 = new Enemigo(
      randomX2, // Posición en el tercio derecho del gameBox
      gameBoxNode.offsetHeight,
      5,
      100,
      100,
      2
    );
    vadertie4.node.src = "./images/vadertie.png";
    
    tieArr.push(vadertie3, vadertie4);

    isVadertieCreated = true; // Le damos true para que no vuelva a crearse
    //console.log("Ay mi madre el bichooooooooooo");
    //Reset del  booleano
    setTimeout(() => {
      isVadertieCreated = false;
    }, 1000);
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
  document.querySelector("body").style.backgroundColor = "#000000";
  document.querySelector("body").style.backgroundImage = "none";
  restartBtn.style.display = "flex";
  timerNode.style.display = "none";
  finalScreenNode.style.display = "block";
  let posicion = -800;
  let interval = setInterval(() => {
    if (posicion >= 0) {
      clearInterval(interval);
    } else {
      posicion += 10;
      finalScreenNode.style.top = posicion + "px";
    }
  }, 20);
  document.querySelector("#titulo1").innerText = "GAME";
  document.querySelector("#titulo2").innerText = "OVER";
  document.querySelector("#titulo1").style.color = "red";
  document.querySelector("#titulo2").style.color = "red";
};
const finalClear = () => {
  tieArr.forEach((tie) => tie.node.remove());
  tieArr2.forEach((tie) => tie.node.remove());
  disparoArr.forEach((disparo) => disparo.node.remove());
  player.node.remove();
  if (isDestructorCreated){destructor1.node.remove();
  destructor2.node.remove();}
  if (isVadertieCreated) {
  vadertie1.node.remove()
  vadertie2.node.remove()
  vadertie3.node.remove()
  vadertie4.node.remove()}
  if (isFinalBossCreated){finalBoss.node.remove()}  
  tieArr = [];
  tieArr2 = [];
  disparoArr = [];
  destructor1 = null;
  destructor2 = null;
  vadertie1 = null;
  vadertie2 = null;
  vadertie3 = null;
  vadertie4 = null;
  finalBoss = null;
  isDestructorCreated = false;
  isFinalBossCreated = false;
  minutos = 0;
  segundos = 0;
  timerNode.innerText = "00:00";
  playerMoveSpeed = 20;
};
const finalBossF = () =>{
  if (timerNode.innerText === "01:10" && !isFinalBossCreated) {
    const randomX = Math.random() * (gameBoxNode.offsetWidth - 100);
    const randomY = Math.random() * (gameBoxNode.offsetHeight - 100);

    finalBoss = new Enemigo (randomX, randomY, 20, 115, 115, finalBossSpeed, finalBossSpeed, finalBossSpeed);
    finalBoss.node.src = "./images/finalBoss.png";
    isFinalBossCreated = true;
    
  }
}
const bossPlayerCollision = () =>{
  if (isFinalBossCreated) {
    if (
      finalBoss.x < player.x + player.w &&
      finalBoss.x + finalBoss.w > player.x &&
      finalBoss.y < player.y + player.h &&
      finalBoss.y + finalBoss.h > player.y
    ) {
      gameOver();
    }
  }
}

  if (segundos === 10){
    backgroundMusic.pause()
    new Audio ("./sounds/boss.mp3").play()
    new Audio ("./sounds/boss.mp3").volume = 0.5
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
