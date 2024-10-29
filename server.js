const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io with the server

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");
    
    // Listen for incoming chat messages
    socket.on("chat message", (msg) => {
        console.log("Message received: ", msg); // Log the message to the server console
        io.emit("chat message", msg); // Broadcast message to all connected clients
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
