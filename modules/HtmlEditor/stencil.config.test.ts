import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {intlMessagesLoaderGeneratorPlugin} from "../intlMessagesLoaderGeneratorPlugin";
import {resolveIonxPlugin} from "../resolveIonxPlugin";
import nodePolyfills from "rollup-plugin-node-polyfills";

export const config: Config = {
    namespace: "App",
    plugins: [sass(), intlMessagesLoaderGeneratorPlugin()],
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
        before: [resolveIonxPlugin()],
        after: [nodePolyfills()]
    }
}

