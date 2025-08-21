require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Middle ware
app.use(express.json());  
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const MessageSchema = new mongoose.Schema({
  text: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Message = mongoose.model("Message", MessageSchema);

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(404).json({ message: "User not found" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// **Signup Route**
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// **Login Route**
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ 
      token, 
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new message
app.post("/messages", authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    
    const newMessage = new Message({
      text,
      sender: req.user._id
    });

    await newMessage.save();
    
    // Populate sender info in the response
    const messageWithSender = await Message.findById(newMessage._id).populate('sender', 'name email');
    
    res.status(201).json(messageWithSender);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Error creating message" });
  }
});

// Get all messages for the authenticated user
app.get("/messages", authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email');
      
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Get a specific message
app.get("/messages/:id", authenticate, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      sender: req.user._id
    }).populate('sender', 'name email');

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Error fetching message" });
  }
});

// Delete a message
app.delete("/messages/:id", authenticate, async (req, res) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      sender: req.user._id
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Error deleting message" });
  }
});

// app.use('/api/researchpaper', require('./routes/researchpaper'));
// app.use('/api/chat',         require('./routes/chat'));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));