const express = require("express");
const session = require("express-session");
const router = require("./routers");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

app.use(
	session({
		secret: "service-api-secret-key",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
	}),
);

// Routes
app.use("/api", router);

// Error Handler
app.use(errorHandler);

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Service API listening on http://localhost:${port}`);
	});
}

module.exports = app;
