const request = require("supertest");
const app = require("../index");
const { sequelize, User } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

let access_token;
let projectId;

beforeAll(async () => {
	await sequelize.sync({ force: true });

	// Create a test user
	const user = await User.create({
		username: "projectuser",
		email: "project@example.com",
		password: hashPassword("password123"),
	});

	access_token = generateToken({ id: user.id, email: user.email });
});

afterAll(async () => {
	await sequelize.close();
});

describe("POST /projects", () => {
	test("should create a new project successfully", async () => {
		const response = await request(app)
			.post("/api/projects")
			.set("Authorization", `Bearer ${access_token}`)
			.send({
				name: "Test Project",
				description: "A test project description",
			});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty(
			"message",
			"Project created successfully",
		);
		expect(response.body.data).toHaveProperty("id");
		expect(response.body.data).toHaveProperty("name", "Test Project");
		expect(response.body.data).toHaveProperty("status", "active");

		projectId = response.body.data.id;
	});

	test("should fail without authentication", async () => {
		const response = await request(app).post("/api/projects").send({
			name: "Unauthorized Project",
		});

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("message");
	});

	test("should fail without project name", async () => {
		const response = await request(app)
			.post("/api/projects")
			.set("Authorization", `Bearer ${access_token}`)
			.send({
				description: "Missing name",
			});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message");
	});
});

describe("GET /projects", () => {
	test("should get all projects for authenticated user", async () => {
		const response = await request(app)
			.get("/api/projects")
			.set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Projects retrieved successfully",
		);
		expect(Array.isArray(response.body.data)).toBe(true);
		expect(response.body.data.length).toBeGreaterThan(0);
	});

	test("should fail without authentication", async () => {
		const response = await request(app).get("/api/projects");

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("message");
	});
});

describe("GET /projects/:id", () => {
	test("should get project by id", async () => {
		const response = await request(app)
			.get(`/api/projects/${projectId}`)
			.set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Project retrieved successfully",
		);
		expect(response.body.data).toHaveProperty("id", projectId);
	});

	test("should return 404 for non-existent project", async () => {
		const response = await request(app)
			.get("/api/projects/9999")
			.set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Project not found");
	});
});
