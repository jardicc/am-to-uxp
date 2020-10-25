module.exports = (wallaby) => {

	return {
		files: [
			"src/*.ts",

			"!node_modules/**/*",
		],

		tests: [
			"tests/*.test.ts",
		],
		
		env: {
			type: "node",
			runner: "node"
		},
		testFramework: "jest"
	};
};