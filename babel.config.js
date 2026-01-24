module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        ],
        plugins: [
            // "nativewind/babel", <--- Remove this line
            "react-native-reanimated/plugin",
        ],
    };
};