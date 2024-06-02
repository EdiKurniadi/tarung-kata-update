class Game{
	constructor() {
		this.name = 'tarung kata'; 
		this.currentState = 'GUESS';
		this.firstConfig = {word : null, indexOfRuledLetter : null};
		this.initAccount();
		network.setupSocketListener();
		network.onHandleInvitation(() => {this.handleAcceptInvitation()});
    	network.onHandleInvitationAccepted(() => {this.showGameType()});
    	network.onhandleRecieveFirstConfig((data) => {this.receiveFirstConfig(data)});
    	network.onHandleRecieveKey((data) => {this.play(data.key)});
    	network.onHandleRecieveTimeIsOver(() => {this.receieveTimeIsOver()})
    	input.onHandleKeyPressed((key) => this.handleKeyPress(key));
	}

	initAccount() {
		if(userManager.isLocalUsernameExist()) {
			this.usernameToJoin();
		} else {
			this.createLocalUsernameAndJoin();
		}
	}

	usernameToJoin() {
		network.join();
		elementUI.setUsername(userManager.localUsername);
	}

	createLocalUsernameAndJoin() {
		network.getUsers()
		.then(users => {
			notification.getInputText('buat username', (username) => {
				if(username === '') return 'tidak boleh kosong';
				if(users.includes(username)) return 'username sudah dipakai';
			}).then( username => {
				userManager.setLocalUsername(username);
				this.usernameToJoin();
			})
		})
	}


	findEnemy() {
		network.getUsers()
		.then(users => {
			notification.showClickableOptions('cari lawan main?', elementUI.createEnemiesList(users))
		})
	}

	showGameType() {
		notification.showGameTypeOptions((gameType) => this.chooseGameType(gameType));
	}

	chooseGameType(gameType) {
		this.setFirstConfig(gameType);
	}

	setFirstConfig(gameType) {
		const language = gameType.substring(0,2);
		const amountLetter = parseInt(gameType.charAt(3));
		wordsManager.setWords(gameType);
		wordsManager.setLanguage(language);
		elementUI.setTotalLetter(amountLetter);
		this.reset();
		let firstWord = wordsManager.getFirstWord();
		let firstIndexOfRuledLetter = Math.floor(Math.random()*amountLetter);
		this.firstConfig.word = firstWord;
		this.firstConfig.indexOfRuledLetter = firstIndexOfRuledLetter;
		network.sendFirstConfiguration(gameType, firstWord, firstIndexOfRuledLetter);
		this.start();
	}

	receiveFirstConfig(data) {
		const language = data.gameType.substring(0,2);
		const amountLetter = parseInt(data.gameType.charAt(3));
		wordsManager.setWords(data.gameType);
		wordsManager.setLanguage(language);
		elementUI.setTotalLetter(amountLetter);
		this.reset();
		this.firstConfig.word = data.firstWord;
		this.firstConfig.indexOfRuledLetter = data.firstIndexOfRuledLetter;
		this.start();
	}

	handleAcceptInvitation() {
		//
	}

	start() {
		let firstWord = this.firstConfig.word;
		let firstIndexOfRuledLetter = this.firstConfig.indexOfRuledLetter;
		wordsManager.addUsedWords(firstWord);
		wordsManager.addMeaningWords(firstWord);
		console.log(firstWord);
		elementUI.setWordToBoxesLetter(firstWord);
		elementUI.attachDefinitionToLastWord();
		challenge.addIndexOfRuledLetter(firstIndexOfRuledLetter);
		challenge.setColorCriteria(firstWord);
		this.applyColorCriteriaToBoxesLetter();
		elementUI.addWord();
		elementUI.showInfoPlayer();
		elementUI.updateInfoPlayer(` Giliran ${userManager.currentPlayer.toUpperCase()}:`);
		elementUI.updateInfoGame('silahkan tebak kata');
		challenge.clearIndexOfRuledLetter();
	}

	applyColorCriteriaToBoxesLetter() { 
		for(let i = 0 ; i < challenge.indexOfRuledLetter.length ; i++) {
			let color = challenge.getColor(i);
			let index = challenge.indexOfRuledLetter[i];
			elementUI.setColorOfBoxLetter(index, color);
		};
	};

	handleKeyPress(key) {
		if(userManager.isMyTurn()) {
			this.play(key);	
			network.sendKey(key);
		}
	}

	play(key) {
		switch (this.currentState) {
			case 'GUESS':
				this.handleGuessState(key);
			break;

	   		case 'SETTING':
				this.handleSettingState(key);
			break;

			default:
	      // Handle default case, if needed
			break;
	  	}
	}

	handleGuessState(key) {
	  switch (true) {
	    case input.isFirstChar(key):
	      timer.start(() => {this.handleTimeIsOver()});
	      input.firstCharPressed = true;

	    case input.isChar(key) && input.isEligibleChar(key):
	      elementUI.addCharToBoxesLetter(key);
	      if(input.isEligibleEnterAtGuess()) {
	      	elementUI.updateInfoGame('tekan enter untuk memasukan jawaban');
	      }
	      break;

	    case input.isDelete(key) && input.isEligibleDeleteAtGuess():
	      elementUI.deleteLastCharOfBoxesLetter();
	      elementUI.updateInfoGame('silahkan tebak kata');
	      break;

	    case input.isEnter(key) && input.isEligibleEnterAtGuess() && this.isGuessWordValid():
	      unlockSound.play();
	      this.handleEnterInGuessState();
	      break;

	    default:
	      // Handle default case, if needed
	      break;
	  }
	}


	isGuessWordValid() {
		let guessWord = elementUI.getLastWordText().toLowerCase();
		if(!wordsManager.isWordInKBBI(guessWord)) {
			notification.showShortMessage('kata yang kamu masukan tidak terdapat dalam KBBI',1000);
			return false;
		};
		if(wordsManager.isWordHaveUsed(guessWord)) {
			notification.showShortMessage('kata yang kamu masukan sudah pernah dicoba',1000);
			return false;
		};
		if(!challenge.isWordFollowColorCriteria(guessWord)) {
			notification.showShortMessage('kata yang kamu masukan tidak sesuai kriteria',1000);
			return false;
		};
		return true;
	}

	handleEnterInGuessState() {
	    timer.clear();
	    let guessWord = elementUI.getLastWordText();
	    wordsManager.addUsedWords(guessWord);
	    wordsManager.addMeaningWords(guessWord);
	   	userManager.isMyTurn() ? elementUI.enableBoxesLetterClickable() : elementUI.attachDefinitionToLastWord();
	    challenge.clearColorCriteria();
	   	elementUI.updateInfoGame(challenge.getInfoCurrentRule());
	    this.currentState = 'SETTING';
	}

	handleSettingState(key) {

	  switch (true) {
	    case input.isNumber(key) && input.isEligibleNumber(key):
	      this.handleNumberInSettingState(key);
	      break;

	    case input.isDelete(key) && input.isEligibleDeleteAtSetting():
	      this.handleDeleteInSettingState();
	      break;

	    case input.isEnter(key) && input.isEligibleEnterAtSetting():
	      unlockSound.play();
	      this.handleEnterInSettingState();
	      break;

	    default:
	      // Handle default case, if needed
	      break;
	  }
	}

	handleNumberInSettingState(key) {

		if(challenge.indexOfRuledLetter.includes(key-1)) {
			notification.showShortMessage('huruf sudah dipilih',1000);
			return;
		};

		let guessWord = elementUI.getLastWordText();
		let ruledLetter = guessWord.charAt(key-1);
		let indexRuledColor = challenge.indexOfRuledLetter.length;
		let color = challenge.getColor(indexRuledColor);

		if(color === 'Hijau') {
			if(challenge.exceptionLetter.includes(ruledLetter)) {
				notification.showShortMessage('Huruf yang dijadikan Hijau tidak boleh sama dengan huruf Hitam',1000)
				return;
			}
		}

		if(color === 'Orange') {
			if(challenge.exceptionLetter.includes(ruledLetter)) {
				notification.showShortMessage('Huruf yang dijadikan Orange tidak boleh sama dengan huruf Hitam',1000)
				return;
			}
		};

		if(color === 'Hitam') {
			let fixLetterWithoutIndex = challenge.fixLetter.map(item => item.letter);
			if(fixLetterWithoutIndex.includes(ruledLetter) || challenge.elasticLetter.includes(ruledLetter)) {
				notification.showShortMessage('Huruf yang dijadikan Hitam tidak boleh sama dengan huruf Hijau atau Orange',1000)
				return;
			}
		}

		challenge.addIndexOfRuledLetter(key - 1);
		elementUI.setBoxLetterFlipIn(key-1);
		challenge.clearColorCriteria();
		challenge.setColorCriteria(guessWord);
		this.applyColorCriteriaToBoxesLetter();
		if(input.isEligibleEnterAtSetting()) elementUI.updateInfoGame('tekan enter untuk memasukan jawaban');
	}

	handleDeleteInSettingState() {
		let guessWord = elementUI.getLastWordText();
		let indexRuledLetter = challenge.deleteLastIndexOfRuledLetter();
		let indexRuledColor = challenge.indexOfRuledLetter.length;
		let color = challenge.getColor(indexRuledColor);
		elementUI.eraseColoredBoxLetter(indexRuledLetter, color);
		elementUI.updateInfoGame(challenge.getInfoCurrentRule());
		challenge.clearColorCriteria();
		challenge.setColorCriteria(guessWord);
	}

	handleEnterInSettingState() {
		this.currentState = 'GUESS';
		let word = elementUI.getLastWordText();
		userManager.togglePlayer();
		elementUI.disableClickableBoxesLetter();
		elementUI.attachDefinitionToLastWord();
		elementUI.addWord();
		elementUI.updateLimitedWords();
		elementUI.updateInfoPlayer(` Giliran ${userManager.currentPlayer.toUpperCase()}:`);
		elementUI.updateInfoGame('silahkan tebak kata');
		challenge.clearColorCriteria();
		challenge.setColorCriteria(word);
		challenge.clearIndexOfRuledLetter();
		timer.start(() => {this.handleTimeIsOver()});
	}

	handleTimeIsOver() {
		userManager.clearOpponentUsername();
		if(userManager.isMyTurn()) {
			loseSound.play();
			notification.lose({
				opponent : userManager.exOpponentUsername,
				confirm  : () => {network.invite(userManager.exOpponentUsername)},
				deny 	 : () => {this.findEnemy()},
			})
			network.sendTimeIsOver();
			elementUI.hideInfoPlayer();
			this.handleMissWord();
		};
		userManager.clearCurrentPlayer();
	};

	receieveTimeIsOver() {
		winSound.play(); 
		notification.win({
				opponent : userManager.exOpponentUsername,
				confirm  : () => {network.invite(userManager.exOpponentUsername)},
				deny 	 : () => {this.findEnemy()},
		});
		elementUI.hideInfoPlayer();
		elementUI.updateInfoGame(`kamu menang`);
	}

	handleMissWord() {
		const missWords = wordsManager.findTheMissWord();
		if(missWords.length !== 0) {
			let randomIndex = Math.floor(Math.random()*missWords.length);
			let shownMissWord = missWords[randomIndex]
			if(missWords.length === 1) {
				elementUI.updateInfoGame(`sayang sekali, padahal masih ada 1 kata terakhir, yaitu <b>${shownMissWord}</b>`);
			} else {
			elementUI.updateInfoGame(`sayang sekali, padahal masih ada <b>${shownMissWord}</b> dan ${missWords.length-1} kata lainnya`);				
			}
		} else {
			elementUI.updateInfoGame(`kamu kena <b>skak mat</b>, tidak ada lagi kata yang memenuhi kriteria`);
		}
	}

	reset() {
		wordsManager.clearWordHaveUsed();
		elementUI.resetContainerWords();
		timer.reset();
		input.firstCharPressed = false;
		challenge.clearIndexOfRuledLetter();
		challenge.clearColorCriteria();
	}

}

let game = new Game();