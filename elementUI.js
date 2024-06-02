// const INDEX_ALL_BOX_FILLED = 6;
const MAX_DISPLAYED_WORD_COUNT = 4;
// const TOTAL_LETTER = 6;

class ElementUI{
	constructor() {
		this.containerWords = document.getElementById('container-words');
		this.words = document.querySelectorAll('.word');
		this.usernameElement = document.getElementById('username');
		this.infoPlayer = document.querySelector('.info-player');
		this.infoPlayerText = document.querySelector('.info-player-text');
		this.infoGame = document.querySelector('.info-game');
		this.TOTAL_LETTER = 5;
	}

	setTotalLetter(totalLetter) {
		this.TOTAL_LETTER = totalLetter;
	}

	getWords() {
		this.words = document.querySelectorAll('.word');
		return this.words;
	}

	getLastWord() {
		let words = this.getWords();
		return words[words.length-1];
	}

	updateLimitedWords() {
		let words = this.getWords();
		let wordsCount = words.length;
		if(wordsCount > MAX_DISPLAYED_WORD_COUNT) {
			words[wordsCount-MAX_DISPLAYED_WORD_COUNT].style.display = 'none';
		}
	}

	resetContainerWords() {
	  const boxLetter = '<span class="box-letter">?</span>';
	  const amountLetter = this.TOTAL_LETTER;
	  const boxes = boxLetter.repeat(amountLetter);
	  this.containerWords.innerHTML = `<div class="word">${boxes}</div>`;
	}



	attachDefinitionToLastWord() {
		let lastWord = this.getLastWord();
		let lastWordText = this.getLastWordText();
		lastWord.addEventListener( 'click', () => {
			notification.showDefinition(lastWordText, wordsManager.meaningWords[lastWordText])
		})
	}

	addWord() {
		let newWord = document.createElement('div');
		newWord.classList.add('word');
		const boxLetter = '<span class="box-letter">?</span>';
		const boxes = boxLetter.repeat(this.TOTAL_LETTER);
		newWord.innerHTML = boxes;
		this.containerWords.appendChild(newWord);
	}

	getBoxLetter(index) {
		return this.getLastWord().children[index];
	}

	setCharOfBoxLetter(index, char) {
		this.getBoxLetter(index).innerText = char.toUpperCase();
	}

	setBoxLetterFilled(index) {
		this.getBoxLetter(index).classList.add('box-letter-filled');
	}

	setBoxLetterAnimate(index) {
		this.getBoxLetter(index).classList.add('box-letter-animate');
		setTimeout(() => {
	    	 this.getBoxLetter(index).classList.remove('box-letter-animate');
	    }, 300); // Menghapus kelas 'animate' setelah 200ms
	}

	setBoxLetterFlipIn(index) {
		this.getBoxLetter(index).classList.add('box-letter-flipIn');
		setTimeout(() => {
			this.getBoxLetter(index).classList.add('box-letter-flipOut');
			this.getBoxLetter(index).classList.remove('box-letter-flipIn');
		}, 250)

		setTimeout(() => {
			this.getBoxLetter(index).classList.remove('box-letter-flipOut');
		}, 350)

	}

	removeBoxLetterFilled(index) {
		this.getBoxLetter(index).classList.remove('box-letter-filled');
	}

	addCharToBoxesLetter(char) {
		let indexNewChar = this.getIndexQuestionMark();
		this.setCharOfBoxLetter(indexNewChar, char);
		this.setBoxLetterFilled(indexNewChar);
		this.setBoxLetterAnimate(indexNewChar);
	}

	deleteLastCharOfBoxesLetter() {
		let indexLastChar = this.getIndexQuestionMark() - 1;
		this.setCharOfBoxLetter(indexLastChar, '?');
		this.removeBoxLetterFilled(indexLastChar);
	}

	setColorOfBoxLetter(index, color) {
		this.getBoxLetter(index).classList.add(color);
	}

	eraseColoredBoxLetter(index, color) {
		this.getBoxLetter(index).classList.remove(color);
	}

	enableBoxesLetterClickable() {
		let boxesLetter = this.getLastWord().children;
		for(let i = 0 ; i < boxesLetter.length ; i++) {
				boxesLetter[i].addEventListener('click', function() {
				  let keyboardEvent = new KeyboardEvent('keyup', { key: i+1 });
				  document.dispatchEvent(keyboardEvent);
				});
			}
	}

	disableClickableBoxesLetter() {
		let boxesLetter = this.getLastWord().children;
		for(let i = 0 ; i < boxesLetter.length ; i++) {
			boxesLetter[i].style.pointerEvents = 'none';
		}
	}

	setWordToBoxesLetter(word) {
		for(let i = 0 ; i < this.TOTAL_LETTER ; i++) {
			this.setCharOfBoxLetter(i, word.charAt(i));
			this.setBoxLetterFilled(i);
		};
	};

	getLastWordText() {
		return Array.from(this.getLastWord().children)
		.map(element => element.innerText)
		.join('')
		.toLowerCase();
	};

	getIndexQuestionMark() {
		let boxLetters = this.getLastWord().children;
		let index = Array.from(boxLetters).findIndex(element => element.innerText === '?');
		return index !== -1 ? index : this.TOTAL_LETTER;
	};

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
		this.infoGame.innerHTML = info;
	}

}

let elementUI = new ElementUI();