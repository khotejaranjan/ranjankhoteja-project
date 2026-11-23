const introductionScreen = document.querySelector(".introductionScreen");
const levelOneScreen = document.querySelector(".levelOneScreen");
const finalScreen = document.querySelector(".finalScreen");
const startBtn = document.querySelector(".startBtn");
const tryAgainBtn = document.querySelector(".tryAgainBtn");
const playAgain = document.querySelector(".playAgain");

const levelOne = new LevelOne();

startBtn.addEventListener("click", () => {
  introductionScreen.style.display = "none";
  levelOneScreen.style.display = "block";
  levelOne.start();
});

tryAgainBtn.addEventListener("click", () => {
  levelOne.start();
});

playAgain.addEventListener("click", () => {
  finalScreen.style.display = "none";
  introductionScreen.style.display = "flex";
});

