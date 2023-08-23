const DEBUGMODE = false;

function hitRoll() {

  let modifier = Number.parseInt(document.querySelector('#inHitMod').value);
  let dice = d10Roll();
  modifier = isNaN(modifier) ? 0 : modifier;
  const resultsTextArea = document.querySelector('#txtResults');
  let total = dice + modifier;

  resultsTextArea.value = `..............................\n` + resultsTextArea.value;
  resultsTextArea.value = `total: ${dice} + ${modifier} = ${total}\n` + resultsTextArea.value;

  resetChecks();
  updateDistanceChecks(total);
  resetHitLocation();
  hitLocation();
  rollWeaponDamage();

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
  const resultsTextArea = document.querySelector('#txtResults');


  if (location == 1) {
    container.classList.replace('no-hit', 'head-hit');
    resultsTextArea.value = `location: head\n` + resultsTextArea.value;
  }
  if (location >= 2 && location <= 4) {
    container.classList.replace('no-hit', 'torso-hit');
    resultsTextArea.value = `location: torso\n` + resultsTextArea.value;
  }
  if (location == 5) {
    container.classList.replace('no-hit', 'left-arm-hit');
    resultsTextArea.value = `location: left arm\n` + resultsTextArea.value;
  }
  if (location == 6) {
    container.classList.replace('no-hit', 'right-arm-hit');
    resultsTextArea.value = `location: right arm\n` + resultsTextArea.value;
  }
  if (location >= 7 && location <= 8) {
    container.classList.replace('no-hit', 'left-leg-hit');
    resultsTextArea.value = `location: left leg\n` + resultsTextArea.value;
  }
  if (location >= 9 && location <= 10) {
    container.classList.replace('no-hit', 'right-leg-hit');
    resultsTextArea.value = `location: right leg\n` + resultsTextArea.value;
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

function weaponChange() {


  const weaponName = document.querySelector('#selWeaponType').value;
  const checkContact = document.querySelector('#distanceCheck-contact');
  const checkClose = document.querySelector('#distanceCheck-close');
  const checkMid = document.querySelector('#distanceCheck-mid');
  const checkFar = document.querySelector('#distanceCheck-far');
  const checkExtraFar = document.querySelector('#distanceCheck-extrafar');

  const weaponDistances = {
    pistol: 50,
    submachine: 150,
    shotgun: 50,
    rifle: 400,
    heavy: null,
    exotic: null,
  };

  checkContact.textContent = `Contact (<=1m)`;
  if (weaponDistances[weaponName]) {

    checkClose.textContent = `Close (${0.25 * weaponDistances[weaponName]}m)`;
    checkMid.textContent = `Mid (${0.5 * weaponDistances[weaponName]}m)`;
    checkFar.textContent = `Far (${weaponDistances[weaponName]}m)`;
    checkExtraFar.textContent = `Extra Far (${2 * weaponDistances[weaponName]}m)`;
  } else {

    checkClose.textContent = `Close (1/4 weapon distance)`;
    checkMid.textContent = `Mid (1/2 weapon distance)`;
    checkFar.textContent = `Far (weapon distance)`;
    checkExtraFar.textContent = `Extra Far (2x weapon distance)`;
  }

}

function rollWeaponDamage() {

  const weaponDamage = document.querySelector('#inDmg').value;
  const resultsTextArea = document.querySelector('#txtResults');

  const parsed = weaponDamage.match('^([0-9]+)[d]([0-9]+)([+-][0-9]+)?$');

  if (parsed) {

    let dmg = 0;
    for (let i = 0; i < parsed[1]; i += 1)dmg += randomIntFromInterval(1, parsed[2]);
    if (parsed[3]) {
      dmg += Number.parseInt(parsed[3]);
    }
    resultsTextArea.value = `damage: ${dmg}\n` + resultsTextArea.value;
  } else {

    resultsTextArea.value = `damage: -invalid formula-\n` + resultsTextArea.value;
  }

  if (DEBUGMODE) {

    console.log(parsed)
  }
}

function clearResults() {

  document.querySelector('#txtResults').value = '';
}


addEventListener("submit", (e) => {

  e.preventDefault();
  hitRoll();
})

weaponChange();
