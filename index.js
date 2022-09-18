 const http =  require("http");
 const express = require("express")
 const cors = require("cors")
 const socketID = require("socket.io")

 const app=express();
 const port=process.env.PORT;


const users=[{}];


 app.use(cors())
 app.get("/",(req,res)=>{
    res.send("hell its working")
 })

 const server = http.createServer(app);
 const io=socketID(server)
  
 io.on("connection",(socket)=>{
    console.log("New connection")
    socket.on('joined',({user})=>{
         users[socket.id]= user;
        console.log(`${user} has Joined the chat`)
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`})
        socket.emit('welcome',{user:'Admin',message :`${users[socket.id]} has Joined the chat`})
      })
   socket.on('message',({message,id})=>{
      console.log()
      io.emit('sendMessage',{user:users[id],message,id})
   })  
   socket.on('disconnect',()=>{
      socket.broadcast.emit('leave',{user:"Admin" , message:"user left"})
      console.log('user Left the chat')
   })


    
 })

 server.listen(port,()=>{
    console.log(`server is working on http://localhost:${port}`);
 })