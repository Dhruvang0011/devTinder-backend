const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectdb = require("./Config/database");
const User = require("./models/user");
const Message = require("./models/message");
const Conversation = require("./models/conversation")

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const conversationRouter = require("./routes/conversationRouter");
const messageRouter = require("./routes/messageRouter");

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// If you want to use io in other files
module.exports = { io };

io.on("connection", (socket) => {
  socket.on("joinConversation", (conversationId) => {
  socket.join(conversationId);
  console.log(`User joined conversation: ${conversationId}`);
});


  // Join conversation room
  socket.on("sendMessage", async (data) => {
  try {
    const { conversationId, senderId, text } = data;

    if (!conversationId || !senderId || !text) return;

    // 1️⃣ Save message
    const message = await Message.create({
      conversationId,
      senderId,
      text,
    });

    // 2️⃣ Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageSender: senderId,
    });

    // 3️⃣ Emit to room
    io.to(conversationId).emit("receiveMessage", message);

  } catch (err) {
    console.error("Socket Error:", err);
  }
});


  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", conversationRouter);
app.use("/", messageRouter);


app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailID;
    const user = await User.findOne({ emailID: userEmail });

    if (!user) {
      return res.status(404).send("User Not Found !!");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("Something Went Wrong !!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something Went Wrong !!");
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const userId = req.body.UserId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User Not Found");
    }

    res.send("User Deleted Successfully !!");
  } catch (err) {
    res.status(400).send("Something Went Wrong !!");
  }
});


const PORT = process.env.PORT || 3000;

connectdb()
  .then(() => {
    console.log("✅ Database Connected Successfully...");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.error("❌ Database Connection Failed !!!");
  });
