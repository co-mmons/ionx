import {Config} from "@stencil/core";
import {defaultStencilPlugins} from "../defaultStencilPlugins";
import {resolveIonxPlugin} from "../resolveIonxPlugin";

export const config: Config = {
    namespace: "App",
    plugins: defaultStencilPlugins(),
    srcIndexHtml: "src/test/index.html",
    globalScript: "src/test/global.ts",
    globalStyle: "src/test/global.scss",
    devServer: {
        openBrowser: false,
        reloadStrategy: "pageReload",
        port: 9001
    },
    outputTargets: [
        {
            type: "www",
            serviceWorker: null,
            baseUrl: "/",
            copy: [
            ]
        }
    ],
    rollupPlugins: {
        before: [resolveIonxPlugin()]
    }
}

