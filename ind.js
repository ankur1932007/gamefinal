const startButton = document.getElementById("start-button");
const instructions = document.getElementById("instructions-text");
const mainPlayArea = document.getElementById("main-play-area");
const shooter = document.getElementById("player-controlled-shooter");
const circlesImgs = ["target.jpg", "target.jpg", "target.jpg"];
const scoreCounter = document.querySelector("#score span");

let justice;
let circlesInterval;

startButton.addEventListener("click", (event) => {
  playGame();
});

function letFaujiFly(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveUp();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    moveDown();
  } else if (event.key === " ") {
    event.preventDefault();
    firebullet();
  }
}

function moveUp() {
  let topPosition = window.getComputedStyle(shooter).getPropertyValue("top");
  if (shooter.style.top === "0px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position -= 4;
    shooter.style.top = `${position}px`;
  }
}

function moveDown() {
  let topPosition = window.getComputedStyle(shooter).getPropertyValue("top");
  if (shooter.style.top === "360px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position += 4;
    shooter.style.top = `${position}px`;
  }
}

function firebullet() {
  let bullet = createbulletElement();
  mainPlayArea.appendChild(bullet);
  let bulletSFX = new Audio("bullet-sfx.mp3");
  bulletSFX.play();
  movebullet(bullet);
}

function createbulletElement() {
  let xPosition = parseInt(
    window.getComputedStyle(shooter).getPropertyValue("left")
  );
  let yPosition = parseInt(
    window.getComputedStyle(shooter).getPropertyValue("top")
  );
  let newbullet = document.createElement("img");
  newbullet.src = "bullet.png";
  newbullet.classList.add("bullet");
  newbullet.style.left = `${xPosition}px`;
  newbullet.style.top = `${yPosition - 10}px`;
  return newbullet;
}

function movebullet(bullet) {
  let bulletInterval = setInterval(() => {
    let xPosition = parseInt(bullet.style.left);
    let circless = document.querySelectorAll(".circles");
    circless.forEach((circles) => {
      if (checkbulletCollision(bullet, circles)) {
        let explosion = new Audio("Explosion.mp3");
        explosion.play();
        circles.src = "explosion.png";
        circles.classList.remove("circles");
        circles.classList.add("dead-circles");
        scoreCounter.innerText = parseInt(scoreCounter.innerText) + 100;
      }
    });
    if (xPosition === 340) {
      bullet.remove();
    } else {
      bullet.style.left = `${xPosition + 4}px`;
    }
  }, 10);
}

function createcircles() {
  let newcircles = document.createElement("img");
  let circlesSpriteImg =
    circlesImgs[Math.floor(Math.random() * circlesImgs.length)];
  newcircles.src = circlesSpriteImg;
  newcircles.classList.add("circles");
  newcircles.classList.add("circles-transition");
  newcircles.style.left = "370px";
  newcircles.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
  mainPlayArea.appendChild(newcircles);
  movecircles(newcircles);
}

function movecircles(circles) {
  let movecirclesInterval = setInterval(() => {
    let xPosition = parseInt(
      window.getComputedStyle(circles).getPropertyValue("left")
    );
    if (xPosition <= 50) {
      if (Array.from(circles.classList).includes("dead-circles")) {
        circles.remove();
      } else {
        gameOver();
      }
    } else {
      circles.style.left = `${xPosition - 4}px`;
    }
  }, 30);
}

function checkbulletCollision(bullet, circles) {
  let bulletLeft = parseInt(bullet.style.left);
  let bulletTop = parseInt(bullet.style.top);
  let bulletBottom = bulletTop - 20;
  let circlesTop = parseInt(circles.style.top);
  let circlesBottom = circlesTop - 30;
  let circlesLeft = parseInt(circles.style.left);
  if (bulletLeft != 340 && bulletLeft + 40 >= circlesLeft) {
    if (bulletTop <= circlesTop && bulletTop >= circlesBottom) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function gameOver() {
  window.removeEventListener("keydown", letFaujiFly);
  justice.pause();
  let gameOverSfx = new Audio("game-over.mp3");
  gameOverSfx.play();
  clearInterval(circlesInterval);
  let circless = document.querySelectorAll(".circles");
  circless.forEach((circles) => circles.remove());
  let bullets = document.querySelectorAll(".bullet");
  bullets.forEach((bullet) => bullet.remove());
  setTimeout(() => {
    alert(
      `Game Over! The circless made it to Base. Your final score is ${scoreCounter.innerText}!`
    );
    shooter.style.top = "180px";
    startButton.style.display = "block";
    instructions.style.display = "block";
    scoreCounter.innerText = 0;
  }, 1100);
}

function playGame() {
  startButton.style.display = "none";
  instructions.style.display = "none";
  window.addEventListener("keydown", letFaujiFly);
  justice = new Audio("");
  justice.play();
  circlesInterval = setInterval(() => {
    createcircles();
  }, 2100);
}
