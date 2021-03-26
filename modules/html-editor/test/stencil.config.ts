import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {resolveIonxPlugin} from "../../resolveIonxPlugin";

export const config: Config = {
    namespace: "App",
    plugins: [sass()],
    devServer: {
        openBrowser: false,
        reloadStrategy: "pageReload",
        port: 9001
    },
    outputTargets: [
        {type: "www", serviceWorker: null, baseUrl: "/"}
    ],
    rollupPlugins: {
        before: [resolveIonxPlugin()]
    }
}

