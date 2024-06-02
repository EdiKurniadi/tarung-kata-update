const socket = io('http://192.168.88.76:3001');

socket.on('connect', () => {
  console.log('Terhubung dengan server');
});

socket.on('connect_error', (err) => {
  console.error('Gagal terhubung dengan server:', err);
});

let AllRooms = [];
let createAccountState = true;
let myEnemy;
let myExEnemy;
let whoIsPlaying;
let username;
// let usernameElement = document.querySelector('#username');

const shortSwalMessage = (title, timer = 2000) => {
	Swal.fire({
				title:title,
				showConfirmButton : false,
				timer: timer,
				allowEnterKey : true,
			});
}

const getUsernameFromInput = async (titlePopUp) => {
	createAccountState = true;
	let {value:username} = await Swal.fire({
					  title: titlePopUp,
					  input : 'text',
					  confirmButtonText: 'Ya',
					  focusConfirm: false,
					  allowEnterKey : true,
					  inputValidator : (value) => {
					  	if(AllRooms.includes(value)) {
					  		return 'username sudah dipakai!'
					  	}
					  }
					});
}

const joinToServer = (username) => {
	if (username) {
		shortSwalMessage(`masuk ke server sebagai ${username}`);
		socket.emit('join', username);
		document.querySelector('#username').innerText = username;
		localStorage.username = username;
		createAccountState = false;	
	}
}

const retrieveUsernameFromMemory = () => {
	username = localStorage.username;
	if(username) {
		socket.emit('join', username);
		document.querySelector('#username').innerText = username;
		createAccountState = false;
	} else {
		getUsernameFromInput('Buat username');
	};
} 


const updateUserName = () => {
	socket.emit('delete room', username);
	getUsernameFromInput('Perbarui username');
};


const invite = (name) => {
	if(!username) {
		shortSwalMessage(`tulis nama server terlebih dahulu`);
		return;
	}
	if(!myEnemy) {
		socket.emit("invite", {invited: name, inviter: username});
		Swal.fire({
					title:`menunggu konfirmasi ${name}`,
					showConfirmButton : false,
					allowEnterKey : true,
				});
	} else {
		shortSwalMessage(`kamu masih bertarung dengan ${myEnemy}`);
	}

}

const findEnemy = () => {
	// username = document.querySelector('#username').innerText;
	let listEnemyHtml = AllRooms.map( name => {
							if(name !== username) {
								return `<button class="enemy-list" onclick="invite('${name}')">
										${name}
									</button>`
							} 
						}).join('');

	Swal.fire({
	  title: 'cari lawan main',
	  html: listEnemyHtml,
	  showCloseButton: true,
	  showConfirmButton : false,
	})
}

socket.on('want to play?', (data) => {
	if(!myEnemy) {
		Swal.fire({
		  title: `${data.inviter} ngajak kamu main ni?`,
		  showDenyButton: true,
		  confirmButtonText: 'Oke',
		  denyButtonText: `Ndak Mau`,
		}).then((result) => {
		  if (result.isConfirmed) {
		    socket.emit('invitation-accapted', data)
		    myEnemy = data.inviter;
		    whoIsPlaying = data.inviter;
		    document.querySelector('.info-player').innerHTML = `<i class="fa fa-user-circle" aria-hidden="true"></i> Giliran ${whoIsPlaying.toUpperCase()}:`;
		  } else if (result.isDenied) {
		    socket.emit('invitation-rejected', data)
		  }
		})
	} else {
		socket.emit('invitation-rejected-because-playing-with-other', data);
	}
})

socket.on('invitation-accapted', (data) => {
	shortSwalMessage(`oke, silahkan mulai permainanya`)
	myEnemy = data.invited;
	whoIsPlaying = data.inviter;
	document.querySelector('.info-player').innerHTML = `<i class="fa fa-user-circle" aria-hidden="true"></i> Giliran ${whoIsPlaying.toUpperCase()}:`;
	initializeWord();

})

socket.on('invitation-rejected', (data) => {
	shortSwalMessage(`ajakanmu tidak diterima ${data.invited}`)
})

socket.on('invitation-rejected-because-playing-with-other', (data) => {
	shortSwalMessage(`${data.invited} lagi main dengan yang lain`)
})

socket.on('update room', (rooms) => {
	AllRooms = rooms.map(room => room.name);
})