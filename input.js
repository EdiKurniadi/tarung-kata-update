class Input{
	constructor() {
		this.firstCharPressed = false;
		this.keyboardButtons = document.querySelectorAll(".key");
		this.bindKeyboardButtons();
	}

	bindKeyboardButtons() {
		for(let i = 0 ; i < this.keyboardButtons.length ; i++) {

			this.keyboardButtons[i].addEventListener('click', () => {
			  let keyboardEvent = new KeyboardEvent('keyup', { key: this.keyboardButtons[i].innerText });
			  if(this.keyboardButtons[i].classList[1] === "del-key") keyboardEvent = new KeyboardEvent('keyup', { key: "Backspace" });
			  // Memicu peristiwa keyboard event pada elemen dokumen
			  document.dispatchEvent(keyboardEvent);
			});
		}

	}

	onHandleKeyPressed(callback) {
		document.addEventListener('keyup', (event) => {
			let key = event.key;
			callback(key)
		})
	}

	isFirstChar(key) {
		return this.isChar(key) ? !this.firstCharPressed : false;
	}

	isChar(key) {
		return key.match(/[A-Za-z]/) && key.length === 1;
	}

	isDelete(key) {
		return key === 'Backspace';
	}

	isEnter(key) {
		return key === 'Enter';
	}

	isNumber(key) {
		const regex = new RegExp(`[1-${elementUI.TOTAL_LETTER}]`);
  		return !!key.toString().match(regex);
	} 

	isEligibleChar() {
		return elementUI.getIndexQuestionMark() !== elementUI.TOTAL_LETTER;
	}

	isEligibleDeleteAtGuess() {
		return elementUI.getIndexQuestionMark() !== 0;
	}

	isEligibleEnterAtGuess() {
		return elementUI.getIndexQuestionMark() === elementUI.TOTAL_LETTER;
	}

	isEligibleNumber(number) {
		return challenge.getCurrentRule().length > challenge.indexOfRuledLetter.length;
	}

	isEligibleDeleteAtSetting() {
		return challenge.indexOfRuledLetter.length !== 0;
	}

	isEligibleEnterAtSetting() {
		return challenge.getCurrentRule().length === challenge.indexOfRuledLetter.length;
	}


}

let input = new Input();

// line 1: A -> Guess Word, B -> Enter Setting, C -> Wait
// line 2: C -> GW, A -> ES, B -> W
// line 3: B -> GW, C -> ES, A -> W
// line 4: A -> GW, B -> ES, C -> W





