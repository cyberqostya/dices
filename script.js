// Установка высоты вьюпорта для apple
document.documentElement.style.setProperty(
  "--body-height",
  `${window.innerHeight}px`
);


const cubesContainer = document.querySelector(".cubes");
const cubeHTML = document.querySelector(".container");
const resultsCoords = [
  [0, 0],
  [0, 270],
  [270, 0],
  [90, 0],
  [0, 90],
  [0, 180],
];
const addButton = document.querySelector(".buttons ._add");
const removeButton = document.querySelector(".buttons ._remove");
const rollButton = document.querySelector("._roll");

let isSuccessfullRoll = false;
const successButton = document.querySelector("._success");

let luckWillCome = false;
let failCounter = 0;
const harp = new Audio('./sounds/harp.mp3');
const fairy = document.querySelector('.fairy');
const rainbow = document.querySelector('.rainbow');

// Таймер неактивности интефейса при бросках
let inactivityTimeout;
const incativeCubes = [];

// Инфо
const infoButton = document.querySelector(".info");
const infoOverlay = document.querySelector(".info__overlay");


// Активировать интерфейс
function activeButtons() {
  rollButton.classList.remove('_disabled');
  addButton.classList.remove('_disabled');
  removeButton.classList.remove('_disabled');
  incativeCubes.forEach(i => i.style.pointerEvents = 'all');
}
// Бросок
function roll(cube) {
  const rotationSign = cube.style.transform.includes("-");
  let result = Math.ceil(Math.random() * 6);

  if (isSuccessfullRoll) {
    result = 6;
    isSuccessfullRoll = false;
  }

  const minRotations = 1;
  const maxRotations = 4;
  const xRotations = Math.ceil(Math.random() * (maxRotations - minRotations)) + minRotations;
  const yRotations = Math.ceil(Math.random() * (maxRotations - minRotations)) + minRotations;
  const xResultDeg = resultsCoords[result - 1][0] + 360 * (rotationSign ? xRotations : -xRotations);
  const yResultDeg = resultsCoords[result - 1][1] + 360 * (rotationSign ? yRotations : -yRotations);

  cube.style.transform = "rotateX(" + xResultDeg + "deg) rotateY(" + yResultDeg + "deg)";


  // Повторный таймаут отдельных бросках
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
  // Деактивировать интерфейс
  rollButton.classList.add('_disabled');
  addButton.classList.add('_disabled');
  removeButton.classList.add('_disabled');
  incativeCubes.push(cube);
  cube.style.pointerEvents = 'none';
  inactivityTimeout = setTimeout(activeButtons, 6000);

  // console.log(result, failCounter);
  return result;
}

function checkResults(rollResult, cubes) {
  if (rollResult.some(i => i >= 5)) {
    failCounter = 0;
  } else {
    failCounter++;
  }

  if (failCounter >= 4) {
    if (Math.random() < (failCounter + 3) * 0.1) {
      console.log('luck is coming');

      setTimeout(luckCome, 6500);
      setTimeout(() => { reverseCubeByLuck(cubes) }, 7500);

      failCounter = 0;
    }
  }
}

function luckCome() {
  harp.play();
  fairy.classList.add('_active');
  rainbow.classList.add('_active');
  setTimeout(() => {
    fairy.classList.remove('_active');
    rainbow.classList.remove('_active');
  }, 3500)
}

function getNearestAngleSuccess(styleTransform) {
  quantityXRotations = Math.round(+styleTransform.match(/-?\d+/g)[0] / 360);
  quantityYRotations = Math.round(+styleTransform.match(/-?\d+/g)[1] / 360);
  const successNumber = Math.random() > .5 ? 5 : 6;
  return `rotateX(${resultsCoords[successNumber - 1][0] + 360 * quantityXRotations}deg) rotateY(${resultsCoords[successNumber - 1][1] + 360 * quantityYRotations}deg)`;
}
function reverseCubeByLuck(cubes) {
  const luckCubesQuantity = Math.random() > .7 ? (Math.random() > .8 ? (Math.random() > .9 ? (Math.random() > .95 ? 5 : 4) : 3) : 2) : 1;

  for (let i = 0; (i < luckCubesQuantity && i < cubes.length); i++) {
    cubes[i].style.transitionDuration = '2000ms';
    cubes[i].style.transform = getNearestAngleSuccess(cubes[i].style.transform);

    setTimeout(() => { cubes[i].style.transitionDuration = '6000ms'; }, 2000);
  }
}



// Добавление и удаление кубика
addButton.addEventListener("click", () => {
  cubesContainer.insertAdjacentElement("beforeend", cubeHTML.cloneNode(true));
});
removeButton.addEventListener("click", () => {
  cubesContainer.children[0].remove();
});
// Ролл одного
cubesContainer.addEventListener("click", (e) => {
  if (e.target.closest(".cube")) {
    const rollResult = roll(e.target.closest(".cube"));

    checkResults([rollResult], [e.target.closest(".cube")]);
  }
});
// Ролл общий
rollButton.addEventListener("click", () => {
  const randomSortedCubes = Array.from(cubesContainer.children).sort((a, b) => (Math.random() > 0.5 ? 1 : -1)).map(i => i.querySelector(".cube"));
  const rollResults = randomSortedCubes.map((i) => roll(i));

  checkResults(rollResults, randomSortedCubes);
});
successButton.addEventListener("click", () => {
  isSuccessfullRoll = true;
});
infoButton.addEventListener('click', () => {
  infoOverlay.classList.toggle('_active');
});