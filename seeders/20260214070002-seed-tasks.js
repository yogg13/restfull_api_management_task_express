"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("Tasks", [
			{
				title: "Design Homepage Mockup",
				description: "Create wireframe and mockup for the new homepage",
				status: "in_progress",
				priority: "high",
				dueDate: new Date("2026-03-01"),
				projectId: 1,
				assignedTo: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Setup CI/CD Pipeline",
				description: "Configure continuous integration and deployment",
				status: "todo",
				priority: "medium",
				dueDate: new Date("2026-03-15"),
				projectId: 1,
				assignedTo: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Develop Login Screen",
				description: "Implement login screen for mobile app",
				status: "todo",
				priority: "high",
				dueDate: new Date("2026-02-28"),
				projectId: 2,
				assignedTo: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Write API Documentation",
				description: "Document all API endpoints using Swagger",
				status: "done",
				priority: "low",
				dueDate: new Date("2026-02-20"),
				projectId: 3,
				assignedTo: 3,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Payment Gateway Integration",
				description: "Integrate Stripe payment gateway",
				status: "todo",
				priority: "high",
				dueDate: null,
				projectId: 3,
				assignedTo: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Tasks", null, {});
	},
};
