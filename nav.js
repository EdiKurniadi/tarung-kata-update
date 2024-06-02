

let settingButton = document.querySelector('.fa-cog');
let closeSettingButton = document.querySelector('.close-setting-button');
let settingPage = document.querySelector('.setting-page');

settingButton.addEventListener('click', () => {
	settingPage.style.top = '0';
	settingPage.style.visibility = 'visible';
})

closeSettingButton.addEventListener('click', () => {
	settingPage.style.visibility = 'hidden';
	settingPage.style.top = '-100vh';
})



let howToPlayButton = document.querySelector('.fa-info-circle');
let closeHowToPlayButton = document.querySelector('.close-how-to-play');
let howToPlayPage = document.querySelector('.how-to-play-page');

howToPlayButton.addEventListener('click', () => {
	howToPlayPage.style.top = '0';
	howToPlayPage.style.visibility = 'visible';
})

closeHowToPlayButton.addEventListener('click', () => {
	howToPlayPage.style.top = '-100vh';
	howToPlayPage.style.visibility = 'hidden';
	
})


let statisticButton = document.querySelector('.fa-bar-chart');
let closeStatisticButton = document.querySelector('.close-statistic');
let statisticPage = document.querySelector('.statistic-page');

statisticButton.addEventListener('click', () => {
    statisticPage.style.top = '0';
    statisticPage.style.visibility = 'visible';
})

closeStatisticButton.addEventListener('click', () => {
	statisticPage.style.top = '-100vh';
	statisticPage.style.visibility = 'hidden';
	
})


let mainBodyGame = document.querySelector('body');
let checkBoxNightMode = document.querySelector('.night-mode');

function toggleNightMode() {
    if(checkBoxNightMode.checked) {
        mainBodyGame.classList.add('dark-theme');
        // localStorage.nightMode = 'active';
    } else {
        mainBodyGame.classList.remove('dark-theme');
        // localStorage.nightMode = 'inactive';
    }
}

checkBoxNightMode.addEventListener('change', () => {
    toggleNightMode();
})



let checkBoxSound = document.querySelector('.audio');
function toggleAllSounds() {
    if(checkBoxSound.checked) {
        winSound.mute = false;
        unlockSound.mute = false;
        loseSound.mute = false;
    } else {
        winSound.mute = true;
        unlockSound.mute = true;
        loseSound.mute = true;
    }
}


checkBoxSound.addEventListener('change', () => {
    toggleAllSounds();
})

// toggleTimer();
// toggleNightMode();