class Network {
  constructor(server) {
    this.socket = io(server);
    this.isActive = false;
  }

  setupSocketListener() {
    this.socket.on('connect',                ()     => {this.handleConnect()});
    this.socket.on('disconnect',             ()     => {this.handleDisconnect()});
    this.socket.on('invitation-rejected',    (data) => {this.handleInvitationRejected(data)});
    this.socket.on('invitation-rejected-already-have-opponent', data => {this.handleInvitationRejectedWithReason(data)})
  }

  handleConnect() {
    this.isActive = true;
  }

  handleDisconnect() {
    this.isActive = false;
  }

  join() {
    this.socket.emit('join', userManager.localUsername);
  }

  invite(otherUser) {
    this.socket.emit('invite', {inviter:userManager.localUsername, invited:otherUser});
  }

  onHandleInvitation(callback) {
    this.socket.on('invited', (data) => {this.handleInvitation(data, callback)});
  }

  handleInvitation(data, callback) {
    if(!userManager.isOpponentUsernameExist()) {
      notification.showConfirmation({
        message: `${data.inviter} ngajak kamu main ni?`,
        onConfirm: () => {this.handleAcceptInvitation(data, callback)},
        onDeny: () => {this.handleRejectInvitation(data)}
      })
    } else {
      this.handleRejectInvitationWithReason(data);
    }
  }

  handleAcceptInvitation(data, callback) {
    this.socket.emit('accept-invitation', data);
    userManager.setOpponentUsername(data.inviter);
    userManager.setCurrentPlayer(data.inviter);
    callback();
  }

  handleRejectInvitation(data) {
    this.socket.emit('reject-invitation', data);
  }

  handleRejectInvitationWithReason(data) {
    this.socket.emit('reject-invitation-already-have-opponent', {inviter: data.inviter, invited: data.invited, opponent:userManager.opponentUsername})
  }


  onHandleInvitationAccepted(callback) {
     this.socket.on('invitation-accapted', (data) => {this.handleInvitationAccepted(data, callback)});
  }

  handleInvitationAccepted(data, callback) {
    notification.showShortMessage(`oke, silahkan mulai permainanya`);
    userManager.setOpponentUsername(data.invited);
    userManager.setCurrentPlayer(data.inviter);
    callback();
  }

  handleInvitationRejected(data) {
    notification.showShortMessage(`ajakanmu tidak diterima ${data.invited}`);
  }

  handleInvitationRejectedWithReason(data) {
    notification.showShortMessage(`maaf! ${data.invited} lagi main dengan ${data.opponent}`);
  }

  sendFirstConfiguration(gameType, word, number) {
    this.socket.emit('send-first-configuration', {reciever:userManager.opponentUsername, gameType, firstWord:word, firstIndexOfRuledLetter:number});
  }

  onhandleRecieveFirstConfig(callback) {
    this.socket.on('receive-first-configuration', (data) => {this.handleRecieveFirstConfiguration(data, callback)});
  }

  handleRecieveFirstConfiguration(data, callback) {
    callback(data);
  }

  sendKey(key) {
    this.socket.emit('send-key', {reciever:userManager.opponentUsername, key:key})
  }

  onHandleRecieveKey(callback) {
    this.socket.on('recieve-key', (data) => {this.handleRecieveKey(data, callback)});
  }

  handleRecieveKey(data, callback) {
    callback(data);
  }


  sendTimeIsOver() {
    this.socket.emit('send-time-is-over', {reciever:userManager.exOpponentUsername})
  }

  onHandleRecieveTimeIsOver(callback) {
    this.socket.on('receive-time-is-over', () => {this.handleReceiveTimeIsOver(callback)})
  }

  handleReceiveTimeIsOver(callback) {
    callback();
  }

  getUsers() {
    return new Promise((resolve, reject) => {
        this.socket.emit('request-users-data', {requester:userManager.localUsername});
        this.socket.on('recieve-users-data', (data) => {

            this.socket.off('recieve-users-data');
            resolve(Object.values(data.users));

        });
        setTimeout(() => {
            reject('Timeout: Server tidak merespons permintaan data users');
            this.socket.off('recieve-users-data');
        }, 5000); //timeout 5 detik
    });
  };


};


let network = new Network('http://192.168.74.152:3001')