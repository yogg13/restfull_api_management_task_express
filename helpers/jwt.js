const jwt = require("jsonwebtoken");

const SECRET_KEY = "management-task-api-secret-key";

const generateToken = (payload) => {
	return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
};

const verifyToken = (token) => {
	return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
	