'use strict';

//GLOBAL VARIABLES
var playerArray = [];
var weaponArray = ['rock', 'paper', 'scissors'];

//DOM MANIPULATING VARS
var nameForm = document.getElementById('name-form');
var nameScreen = document.getElementById('name-screen');
var roundsScreen = document.getElementById('rounds-screen');
var gameScreen = document.getElementById('main-game-screen');
var animationScreen = document.getElementById('animation-screen');
var victoryScreen = document.getElementById('victory-screen');
var roundsButton = document.getElementById('roundsform');
var weaponButtonOne = document.getElementById('weaponButtonOne');
var weaponButtonTwo = document.getElementById('weaponButtonTwo');
var weaponButtonThree = document.getElementById('weaponButtonThree');
var nextRoundPlayAgainButton = document.getElementById('next-round-button');


//EVENT LISTENERS
nameForm.addEventListener('submit', displayRounds);
nameForm.addEventListener('submit', checkUserData);
// 1
roundsButton.addEventListener('submit', displayGameScreen);
weaponButtonOne.addEventListener('click', fight);
weaponButtonTwo.addEventListener('click', fight);
weaponButtonThree.addEventListener('click', fight);
nextRoundPlayAgainButton.addEventListener('click', handleNextRound);

//PLAYER OBJECT
var playerObject = {};

//PLAYER CONSTRUCTOR
function Player (playerName) {
  this.playerName = playerName;
  this.roundsChosen = 0;
  this.roundsWon = 0;
  this.roundsLost = 0;
  this.bestOf3Wins = 0;
  this.bestOf5Wins = 0;
  this.bestOf7Wins = 0;
  this.totalGamesPlayed = 0;
  this.totalGamesWon = 0;
  this.settings = [];
}

// =================================================== //
// vv ====== NAME SCREEN ====== vv //

//FUNCTION TO CHECK FOR USER DATA
function checkUserData(event) {
  event.preventDefault();
  var userNameInput = event.target.nameInput.value;
  playerObject = new Player(userNameInput);
  // console.log('player object is ',playerObject);

  if (localStorage.getItem('playerArray')) {
    var getArray = JSON.parse(localStorage.getItem('playerArray'));
    playerArray = getArray;
    for (var i = 0; i < playerArray.length; i++) {
      if (userNameInput === playerArray[i].playerName) {
        playerObject === playerArray[i];
      }
    }
  }
  // console.log('player object is ',playerObject);
}

//FUNCTION TO DISPLAY ROUNDS
function displayRounds(event) {
  event.preventDefault();
  hide(nameScreen);
  show(roundsScreen);
}

// ^^ ====== NAME SCREEN ====== ^^  //
// =================================================== //


// =================================================== //
// vv ====== ROUNDS SCREEN ====== vv //

//FUNCTION TO POPULATE ROUND VALUE, ADD TO PLAYER OBJECT FOR ROUNDEND CHECKS
function roundCounter (roundsChosen) {
  playerObject.roundsChosen = roundsChosen;

  switch (roundsChosen) {
  case 3:
    playerObject.roundsWon = 2;
    playerObject.roundsLost = 2;
    break;
  case 5:
    playerObject.roundsWon = 3;
    playerObject.roundsLost = 3;
    break;
  case 7:
    playerObject.roundsWon = 4;
    playerObject.roundsLost = 4;
    break;
  }
}

// STORES PLAYER DATA INTO LOCAL STORAGE
function storePlayerInitial() {
  // add array.splice to update playerObject in playerArray
  console.log('playerArray before storage: ', playerArray.length);

  var found = true;
  for (var i = 0; i < playerArray.length; i++) {
    if (playerArray[i].playerName === playerObject.playerName) {
      found = false;
      // console.log('Inside loop for player array length');
      break;
    }
  }

  // this part should only fire if player input name does NOT already exist in storage
  if (found) {
    playerArray.push(playerObject);
    console.log('object pushed to array');
  }

  localStorage.setItem('playerArray', JSON.stringify(playerArray));
  console.log('playerArray after storage: ', playerArray);
}

function storePlayerPostMatch() {
  localStorage.setItem('playerArray', JSON.stringify(playerArray));
}

//FUNCTION TO DISPLAY GAME SCREEN
//fires on NEXT BUTTON on ROUNDS screen
function displayGameScreen(event) {
  // console.log('You chose rounds and hit next');
  // console.log('playerArray Data inside display game screen before hide', playerArray);

  event.preventDefault();
  hide(roundsScreen);
  show(gameScreen);
  var roundsChosen = parseInt(event.target.roundValue.value);
  // console.log('playerArray Data inside display game screen before rounds', playerArray);

  roundCounter(roundsChosen);
  // console.log('playerObject: ', playerObject);
  // console.log('playerArray Data inside display game screen', playerArray);
  storePlayerInitial();
}

// ^^ ====== ROUNDS SCREEN ====== ^^ //
// =================================================== //




// =================================================== //
// vv ====== GAME SCREEN ====== vv //

function fight(event){
  event.preventDefault();
  var cpuWeapon = 'rock'; // cpuChoice();
  var userWeapon = event.target.value;
  console.log('userWeapon :' ,userWeapon);
  console.log('cpuWeapon :' , cpuWeapon);
  hide(gameScreen);
  show(animationScreen);
  var winner = compareWeapons(cpuWeapon, userWeapon);
  declareWinner(userWeapon, cpuWeapon, winner);
  draw(userWeapon, cpuWeapon);
  if (playerObject.roundsWon === 0 || playerObject.roundsLost === 0) {
    incrementWinsData();
    storePlayerPostMatch();
    nextRoundPlayAgainButton.textContent = 'Play Again';
  }
  window.setTimeout(displayVictoryScreen, 2000);
  console.log('winner: ', winner);
}

var testVictory = document.getElementById('test-victory');

function declareWinner (userWeapon, cpuWeapon, winner) {
  if (winner === 'tie') {
    // animate tie
    testVictory.textContent = 'tie';
  } else if (userWeapon === winner) {
    // animate userWeapon victory
    testVictory.textContent = 'User Wins';
    playerObject.roundsWon--;
  } else {
    // animate cpuWeapon victory
    testVictory.textContent = 'CPU Wins';
    playerObject.roundsLost--;
  }
}

function cpuChoice () {
  var randomWeaponIndex = randomIndex(weaponArray.length);
  var randomWeapon = weaponArray[randomWeaponIndex];
  return randomWeapon;
}

// compare choices, maybe use Switch statement later?
function compareWeapons (weaponX, weaponY) {
  if ((weaponX === 'rock' && weaponY === 'paper')
  || (weaponY === 'rock' && weaponX === 'paper') ) {
    return 'paper';
  }
  if ((weaponX === 'rock' && weaponY === 'scissors')
  || (weaponY === 'rock' && weaponX === 'scissors') ) {
    return 'rock';
  }
  if ((weaponX === 'scissors' && weaponY === 'paper')
  || (weaponY === 'scissors' && weaponX === 'paper') ) {
    return 'scissors';
  }
  if ((weaponX === 'rock' && weaponY === 'rock')
  || (weaponX === 'paper' && weaponY === 'paper')
  || (weaponX === 'scissors' && weaponY === 'scissors')) {
    return 'tie';
  }
}

function displayVictoryScreen(){
  hide(animationScreen);
  show(victoryScreen);
}

// ^^ ====== GAME SCREEN ====== ^^ //
// =================================================== //

// =================================================== //
// vv ====== ANIMATION SCREEN ====== vv //

function draw(userWeapon, cpuWeapon) {
  var stage = new createjs.Stage('canvas');

  stage.autoClear = true;
  stage.clear();
  console.log('begin animation');
  var userRock = new createjs.Shape();
  userRock.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 50);
  var cpuRock = new createjs.Shape();
  cpuRock.graphics.beginFill('Red').drawCircle(0, 0, 50);

  if (userWeapon === 'rock') {
    userRock.x = 50;
    userRock.y = 200;
    stage.addChild(userRock);
    if (cpuWeapon === 'rock') {
      cpuRock.x = 450;
      cpuRock.y = 200;
      stage.addChild(cpuRock);

      // userRock animation against cpuRock
      createjs.Tween.get(userRock, { loop: false })
        .to({ x: 200 }, 1000, createjs.Ease.getPowInOut(4))
        .to({ x: 190 }, 50, createjs.Ease.getPowInOut(4))
        .to({ x: 200 }, 50, createjs.Ease.getPowInOut(4))
        .to({ x: 190 }, 50, createjs.Ease.getPowInOut(4))
        .to({ x: 200 }, 50, createjs.Ease.getPowInOut(4))
        .to({ alpha: 0 }, 100);

      // cpuRock animation against userRock
      createjs.Tween.get(cpuRock, { loop: false })
        .to({ x: 300 }, 1000, createjs.Ease.getPowInOut(4))
        .to({ x: 310 }, 50, createjs.Ease.getPowInOut(4))
        .to({ x: 300 }, 50, createjs.Ease.getPowInOut(4))
        .to({ x: 310 }, 50, createjs.Ease.getPowInOut(4))
        .to({ x: 300 }, 50, createjs.Ease.getPowInOut(4))
        .to({ alpha: 0 }, 100);


      createjs.Ticker.framerate = 60;
      createjs.Ticker.addEventListener('tick', stage);

    }
  }
  console.log('end animation');
}

// ^^ ====== ANIMATION SCREEN ====== ^^ //
// =================================================== //


// =================================================== //
// vv ====== VICTORY SCREEN ====== vv //

// Function to determine the round end
function handleNextRound() {
  if (playerObject.roundsWon === 0 || playerObject.roundsLost === 0) {
    playAgain();
  } else {
    nextRound();
  }
}

function incrementWinsData () {
  if(playerObject.roundsWon === 0) {
    playerObject.totalGamesWon++;
    if (playerObject.roundsChosen === 3) {
      playerObject.bestOf3Wins++;
    } else if (playerObject.roundsChosen === 5) {
      playerObject.bestOf5Wins++;
    } else {
      playerObject.bestOf7Wins++;
    }
  }
  playerObject.totalGamesPlayed++;
}

function playAgain () {
  nextRoundPlayAgainButton.textContent = 'Next Round';
  hide(victoryScreen);
  show(roundsScreen);
}

function nextRound() {
  hide(victoryScreen);
  show(gameScreen);
}

// ^^ ====== VICTORY SCREEN ====== ^^ //
// =================================================== //



// =================================================== //
// vv ====== HELPER FUNCTIONS ====== vv //
function randomIndex(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//function to hide
function hide(elem){
  elem.style.display = 'none';
}

//function to show
function show(elem){
  elem.style.display = 'block';
}
// ^^ ====== HELPER FUNCTIONS ====== ^^ //
// =================================================== //


