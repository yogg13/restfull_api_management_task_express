const { User } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserController {
	static async register(req, res, next) {
		try {
			const { username, email, password } = req.body;

			const hashedPassword = hashPassword(password);

			const user = await User.create({
				username,
				email,
				password: hashedPassword,
			});

			res.status(201).json({
				message: "User registered successfully",
				data: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	static async login(req, res, next) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw {
					name: "BadRequest",
					message: "Email and password are required",
				};
			}

			const user = await User.findOne({ where: { email } });

			if (!user) {
				throw { name: "Unauthorized", message: "Invalid email or password" };
			}

			const isValidPassword = comparePassword(password, user.password);

			if (!isValidPassword) {
				throw { name: "Unauthorized", message: "Invalid email or password" };
			}

			const token = generateToken({
				id: user.id,
				email: user.email,
			});

			res.status(200).json({
				message: "Login successful",
				access_token: token,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = UserController;
