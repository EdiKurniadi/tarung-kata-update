class Timer{
	constructor(minute, second) {
		this.minute = minute;
		this.second = second;
		this.initialMinute = minute;
		this.initialSecond = second;
		this.minuteElement = document.getElementById('minute');
		this.secondElement = document.getElementById('second');
		this.timer = null;
	}

	set() {
		this.secondElement.innerText = this.second;
		this.minuteElement.innerText = this.minute;
	}

	countDown(callback) {
		if(this.minute >= 0  && this.second !== 0 ) { //kalau masih ada waktu
			this.second--;
			this.set();
		} else if(this.minute !== 0 && this.second === 0 ) { //kalau detiknya sudah 0, tapi menit masih ada
			this.minute--;
			this.second = 59; 
			this.set();
		} else {
			this.clear();
			callback(); //call a function if time is over
		}
	}


	start(callback) {
		this.set();
		this.timer = setInterval(() => {
			this.countDown(callback);
		},1000)
	}

	clear() {
		this.minute = this.initialMinute;
		this.second = this.initialSecond;
		clearInterval(this.timer);
	}

	reset() {
		this.secondElement.innerText = "--";
		this.minuteElement.innerText = "--";
	}
}

let timer = new Timer(1,0);
