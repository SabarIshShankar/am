const socket = require('socket.io')
const http = require('http')
const uuid = require('uuid')

const {verifyJwt} = require('../config/jwt')
const {createMeet, addMember} = require('../utils/meets');
const {addMessage} = require('../utils/messages')

const attachWebSockets = app => {
	const server = http.createServer(app);
	const io = socket(server)

	io.on("connection", (socket) => {
		socket.on("start meet", async(jwtFromClient) => {
			try{
				const {id, name} = await verifyJwt(jwtFromClient)
				const roomId = uuid.v4()
				socket.roomID = roomID
				socket.isHost = true
				socket.userName = name
				socket.join(roomId)
				io.to(socket.id).emit("roomID", roomID)
				createMeet({
					roomID,
					hostID: id
				})
				console.log("start meet", socket.id)
			} catch(err){
				if(err.name === 'JsonWebTokenError'){
					socket.emit("unauthorized", "login again")
					return
				}
				socket.emit("o", "try again" )
			}
		})
		socket.on("join room", async({roomID, jwtFromClient}) => {
			try{
				const {id, name} = await verifyJwt(jwtFromClient)
				if(!uuid.validate(roomID)){
					socket.emit("invalid room")
					return;
				}
				const roomData = io.sockets.adapter.room[roomID]
				if(!roomData){
					socket.emit("invalid room")
					return;
				}
				if(roomData.length > 100){
					socket.emit("room full")
					return;
				}
				socket.roomID = roomID
				socket.userName = name
				const usersInThisRoom1 = []
				for(let key in roomData.sockets){
					console.log(io.sockets.connected[key].userName)
					console.log(key.userName)
					userInThisRoom1.push({
						id: key,
						username: io.sockets.connected[key].userName
					})
				}
				const usersInThisRoom = Object.keys(roomData.sockets)
				socket.join(roomID)
				console.log("all members", usersInThisRoom)
				io.to(socket.id).emit("all members", usersInThisRoom1);
				addMember({
					roomID, 
					userID: id
				})
				console.log("join room", roomID, socket.id)
			}
			catch(err){
				console.log(err)
				if(err.name === 'JsonWebTokenError'){
					socket.emit("unauthorized", "please login again")
					return
				}
				socket.emit("n", "try again")
			}
		})

		socket.on("sending signal", payload => {
			io.to(payload.userToSignal).emit('User joined', {signal:
			payload.signal,
			id: payload.callerID,
			username: socket.userName});
		});

	})
}

module.exports = attachWebSockets;