const config = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "scope-enum": [2, "always", ["api", "web", "shared"]],
    },
};

export default config;