const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw { name: "Unauthorized", message: "Authentication required" };
		}

		const token = authHeader.split(" ")[1];
		const decoded = verifyToken(token);

		const user = await User.findByPk(decoded.id);

		if (!user) {
			throw { name: "Unauthorized", message: "User not found" };
		}

		req.user = {
			id: user.id,
			email: user.email,
			username: user.username,
		};

		next();
	} catch (error) {
		if (
			error.name === "JsonWebTokenError" ||
			error.name === "TokenExpiredError"
		) {
			next({ name: "Unauthorized", message: "Invalid or expired token" });
		} else {
			next(error);
		}
	}
};

module.exports = authentication;
