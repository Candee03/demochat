import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routers/viewsRouter.js";

const app = express()
const messages = []

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.engine('handlebars', handlebars.engine())
app.set('views', 'views/')
app.set('view engine', 'handlebars')

app.use(express.static('public'))

//---------------------------
app.use('/', viewsRouter)

//-----------------------------
const httpServer = app.listen(8080, () => {
    console.log('esta escuchando el server 8080')
})
const io = new Server(httpServer)

io.on('connection', (socket)=> {
    console.log('nuevo cliente conectado');
    
    socket.emit('messages', messages);

	socket.on('new-message', (message) => {
        messages.push(message)
		io.emit('messages', messages);
	});

    socket.on('sayhello', (data) => {
		socket.broadcast.emit('connected', data);
	});
})


