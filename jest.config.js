
module.exports = {
	verbose: true,
	automock: false,
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	testRegex: "(/tests/.*(\\.|/)(test|spec))\\.(tsx?)$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleDirectories: ["node_modules", "src"],
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
	],
	globals: {
		"ts-jest": {
			tsConfig: "jest-tsconfig.json"
		}
	}
};