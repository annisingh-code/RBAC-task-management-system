const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Please enter all details" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        // hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ msg: "User registered successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Login an existing user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all details" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist, please sign up" });
        }

        // don't let inactive users log in
        if (user.status === "inactive") {
            return res.status(403).json({ msg: "Your account has been deactivated. Contact admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password credentials" });
        }

        const authToken = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            msg: "Login successful",
            token: authToken,
            user: { id: user._id, name: user.username }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { signUp, login };
