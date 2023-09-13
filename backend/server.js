const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/UserRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(chats);
});

app.use("/api/user", userRoutes);

// chats routes

app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// app.get("/api/chats", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chats/:id", (req, res) => {
//   const finding = chats.find(chat => chat._id === req.params.id);
//   res.send(finding);
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", socket => {
  console.log("connected socket io");
  socket.on("setup", userData => {
    console.log("connected", userData._id);

    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", room => {
    socket.join(room);
    console.log("connected room", room);
  });

  socket.on("typing", room => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", room => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", newMessage => {
    var chat = newMessage.chat;
    if (!chat.users) return;
    chat.users.forEach(user => {
      if (user._id == newMessage.sender._id) return;

      socket.in(user._id).emit("message received", newMessage);
    });
  });
  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
