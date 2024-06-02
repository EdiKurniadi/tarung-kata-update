class ElementUI{
	constructor() {
		this.usernameElement = document.getElementById('username');
		this.infoPlayer = document.querySelector('.info-player');
		this.infoPlayerText = document.querySelector('.info-player-text');
		this.infoGame = document.querySelector('.info-game');
	}

	createEnemyButton(enemyUsername) {
		return `<button 
		class="enemy-button" 
		onclick="elementUI.handleEnemyButtonClick('${enemyUsername}')">
			${enemyUsername}
		</button>`;
	}

	createEnemiesList(enemyUsernames) {
    return enemyUsernames
        .filter(username  => username  !== userManager.localUsername)
        .map(username => this.createEnemyButton(username))
        .join('');
	}

	handleEnemyButtonClick(enemyUsername) {
		network.invite(enemyUsername);
		notification.close();
	}

	setUsername(newUsername) {
		this.usernameElement.innerText = newUsername;
	}

	updateInfoPlayer(info) {
		this.infoPlayerText.innerText = info;
	}

	showInfoPlayer() {
		this.infoPlayer.style.display = 'block';
	}

	hideInfoPlayer() {
		this.infoPlayer.style.display = 'none';
	}

	updateInfoGame(info) {
		this.infoGame.innerText = info;
	}



}

let elementUI = new ElementUI();