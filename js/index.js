/**
 * @fileoverview Combat system for tabletop RPG with hit rolls, damage calculation, and exploding dice mechanics
 * @author Jaume Vidal
 * @version 0.0.1
 */

/** @constant {boolean} DEBUGMODE - Flag to enable/disable debug logging */
const DEBUGMODE = false;

/** @type {boolean} EXPLODING_DICE_MODE - Global flag controlling whether dice continue exploding on consecutive 10s */
let EXPLODING_DICE_MODE = true;

/**
 * Performs a hit roll calculation including modifier, distance checks, hit location, and weapon damage
 * Updates the UI with results and triggers related functions
 * @function hitRoll
 * @returns {void}
 */
function hitRoll() {
  let modifier = Number.parseInt(document.querySelector("#inHitMod").value);
  let dice = d10Roll();
  modifier = isNaN(modifier) ? 0 : modifier;
  const resultsTextArea = document.querySelector("#txtResults");
  let total = dice.value + modifier;

  // Update results display with roll information
  resultsTextArea.value =
    `..............................\n` + resultsTextArea.value;
  resultsTextArea.value = `crit: ${dice.isCrit}\n` + resultsTextArea.value;
  resultsTextArea.value =
    `crit explosions: ${dice.timesCrit}\n` + resultsTextArea.value;
  resultsTextArea.value =
    `total: ${dice.value} + ${modifier} = ${total}\n` + resultsTextArea.value;

  // Execute subsequent combat calculations
  resetChecks();
  updateDistanceChecks(total);
  resetHitLocation();
  hitLocation();
  rollWeaponDamage();

  if (DEBUGMODE) {
    console.log("hit roll");
    console.log(`dice: ${dice.value}`);
    console.log(`crit: ${dice.isCrit}`);
    console.log(`crit explosions: ${dice.timesCrit}`);
    console.log(`mod: ${modifier}`);
    console.log(`total: ${total}`);
  }
}

/**
 * Resets all distance check elements to their default 'miss' state
 * @function resetChecks
 * @returns {void}
 */
function resetChecks() {
  document
    .querySelector("#distanceCheck-contact")
    .classList.replace("distanceCheckHit", "distanceCheckMiss");
  document
    .querySelector("#distanceCheck-close")
    .classList.replace("distanceCheckHit", "distanceCheckMiss");
  document
    .querySelector("#distanceCheck-mid")
    .classList.replace("distanceCheckHit", "distanceCheckMiss");
  document
    .querySelector("#distanceCheck-far")
    .classList.replace("distanceCheckHit", "distanceCheckMiss");
  document
    .querySelector("#distanceCheck-extrafar")
    .classList.replace("distanceCheckHit", "distanceCheckMiss");
}

/**
 * Updates distance check visual indicators based on hit roll total
 * Different distance thresholds are checked and corresponding UI elements are updated
 * @function updateDistanceChecks
 * @param {number} value - The total hit roll value to check against distance thresholds
 * @returns {void}
 */
function updateDistanceChecks(value) {
  if (value >= 10) {
    document
      .querySelector("#distanceCheck-contact")
      .classList.replace("distanceCheckMiss", "distanceCheckHit");
  }
  if (value >= 15) {
    document
      .querySelector("#distanceCheck-close")
      .classList.replace("distanceCheckMiss", "distanceCheckHit");
  }
  if (value >= 20) {
    document
      .querySelector("#distanceCheck-mid")
      .classList.replace("distanceCheckMiss", "distanceCheckHit");
  }
  if (value >= 25) {
    document
      .querySelector("#distanceCheck-far")
      .classList.replace("distanceCheckMiss", "distanceCheckHit");
  }
  if (value >= 30) {
    document
      .querySelector("#distanceCheck-extrafar")
      .classList.replace("distanceCheckMiss", "distanceCheckHit");
  }
}

/**
 * Determines hit location on target body using random roll (1-10)
 * Updates UI container with appropriate hit location class and results text
 * Hit locations: 1=head, 2-4=torso, 5=left arm, 6=right arm, 7-8=left leg, 9-10=right leg
 * @function hitLocation
 * @returns {void}
 */
function hitLocation() {
  const location = randomIntFromInterval(1, 10);
  const container = document.querySelector("#rightContainer");
  const resultsTextArea = document.querySelector("#txtResults");

  if (location == 1) {
    container.classList.replace("no-hit", "head-hit");
    resultsTextArea.value = `location: head\n` + resultsTextArea.value;
  }
  if (location >= 2 && location <= 4) {
    container.classList.replace("no-hit", "torso-hit");
    resultsTextArea.value = `location: torso\n` + resultsTextArea.value;
  }
  if (location == 5) {
    container.classList.replace("no-hit", "left-arm-hit");
    resultsTextArea.value = `location: left arm\n` + resultsTextArea.value;
  }
  if (location == 6) {
    container.classList.replace("no-hit", "right-arm-hit");
    resultsTextArea.value = `location: right arm\n` + resultsTextArea.value;
  }
  if (location >= 7 && location <= 8) {
    container.classList.replace("no-hit", "left-leg-hit");
    resultsTextArea.value = `location: left leg\n` + resultsTextArea.value;
  }
  if (location >= 9 && location <= 10) {
    container.classList.replace("no-hit", "right-leg-hit");
    resultsTextArea.value = `location: right leg\n` + resultsTextArea.value;
  }

  if (DEBUGMODE) {
    console.log(`loc: ${location}`);
  }
}

/**
 * Resets the hit location container to its default 'no-hit' state
 * Removes all existing classes and adds the base 'no-hit' class
 * @function resetHitLocation
 * @returns {void}
 */
function resetHitLocation() {
  const container = document.querySelector("#rightContainer");
  container.classList.remove(...container.classList);
  container.classList.add("no-hit");
}

/**
 * Simulates rolling a d10 with exploding dice mechanics
 * If a 10 is rolled, it's considered a critical hit and the die is rolled again
 * Based on EXPLODING_DICE_MODE, continues exploding until non-10 or stops after first explosion
 * @function d10Roll
 * @returns {Object} Roll result object
 * @returns {number} returns.value - The accumulated total value from all rolls
 * @returns {boolean} returns.isCrit - Whether any 10s were rolled (critical hit)
 * @returns {number} returns.timesCrit - Number of times a 10 was rolled consecutively
 * @example
 * // Rolling 10, then 10, then 4 would return:
 * {
 *   value: 24,
 *   isCrit: true,
 *   timesCrit: 2
 * }
 */
function d10Roll() {
  const result = {
    value: 0,
    isCrit: false,
    timesCrit: 0,
  };

  roll = randomIntFromInterval(1, 10);
  result.value += roll;

  while (roll === 10) {
    result.isCrit = true;
    result.timesCrit += 1;
    roll = randomIntFromInterval(1, 10);
    result.value += roll;
    if (!EXPLODING_DICE_MODE) break;
  }

  return result;
}

/**
 * Generates a random integer between min and max (inclusive)
 * @function randomIntFromInterval
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer between min and max
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Updates distance check labels based on selected weapon type
 * Each weapon has specific distance ranges that affect hit difficulty
 * @function weaponChange
 * @returns {void}
 */
function weaponChange() {
  const weaponName = document.querySelector("#selWeaponType").value;
  const checkContact = document.querySelector("#distanceCheck-contact");
  const checkClose = document.querySelector("#distanceCheck-close");
  const checkMid = document.querySelector("#distanceCheck-mid");
  const checkFar = document.querySelector("#distanceCheck-far");
  const checkExtraFar = document.querySelector("#distanceCheck-extrafar");

  /** @type {Object<string, number|null>} Weapon base distances in meters */
  const weaponDistances = {
    pistol: 50,
    lightSMG: 150,
    mediumSMG: 200,
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
    checkExtraFar.textContent = `Extra Far (${
      2 * weaponDistances[weaponName]
    }m)`;
  } else {
    checkClose.textContent = `Close (1/4 weapon distance)`;
    checkMid.textContent = `Mid (1/2 weapon distance)`;
    checkFar.textContent = `Far (weapon distance)`;
    checkExtraFar.textContent = `Extra Far (2x weapon distance)`;
  }
}

/**
 * Parses and calculates weapon damage using dice notation (e.g., "2d6+3")
 * Supports standard RPG dice notation: [number]d[sides][+/-modifier]
 * @function rollWeaponDamage
 * @returns {void}
 */
function rollWeaponDamage() {
  const weaponDamage = document.querySelector("#inDmg").value;
  const resultsTextArea = document.querySelector("#txtResults");

  const parsed = weaponDamage.match("^([0-9]+)[d|D]([0-9]+)([+-][0-9]+)?$");

  if (parsed) {
    let dmg = 0;
    // Roll each die and sum results
    for (let i = 0; i < parsed[1]; i += 1)
      dmg += randomIntFromInterval(1, parsed[2]);
    // Apply modifier if present
    if (parsed[3]) {
      dmg += Number.parseInt(parsed[3]);
    }
    resultsTextArea.value = `damage: ${dmg}\n` + resultsTextArea.value;
  } else {
    resultsTextArea.value =
      `damage: -invalid formula-\n` +
      `Formula should be: [ integer : number of dices ][ d | D ][ integer : number of sides of the dice ][ + | - ][ integer: modifier]\n` +
      `Ex: 4d6+5 or 2d8 or 1d12-3\n` +
      resultsTextArea.value;
  }

  if (DEBUGMODE) {
    console.log(parsed);
  }
}

/**
 * Clears all text from the results textarea
 * @function clearResults
 * @returns {void}
 */
function clearResults() {
  document.querySelector("#txtResults").value = "";
}

/**
 * Performs statistical testing of the exploding dice system
 * Runs 1 million rolls to calculate crit percentages and explosion statistics
 * Results are logged to console for analysis
 * @function testExplosionDice
 * @returns {void}
 */
function testExplosionDice() {
  test = {
    rolls: 1e6,
    crits: 0,
    multipleExplosion: 0,
    maxExplosion: 0,
  };

  for (let i = 0; i < test.rolls; i += 1) {
    const roll = d10Roll();
    if (roll.isCrit) test.crits += 1;
    if (roll.timesCrit > 1) test.multipleExplosion += 1;
    if (roll.timesCrit > test.maxExplosion) test.maxExplosion = roll.timesCrit;
  }

  console.log(`%Crit: ${(100 * test.crits) / test.rolls}`);
  console.log(
    `%Crit Explosions: ${(100 * test.multipleExplosion) / test.crits}`
  );
  console.log(`Max explosions: ${test.maxExplosion}`);
}

/**
 * Toggles the exploding dice mode on/off and updates the UI button
 * Changes global EXPLODING_DICE_MODE variable and button appearance
 * @function toogleExplodingMode
 * @returns {void}
 */
function toogleExplodingMode() {
  const toogleBtn = document.querySelector("#toogleExplode");
  EXPLODING_DICE_MODE = !EXPLODING_DICE_MODE;
  if (EXPLODING_DICE_MODE) {
    toogleBtn.classList.replace("toogleBtn-Off", "toogleBtn-On");
    toogleBtn.querySelector("p").innerText = "- ENABLED -";
  } else {
    toogleBtn.classList.replace("toogleBtn-On", "toogleBtn-Off");
    toogleBtn.querySelector("p").innerText = "- DISABLED -";
  }
}

/********************************************************/
/*********************** MAIN ***************************/
/********************************************************/

/**
 * Event listener for form submission
 * Prevents default form submission and triggers hit roll instead
 */
addEventListener("submit", (e) => {
  e.preventDefault();
  hitRoll();
});

weaponChange();

if (DEBUGMODE) testExplosionDice();
