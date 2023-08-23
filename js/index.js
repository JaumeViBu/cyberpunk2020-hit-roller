const DEBUGMODE = true;

function hitRoll() {

  let modifier = Number.parseInt(document.querySelector('#inHitMod').value);
  const dice = d10Roll();
  modifier = isNaN(modifier) ? 0 : modifier;

  const total = dice + modifier;

  resetChecks();
  updateDistanceChecks(total);
  resetHitLocation();
  hitLocation();

  if (DEBUGMODE) {

    console.log('hit roll');
    console.log(`dice: ${dice}`);
    console.log(`mod: ${modifier}`);
    console.log(`total: ${total}`)
  }
}

function resetChecks() {

  document.querySelector('#distanceCheck-contact').classList.replace('distanceCheckHit', 'distanceCheckMiss');
  document.querySelector('#distanceCheck-close').classList.replace('distanceCheckHit', 'distanceCheckMiss');
  document.querySelector('#distanceCheck-mid').classList.replace('distanceCheckHit', 'distanceCheckMiss');
  document.querySelector('#distanceCheck-far').classList.replace('distanceCheckHit', 'distanceCheckMiss');
  document.querySelector('#distanceCheck-extrafar').classList.replace('distanceCheckHit', 'distanceCheckMiss');
}

function updateDistanceChecks(value) {

  if (value >= 10) {
    document.querySelector('#distanceCheck-contact').classList.replace('distanceCheckMiss', 'distanceCheckHit');
  }
  if (value >= 15) {
    document.querySelector('#distanceCheck-close').classList.replace('distanceCheckMiss', 'distanceCheckHit');
  }
  if (value >= 20) {
    document.querySelector('#distanceCheck-mid').classList.replace('distanceCheckMiss', 'distanceCheckHit');
  }
  if (value >= 25) {
    document.querySelector('#distanceCheck-far').classList.replace('distanceCheckMiss', 'distanceCheckHit');
  }
  if (value >= 30) {
    document.querySelector('#distanceCheck-extrafar').classList.replace('distanceCheckMiss', 'distanceCheckHit');
  }
}

function hitLocation() {

  const location = d10Roll();
  const container = document.querySelector('#rightContainer');



  if (location == 1) {
    container.classList.replace('no-hit', 'head-hit');
  }
  if (location >= 2 && location <= 4) {
    container.classList.replace('no-hit', 'torso-hit');
  }
  if (location == 5) {
    container.classList.replace('no-hit', 'left-arm-hit');
  }
  if (location == 6) {
    container.classList.replace('no-hit', 'right-arm-hit');
  }
  if (location >= 7 && location <= 8) {
    container.classList.replace('no-hit', 'left-leg-hit');
  }
  if (location >= 9 && location <= 10) {
    container.classList.replace('no-hit', 'right-leg-hit');
  }


  if (DEBUGMODE) {
    console.log(`loc: ${location}`)
  }
}

function resetHitLocation() {

  const container = document.querySelector('#rightContainer');
  container.classList.remove(...container.classList);
  container.classList.add('no-hit');
}


/**
 * 1-10
 */
function d10Roll() {

  return randomIntFromInterval(1, 10);
}

/**
 * min and max included
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function randomIntFromInterval(min, max) {

  return Math.floor(Math.random() * (max - min + 1) + min);
}


addEventListener("submit", (e) => {

  e.preventDefault();
  hitRoll();
})

