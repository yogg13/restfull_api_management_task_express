"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const hashedPassword = await bcrypt.hash("password123", 10);

		await queryInterface.bulkInsert("Users", [
			{
				username: "yoga",
				email: "yoga@gmail.com",
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				username: "pratama",
				email: "pratama@gmail.com",
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
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
