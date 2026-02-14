const request = require("supertest");
const app = require("../index");
const { sequelize, User, Project } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

let access_token;
let projectId;
let taskId;

beforeAll(async () => {
	await sequelize.sync({ force: true });

	// Create a test user
	const user = await User.create({
		username: "taskuser",
		email: "task@example.com",
		password: hashPassword("password123"),
	});

	access_token = generateToken({ id: user.id, email: user.email });

	// Create a test project
	const project = await Project.create({
		name: "Task Test Project",
		description: "Project for testing tasks",
		userId: user.id,
	});

	projectId = project.id;
});

afterAll(async () => {
	await sequelize.close();
});

describe("POST /projects/:projectId/tasks", () => {
	test("should create a new task successfully", async () => {
		const response = await request(app)
			.post(`/api/projects/${projectId}/tasks`)
			.set("Authorization", `Bearer ${access_token}`)
			.send({
				title: "Test Task",
				description: "A test task description",
				priority: "high",
				dueDate: "2026-03-01",
			});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty(
			"message",
			"Task created successfully",
		);
		expect(response.body.data).toHaveProperty("id");
		expect(response.body.data).toHaveProperty("title", "Test Task");
		expect(response.body.data).toHaveProperty("status", "todo");
		expect(response.body.data).toHaveProperty("priority", "high");

		taskId = response.body.data.id;
	});

	test("should fail without authentication", async () => {
		const response = await request(app)
			.post(`/api/projects/${projectId}/tasks`)
			.send({
				title: "Unauthorized Task",
			});

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("message");
	});

	test("should fail without task title", async () => {
		const response = await request(app)
			.post(`/api/projects/${projectId}/tasks`)
			.set("Authorization", `Bearer ${access_token}`)
			.send({
				description: "Missing title",
			});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message");
	});
});

describe("GET /projects/:projectId/tasks", () => {
	test("should get all tasks for a project", async () => {
		const response = await request(app)
			.get(`/api/projects/${projectId}/tasks`)
			.set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Tasks retrieved successfully",
		);
		expect(Array.isArray(response.body.data)).toBe(true);
		expect(response.body.data.length).toBeGreaterThan(0);
	});

	test("should fail without authentication", async () => {
		const response = await request(app).get(`/api/projects/${projectId}/tasks`);

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("message");
	});
});

describe("GET /projects/:projectId/tasks/:id", () => {
	test("should get task by id", async () => {
		const response = await request(app)
			.get(`/api/projects/${projectId}/tasks/${taskId}`)
			.set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Task retrieved successfully",
		);
		expect(response.body.data).toHaveProperty("id", taskId);
		expect(response.body.data).toHaveProperty("title", "Test Task");
	});

	test("should return 404 for non-existent task", async () => {
		const response = await request(app)
			.get(`/api/projects/${projectId}/tasks/9999`)
			.set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Task not found");
	});
});
