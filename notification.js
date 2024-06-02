class Notification{
	constructor() {
		this.pop = 'pop';
	}

	showShortMessage(message, timer = 2000) {
		Swal.fire({
				title:message,
				showConfirmButton : false,
				timer: timer,
				allowEnterKey : true,
			});
	}

	async getInputText(title, validatorFunction) {
		let {value:input} = await Swal.fire({
						title: title,
						input : 'text',
						confirmButtonText: 'Ya',
						focusConfirm: false,
						allowEnterKey : true,
						inputValidator : validatorFunction
					});
		return input;
	}

	showConfirmation({message, onConfirm, onDeny}) {
		Swal.fire({
		  title: message,
		  showDenyButton: true,
		  confirmButtonText: 'Ya',
		  denyButtonText: 'Ndak Mau',
		}).then((result) => {
		  result.isConfirmed ? onConfirm() : onDeny();
		}); 
	}

	showClickableOptions(title, elements) {
		Swal.fire({
		  title: title,
		  html: elements,
		  showCloseButton: true,
		  showConfirmButton : false,
		})
	}

	showDefinition(word, definition) {
		Swal.fire({
			title: `<strong><u>${word}</u></strong>`,
			// icon: 'info',
			html: definition || 'definsi tidak ditemukan',
			showConfirmButton : false,
		})
	};

	showGameTypeOptions(callback) {
		Swal.fire({
		  title: 'Atur Permainan',
		  html: `
                <div class="radio-group">
                    <label class="radio-container">
                    	<img class="flag-icon" src="flag/ind-flag.png">
                        ID-5
                        <input type="radio" name="game-type" value="ID-5" checked>
                        <span class="checkmark">
                        	<img class="flag-icon" src="flag/ind-flag.png">
                        	ID-5
                        </span>
                    </label>
                    <label class="radio-container">
                    	<img class="flag-icon" src="flag/usa-flag.png">
                        EN-5
                        <input type="radio" name="game-type" value="EN-5">
                        <span class="checkmark">
                        	<img class="flag-icon" src="flag/usa-flag.png">
                        	EN-5
                        </span>
                    </label>
                    <label class="radio-container">
                        <img class="flag-icon" src="flag/usa-flag.png">
                        EN-6
                        <input type="radio" name="game-type" value="EN-6">
                        <span class="checkmark">
                        	<img class="flag-icon" src="flag/usa-flag.png">
                        	EN-6
                        </span>
                    </label>
                </div>
		  `,
		  allowOutsideClick : false,
		  preConfirm: () => {
		    const gameType = document.querySelector('input[name="game-type"]:checked').value;
		    // console.log(gameType)
		    if (!gameType) {
		      Swal.showValidationMessage('Anda harus memilih salah satu opsi!');
		    }
		    return {gameType};
		  }
		}).then((result) => {
		  if (result.isConfirmed) {
		    callback(result.value.gameType)
		  }
		});
	}

	lose({opponent, confirm, deny}) {
		let randomNumberForGifDefeat = Math.floor(Math.random()*5);
		Swal.fire({
			  title: 'Wuuu!!!',
			  text: `kamu kalah lawan ${opponent}`,
			  imageUrl: `gif/kalah${randomNumberForGifDefeat}.gif`,
			  // imageWidth: 400,
			  imageHeight: 200,
			  imageAlt: 'kalah',
			  html : `<p>kamu kalah lawan ${opponent}</p>`,
			  confirmButtonText : `main lagi dengan ${opponent}`,
			  showDenyButton: true,
			  denyButtonText: 'Cari lawan lain',
			  showCloseButton : true,
			  allowEnterKey : true,
			  allowEscapeKey : true,
		}).then(res => {
			if(res.isConfirmed) {
				confirm();
			} else if (res.isDenied) {
				deny();
			}
		})
	}

	win({opponent, confirm, deny}) {
		let randomNumberForGifWin = Math.floor(Math.random()*5);
		Swal.fire({
			title: 'HOREE!!!',
			text: `Yee kamu berhasil menang, ${opponent} cupu`,
			imageUrl: `gif/menang${randomNumberForGifWin}.gif`,
			// imageWidth: 400,
			imageHeight: 200,
			imageAlt: 'berhasil',
			html : `<p>Yee kamu berhasil menang, ${opponent} cupu</p>`,
			confirmButtonText : `main lagi dengan ${opponent}`,
			showDenyButton: true,
			denyButtonText: 'Cari lawan lain',
			showCloseButton : true,
			allowEnterKey : true,
			allowEscapeKey : true,
		}).then(res => {
			if(res.isConfirmed) {
				confirm();
			} else if (res.isDenied) {
				deny();
			}
		})
	}

	close() {
		Swal.close()
	}

}

let notification = new Notification();

