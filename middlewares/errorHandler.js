const errorHandler = (err, req, res, next) => {
	let statusCode = 500;
	let message = "Internal Server Error";

	switch (err.name) {
		case "SequelizeValidationError":
		case "SequelizeUniqueConstraintError":
			statusCode = 400;
			message = err.errors.map((e) => e.message);
			break;
		case "BadRequest":
			statusCode = 400;
			message = err.message;
			break;
		case "Unauthorized":
			statusCode = 401;
			message = err.message;
			break;
		case "Forbidden":
			statusCode = 403;
			message = err.message;
			break;
		case "NotFound":
			statusCode = 404;
			message = err.message;
			break;
		default:
			console.error("Unhandled Error:", err);
			break;
	}

	res.status(statusCode).json({ message });
};

module.exports = errorHandler;
