const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors : {origin : '*'}})
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const port = 3001;
app.use(express.json());

app.use((req,res,next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	next();
})

app.use(cors());


server.listen(port, () => {
	console.log('server is running...')
})

// let users = [];
let users = {};

io.on('connection', (socket) => {

	console.log('user connected ' + socket.id);

	socket.on('join', (username) => {
		socket.join(username); //fungsi bawaaan socket untuk menambah user di server
		console.log(username + ' join to server');
		users[socket.id] = username;
	});

	socket.on("invite", (data) => {
		socket.to(data.invited).emit("invited", data);
	})

	socket.on('accept-invitation', (data) => {
		socket.to(data.inviter).emit('invitation-accapted', data)
	})

	socket.on('reject-invitation', (data) => {
		socket.to(data.inviter).emit('invitation-rejected', data)
	})

	socket.on('reject-invitation-already-have-opponent', (data) => {
		socket.to(data.inviter).emit('invitation-rejected-already-have-opponent', data)
	})

	socket.on('request-users-data', (data) => {
		io.emit('recieve-users-data', {users})
	})

	socket.on('send-first-configuration', (data) => {
		socket.to(data.reciever).emit('receive-first-configuration', data);
	})

	socket.on('send-key', (data) => {
		socket.to(data.reciever).emit('recieve-key', data);
	})

	socket.on('send-time-is-over', (data) => {
		socket.to(data.reciever).emit('receive-time-is-over');
	})

	socket.on("disconnect", (reason) => {
		delete users[socket.id]
	})

})


app.get('/:language/:word', async (req, res) => {
  let language = re.params.language;
  let word = req.params.word;
  let url;
  try {
  	if(language === 'ID') url = `https://kbbi.kemdikbud.go.id/entri/${word}`;
    if(language === 'EN') url = `https://www.dictionary.com/browse/${word}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });

    const $ = cheerio.load(data);
    const firstListItem = $('ol li').first().html();

    res.status(200).json({ definition : firstListItem });
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan scraping:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat melakukan scraping' });
  }
});