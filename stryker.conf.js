
module.exports = function(config) {
    config.set({
        files: [
            "test/**/*.ts",
            "src/**/*.ts"
        ],
        testRunner: "mocha",
        mutator: "typescript",
        transpilers: ["typescript"],
        reporters: ["clear-text", "progress", "html"],
        testFramework: "mocha",
        coverageAnalysis: "perTest",
        tsconfigFile: "tsconfig.json",
        thresholds: { high: 90, low: 70, break: 90 },
        mutate: [
            "src/**/*.ts",
            "!src/Application.ts",
            "!src/inversify.config.ts",
        ],
        mochaOptions: {
            files: [ 'build/test/**/*Test.js' ],
            ui: 'bdd',
            timeout: 3000
        }
    });
};