const request = require("supertest");
const app = require("../index");
const { sequelize, User, Project } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

let access_token;
let other_access_token;
let userId;
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
	userId = user.id;

	// Create a second user for Forbidden tests
	const otherUser = await User.create({
		username: "othertaskuser",
		email: "othertask@example.com",
		password: hashPassword("password123"),
	});

	other_access_token = generateToken({
		id: otherUser.id,
		email: otherUser.email,
	});

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
				assignedTo: userId,
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
				assignedTo: userId,
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

describe("PUT /projects/:projectId/tasks/:id", () => {
	test("should update a task successfully", async () => {
		const response = await request(app)
			.put(`/api/projects/${projectId}/tasks/${taskId}`)
			.set("Authorization", `Bearer ${access_token}`)
			.send({
				title: "Updated Task Title",
				description: "Updated task description",
				status: "in_progress",
				priority: "low",
			});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Task updated successfully",
		);
		expect(response.body.data).toHaveProperty("title", "Updated Task Title");
		expect(response.body.data).toHaveProperty("status", "in_progress");
		expect(response.body.data).toHaveProperty("priority", "low");
	});

	test("should return 404 for non-existent task", async () => {
		const response = await request(app)
			.put(`/api/projects/${projectId}/tasks/9999`)
			.set("Authorization", `Bearer ${access_token}`)
			.send({ title: "Ghost Task" });

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Task not found");
	});

	test("should return 403 when updating task in another user's project", async () => {
		const response = await request(app)
			.put(`/api/projects/${projectId}/tasks/${taskId}`)
			.set("Authorization", `Bearer ${other_access_token}`)
			.send({ title: "Hijacked Task" });

		expect(response.status).toBe(403);
		expect(response.body).toHaveProperty(
			"message",
			"You are not authorized to access this project",
		);
	});

	test("should return 404 when project does not exist", async () => {
		const response = await request(app)
			.put(`/api/projects/9999/tasks/${taskId}`)
			.set("Authorization", `Bearer ${access_token}`)
			.send({ title: "Orphan Task" });

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Project not found");
	});
});

describe("DELETE /projects/:projectId/tasks/:id", () => {
	test("should return 403 when deleting task in another user's project", async () => {
		const response = await request(app)
			.delete(`/api/projects/${projectId}/tasks/${taskId}`)
			.set("Authorization", `Bearer ${other_access_token}`);

		expect(response.status).toBe(403);
		expect(response.body).toHaveProperty(
			"message",
			"You are not authorized to access this project",
		);
	});

	test("should delete a task successfully", async () => {
		const response = await request(app)
			.delete(`/api/projects/${projectId}/tasks/${taskId}`)
			.set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Task deleted successfully",
		);
	});

	test("should return 404 for already deleted task", async () => {
		const response = await request(app)
			.delete(`/api/projects/${projectId}/tasks/${taskId}`)
			.set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Task not found");
	});
});
