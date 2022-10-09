const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const config = {
	testEnvironment: "jest-environment-jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
