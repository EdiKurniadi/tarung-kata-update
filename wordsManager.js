
class WordsManager{
	constructor() {
		this.words = [];
		this.firstWord = null;
		this.usedWords = [];
		this.meaningWords = {};
		this.language = 'ID';
	}

	setWords(gameType) {
		if(gameType === 'ID-5') this.words = [...indWords5];
		if(gameType === 'EN-5') this.words = [...engWords5];
		if(gameType === 'EN-6') this.words = [...engWords6];
	}

	setLanguage(language) {
		this.language = language;
	}

	getFirstWord() {
		let randomNumber = Math.floor(Math.random()*this.words.length);
		this.firstWord = this.words[randomNumber];
		return this.firstWord;
	}

	addUsedWords(word) {
		this.usedWords.push(word)
	}

	isWordHaveUsed(word){
		return this.usedWords.includes(word);
	}

	clearWordHaveUsed() {
		this.usedWords = [];
	}

	isWordInKBBI(word) {
		return this.words.includes(word);
	}

	addMeaningWords(word) { 
		fetch(`http://192.168.88.76:3001/${this.language}/${word}`)
			.then(response => response.json())
			.then(data => {
				this.meaningWords[word] = data.definition;
			})
			.catch(err => {
				this.meaningWords[word] = 'definisi tidak ditemukan';
		});
		
		// fetch(`https://glorious-lime-gharial.cyclic.app/entri/${word}`)
		// .then(response => response.json())
		// .then(data => {
		// 	this.meaningWords[word] = data.data;
		// })
		// .catch(err => {
		// 	this.meaningWords[word] = 'definisi tidak ditemukan';
		// });
	};

	findTheMissWord() {
	let missWords = [...this.words];
	    //menghapus kata yang tidak sesuai dengan aturan fix letter
		for(let i = 0; i < challenge.fixLetter.length ; i++) {
			missWords = missWords.filter(word => word.charAt(challenge.fixLetter[i].index) === challenge.fixLetter[i].letter.toLowerCase());
		}
		//menghapus kata yang tidak sesuai dengan aturan elastic letter
		for(let i = 0; i < challenge.elasticLetter.length ; i++) {
			missWords = missWords.filter(word => word.includes(challenge.elasticLetter[i].toLowerCase()));
		}
		//menghapus kata yang tidak sesuai dengan aturan fix exception letter
		for(let i = 0; i < challenge.fixExceptionLetter.length ; i++) {
			missWords = missWords.filter(word => word.charAt(challenge.fixExceptionLetter[i].index) !== challenge.fixExceptionLetter[i].letter.toLowerCase());
		}
		//menghapus kata yang tidak sesuai dengan aturan exception letter
		for(let i = 0; i < challenge.exceptionLetter.length ; i++) {
			missWords = missWords.filter(word => !word.includes(challenge.exceptionLetter[i].toLowerCase()));
		}
		//menghapus kata yang sudah digunakan
		for(let i = 0; i < this.usedWords.length ; i++) {
			missWords = missWords.filter(word => word !== this.usedWords[i])
		}
		return missWords;
	}

}

let wordsManager = new WordsManager();