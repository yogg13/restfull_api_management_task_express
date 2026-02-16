"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("Projects", [
			{
				id: 1,
				name: "Website Redesign",
				description: "Redesign company website with new branding",
				status: "active",
				userId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 2,
				name: "Mobile App Development",
				description: "Build a cross-platform mobile application",
				status: "active",
				userId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 3,
				name: "API Integration",
				description: "Integrate third-party APIs into existing system",
				status: "active",
				userId: 3,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Projects", null, {});
	},
};
