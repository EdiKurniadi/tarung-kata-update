class Challenge{

	constructor() {
		this.fixLetter = [];
		this.elasticLetter = [];
		this.fixExceptionLetter = [];
		this.exceptionLetter = [];
		this.indexOfRuledLetter = [];
		this.colorRule = 'GORB';
		this.nameColor = {
			'G':'Hijau',
			'O':'Jingga',
			'R':'Merah',
			'B':'Hitam'
		};
	};

	addIndexOfRuledLetter(index) {
		this.indexOfRuledLetter.push(index);
	};

	deleteLastIndexOfRuledLetter() {
		return this.indexOfRuledLetter.pop();
	};

	addFixLetter(index, letter) {
		this.fixLetter.push({index, letter});
	};

	addElasticLetter(letter) {
		this.elasticLetter.push(letter);
	};

	addFixExceptionLetter(index, letter) {
		this.fixExceptionLetter.push({index,letter})
	}

	addExceptionLetter(letter) {
		this.exceptionLetter.push(letter);
	};

	clearFixLetter() {
		this.fixLetter = [];
	};

	clearElasticLetter() {
		this.elasticLetter = [];
	};

	clearFixExceptionLetter() {
		this.fixExceptionLetter = [];
	}

	clearExceptionLetter() {
		this.exceptionLetter = [];
	};

	clearIndexOfRuledLetter() {
		this.indexOfRuledLetter = [];
	}

	clearColorCriteria() {
		this.clearFixLetter();
		this.clearElasticLetter();
		this.clearFixExceptionLetter();
		this.clearExceptionLetter();
	};


	setColorCriteria(word) {
		for(let i = 0 ; i < this.indexOfRuledLetter.length ; i++) {
			let index = this.indexOfRuledLetter[i];
			let color = this.getColor(i);
			if(color === 'Hijau') {
				this.addFixLetter(index, word.charAt(index))
			};
			if(color === 'Jingga') {
				this.addElasticLetter(word.charAt(index))
			};
			if(color === 'Merah') {
				this.addFixExceptionLetter(index, word.charAt(index))
			};
			if(color === 'Hitam') {
				this.addExceptionLetter(word.charAt(index))
			};
		};
	};


	getColor(index) {
		return this.nameColor[this.colorRule.charAt(index)];
	};

	getCurrentRule() {
		let currentRule = this.colorRule;
		let countWords = elementUI.getWords().length;
		if(countWords < 4) return currentRule.substring(0,1);
		if(countWords < 6) return currentRule.substring(0,2);
		if(countWords < 8) return currentRule.substring(0,3);
		if(countWords < 10) return currentRule.substring(0,4);
		return currentRule;
	};

	getInfoCurrentRule() {
		let countWords = elementUI.getWords().length;
		if(countWords < 4) return `Pilih kotak yang akan menjadi ${this.getColor(0)}`;
		if(countWords < 6) return `Pilih kotak yang akan menjadi ${this.getColor(0)} dan ${this.getColor(1)}`;
		if(countWords < 8) return `Pilih kotak yang akan menjadi ${this.getColor(0)}, ${this.getColor(1)} dan ${this.getColor(2)}`;
		// if(countWords < 10) return `Pilih kotak yang akan menjadi ${this.getColor(0)}, ${this.getColor(1)}, ${this.getColor(2)} dan ${this.getColor(3)}`;
		return `Pilih kotak yang akan menjadi ${this.getColor(0)}, ${this.getColor(1)}, ${this.getColor(2)} dan ${this.getColor(3)}`;
	};

	isWordFollowFixLetter(word) {
		for(let i = 0 ; i < this.fixLetter.length ; i++) { //tebakan tidak mengikuti aturan kotak hijau
			if(this.fixLetter[i].letter !== word.charAt(this.fixLetter[i].index)) {
				return false;
			};
		};
		return true;
	}

	isWordFollowElasticLetter(word) {
		for(let i = 0 ; i < this.elasticLetter.length ; i++) { //tebakan tidak mengikuti aturan kotak hijau
			if(!word.includes(this.elasticLetter[i])) {
				return false;
			};
		};
		return true;
	}

	isWordFollowFixExceptionLetter(word) {
		for(let i = 0 ; i < this.fixExceptionLetter.length ; i++) { //tebakan tidak mengikuti aturan kotak merah
			if(this.fixExceptionLetter[i].letter === word.charAt(this.fixExceptionLetter[i].index)) {
				return false;
			};
		};
		return true;
	}


	isWordFollowExceptionLetter(word) {
		for(let i = 0 ; i < this.exceptionLetter.length ; i++) { //tebakan tidak mengikuti aturan kotak hijau
			if(word.includes(this.exceptionLetter[i])) {
				return false;
			};
		};
		return true;
	}

	isWordFollowColorCriteria(word) {
		return this.isWordFollowFixLetter(word) && this.isWordFollowElasticLetter(word) && this.isWordFollowFixExceptionLetter(word) && this.isWordFollowExceptionLetter(word);
	};
}

let challenge = new Challenge();