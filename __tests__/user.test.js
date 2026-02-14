const request = require("supertest");
const app = require("../index");
const { sequelize, User } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

afterAll(async () => {
	await sequelize.close();
});

describe("POST /register", () => {
	test("should register a new user successfully", async () => {
		const response = await request(app).post("/api/register").send({
			username: "testuser",
			email: "test@example.com",
			password: "password123",
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty(
			"message",
			"User registered successfully",
		);
		expect(response.body.data).toHaveProperty("id");
		expect(response.body.data).toHaveProperty("username", "testuser");
		expect(response.body.data).toHaveProperty("email", "test@example.com");
		expect(response.body.data).not.toHaveProperty("password");
	});

	test("should fail with duplicate email", async () => {
		const response = await request(app).post("/api/register").send({
			username: "testuser2",
			email: "test@example.com",
			password: "password123",
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message");
	});

	test("should fail without required fields", async () => {
		const response = await request(app).post("/api/register").send({
			username: "",
			email: "",
			password: "",
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message");
	});
});

describe("POST /login", () => {
	test("should login successfully and return access_token", async () => {
		const response = await request(app).post("/api/login").send({
			email: "test@example.com",
			password: "password123",
		});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("message", "Login successful");
		expect(response.body).toHaveProperty("access_token");
		expect(typeof response.body.access_token).toBe("string");
	});

	test("should fail with wrong password", async () => {
		const response = await request(app).post("/api/login").send({
			email: "test@example.com",
			password: "wrongpassword",
		});

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty(
			"message",
			"Invalid email or password",
		);
	});

	test("should fail with non-existent email", async () => {
		const response = await request(app).post("/api/login").send({
			email: "nonexistent@example.com",
			password: "password123",
		});

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty(
			"message",
			"Invalid email or password",
		);
	});

	test("should fail without email and password", async () => {
		const response = await request(app).post("/api/login").send({});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty(
			"message",
			"Email and password are required",
		);
	});
});
