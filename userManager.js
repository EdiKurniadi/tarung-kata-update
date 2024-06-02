class UserManager {
  constructor() {
    this.localUsername = localStorage.getItem('localUsername') || null;
    this.opponentUsername = null;
    this.exOpponentUsername = null;
    this.currentPlayer = null;
  }

  isLocalUsernameExist() {
    return !!this.localUsername;
  }

  isOpponentUsernameExist() {
    return !!this.opponentUsername;
  }

  isMyTurn() {
    return this.localUsername && this.currentPlayer === this.localUsername;
  }

  setLocalUsername(newUsername) {
    if (newUsername) {
      this.localUsername = newUsername;
      this.saveLocalUsername();
    }
  }

  setOpponentUsername(newUsername) {
    if (newUsername) {
      this.opponentUsername = newUsername;
    }
  }

  setCurrentPlayer(username) {
    this.currentPlayer = username
  }

  togglePlayer() {
    if(this.currentPlayer === this.localUsername) {
      this.currentPlayer = this.opponentUsername;
    } else {
      this.currentPlayer = this.localUsername;
    }
  }

  saveLocalUsername() {
    localStorage.setItem('localUsername', this.localUsername);
  }

  clearLocalUsername() {
    this.localUsername = null;
    this.saveLocalUsername();
  }

  clearOpponentUsername() {
    this.exOpponentUsername = this.opponentUsername;
    this.opponentUsername = null;
  }

  clearCurrentPlayer() {
    this.currentPlayer = null;
  }
}

let userManager = new UserManager();