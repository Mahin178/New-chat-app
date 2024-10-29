const socket = io(); // Connect to the server

const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const messagesContainer = document.getElementById("messages");
const usersContainer = document.getElementById("users");
const usernameInput = document.getElementById("username-input");
const typingIndicator = document.getElementById("typing-indicator");
const notificationSound = new Audio('notification.mp3'); // Load the notification sound

let users = [];
let typingTimeout;

// Handle sending messages
sendButton.addEventListener("click", () => {
    const username = usernameInput.value.trim() || "Anonymous"; // Default name
    const message = messageInput.value.trim();
    if (message) {
        console.log("Sending message:", message);
        socket.emit("chat message", { user: username, message }); // Send both user and message
        messageInput.value = ""; // Clear the input
    }
});

// Listen for incoming messages from the server
socket.on("chat message", (data) => {
    console.log("Received message:", data);
    addMessage(data.user, data.message);
    notificationSound.play();
});

// Function to add messages to the chat
function addMessage(user, message) {
    const messageElement = document.createElement("div");
    const timestamp = new Date().toLocaleTimeString(); // Get current time
    messageElement.textContent = `${timestamp} - ${user}: ${message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}

// Handle the user list
socket.on("user list", (userList) => {
    usersContainer.innerHTML = ""; // Clear the existing list
    userList.forEach(user => {
        const userElement = document.createElement("li");
        userElement.textContent = user;
        usersContainer.appendChild(userElement);
    });
});

// Emit username on connection
socket.on("connect", () => {
    console.log("Connected to server");
    const username = usernameInput.value.trim() || "Anonymous"; // Default name
    socket.emit("add user", username);
});

// Handle typing events
messageInput.addEventListener("input", () => {
    socket.emit("typing");
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stop typing");
    }, 1000); // Stop typing after 1 second of inactivity
});

// Show typing indicator
socket.on("typing", (user) => {
    typingIndicator.textContent = `${user} is typing...`;
    typingIndicator.style.display = "block"; // Show the typing indicator
});

// Hide typing indicator
socket.on("stop typing", () => {
    typingIndicator.style.display = "none"; // Hide the typing indicator
});

// Handle user connection and disconnection
socket.on("connect", () => {
    const username = usernameInput.value.trim() || "Anonymous"; // Default name
    socket.emit("add user", username);
});

socket.on("disconnect", () => {
    console.log("A user disconnected");
});
