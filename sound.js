//class untuk mengatur sound
class sound {
  constructor(src) {
    this.mute = false;
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  };
  
  play() {
    if(!this.mute) this.sound.play();
  }

  toggleMute() {
    this.mute = !this.mute;
  }

  stop() {
    this.sound.pause();
  }

};

let winSound = new sound('audio/fairy-win.wav');
let unlockSound = new sound('audio/unlock-game-notification.wav');
let loseSound = new sound('audio/losing-drums.wav');
