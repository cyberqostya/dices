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

  cube.style.webkitTransform = "rotateX(" + xResultDeg + "deg) rotateY(" + yResultDeg + "deg)";
  cube.style.transform = "rotateX(" + xResultDeg + "deg) rotateY(" + yResultDeg + "deg)";

  if(luckWillCome) {
    luckCome();
    luckWillCome = false;
  }

  rollButton.setAttribute('disabled', 'true');
  setTimeout(() => {rollButton.removeAttribute('disabled')}, 5800);
// console.log(result, failCounter);
  return result;
}

function checkResults(rollResult) {
  if(rollResult.some(i => i>=5)) {
    failCounter = 0;
  } else {
    failCounter++;
  }

  if(failCounter >= 3) {
    if( Math.random() < (failCounter + 3) * 0.1 ) {
      luckWillCome = true;
      isSuccessfullRoll = true;
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
  }, 2500)
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

    checkResults([rollResult]);
  }
});
// Ролл общий
rollButton.addEventListener("click", () => {
  const rollResults = Array.from(cubesContainer.children)
    .sort((a, b) => (Math.random() > 0.5 ? 1 : -1))
    .map((i) => roll(i.querySelector(".cube")));

  checkResults(rollResults);
});
successButton.addEventListener("click", () => {
  isSuccessfullRoll = true;
});
