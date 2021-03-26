import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";

export const config: Config = {
    namespace: "App",
    devServer: {
        openBrowser: false,
        reloadStrategy: "pageReload",
        port: 9001
    },
    // globalScript: "src/test/global.ts",
    // globalStyle: "src/test/styles/global.scss",
    plugins: [sass()],
    outputTargets: [
        {type: "www", serviceWorker: null, baseUrl: "/"}
    ],
};
