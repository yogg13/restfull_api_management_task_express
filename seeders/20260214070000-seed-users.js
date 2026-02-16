"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const hashedPassword = await bcrypt.hash("password123", 10);

		await queryInterface.bulkInsert("Users", [
			{
				id: 1,
				username: "yoga",
				email: "yoga@gmail.com",
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 2,
				username: "pratama",
				email: "pratama@gmail.com",
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 3,
				username: "bob_wilson",
				email: "bob@example.com",
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Users", null, {});
	},
};
