import { styles } from './style.js';

// Установка высоты вьюпорта для apple
document.documentElement.style.setProperty(
  "--body-height",
  `${window.innerHeight}px`
);
// Добавление цвета кубикам
const randomStyle = Math.floor(Math.random() * styles.length);
document.body.style.setProperty('--background', styles[randomStyle][0]);
document.body.style.setProperty('--borderdot', styles[randomStyle][1]);



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

let failCounter = 0;
const harp = new Audio('./sounds/harp.mp3');
const fairy = document.querySelector('.fairy');
const rainbow = document.querySelector('.rainbow');

let successCounter = 0;
const laugh = new Audio('./sounds/laugh.mpeg');
const devil = document.querySelector('.devil');
const fire = document.querySelector('.fire');

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
  const maxRotations = 7;
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

  console.log(result, failCounter, successCounter);
  return result;
}

function checkResults(rollResult, cubes) {
  if (rollResult.some(i => i >= 5)) {
    failCounter = 0;
    successCounter++;
  } else {
    failCounter++;
    successCounter = 0;
  }

  if (failCounter >= 4) {
    if (Math.random() < (failCounter + 3) * 0.1) {
      console.log('luck is coming');

      setTimeout(luckCome, 6500);
      setTimeout(() => { reverseCubeByExternalForces(cubes, 'luck') }, 7500);

      failCounter = 0;
    }
  }

  if (successCounter >= 3) {
    if (Math.random() < (successCounter + 3) * 0.1) {
      console.log('devil is coming');

      setTimeout(devilCome, 6500);
      setTimeout(() => { reverseCubeByExternalForces(cubes, 'devil') }, 7500);

      successCounter = 0;
    }
  }
}

// Анимация Феи
function luckCome() {
  harp.play();
  fairy.classList.add('_active');
  rainbow.classList.add('_active');
  setTimeout(() => {
    fairy.classList.remove('_active');
    rainbow.classList.remove('_active');
  }, 3500)
}

// Анимация Дьявола
function devilCome() {
  laugh.play();
  devil.classList.add('_active');
  fire.classList.add('_active');
  setTimeout(() => {
    devil.classList.remove('_active');
    fire.classList.remove('_active');
  }, 2500);
}

// Поповрот до ближайшего переданного значения
function getNearestAngleSuccess(styleTransform, value) {
  const quantityXRotations = Math.round(+styleTransform.match(/-?\d+/g)[0] / 360);
  const quantityYRotations = Math.round(+styleTransform.match(/-?\d+/g)[1] / 360);
  return `rotateX(${resultsCoords[value - 1][0] + 360 * quantityXRotations}deg) rotateY(${resultsCoords[value - 1][1] + 360 * quantityYRotations}deg)`;
}
// Поворот кубов высшими силами
function reverseCubeByExternalForces(cubes, force) {
  const luckCubesQuantity = Math.random() > .7 ? (Math.random() > .8 ? (Math.random() > .9 ? (Math.random() > .95 ? 5 : 4) : 3) : 2) : 1;
  const devilCubesQuantity = Math.random() > .6 ? (Math.random() > .7 ? (Math.random() > .8 ? (Math.random() > .9 ? 5 : 4) : 3) : 2) : 1;

  let cubesQuantity;
  switch (force) {
    case 'luck':
      cubesQuantity = luckCubesQuantity;
      break;
    case 'devil':
      cubesQuantity = devilCubesQuantity;
      break;
  }

  for (let i = 0; (i < cubesQuantity && i < cubes.length); i++) {
    cubes[i].style.transitionDuration = '2000ms';
    
    let value;
    switch (force) {
      case 'luck':
        value = Math.random() > .5 ? 5 : 6;
        break;
      case 'devil':
        value = Math.random() > .5 ? 1 : 2;
        break;
    }

    cubes[i].style.transform = getNearestAngleSuccess(cubes[i].style.transform, value);

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
successButton.addEventListener("click", async () => {
  isSuccessfullRoll = true;
  harp.play();
  await new Promise((res,rej)=>setTimeout(res, 5000));
  laugh.play();
});
infoButton.addEventListener('click', () => {
  infoOverlay.classList.toggle('_active');
});