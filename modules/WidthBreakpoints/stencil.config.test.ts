import {resolveLocalModulePlugin} from "@appspltfrm/stencil-utils";
import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";

export const config: Config = {
    namespace: "App",
    plugins: [sass()],
    srcIndexHtml: "src/test/index.html",
    globalScript: "src/test/global.ts",
    globalStyle: "src/test/global.scss",
    devServer: {
        openBrowser: false,
        reloadStrategy: "pageReload",
        port: 9001
    },
    outputTargets: [
        {type: "www", serviceWorker: null, baseUrl: "/"}
    ],
    rollupPlugins: {
        before: [resolveLocalModulePlugin("ionx")]
    }
}

