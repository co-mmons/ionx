import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../defaultExternals";
import {externalsRollupBeforePlugin} from "../externalsRollupBeforePlugin";
import {generateModuleBundle} from "../generateModuleBundle";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    tsconfig: "tsconfig.build.json",
    outputTargets: [
        {type: "docs-readme"},
        {
            type: "dist-custom-elements",
            autoDefineCustomElements: true,
            externalRuntime: true,
            dir: "../../dist/Block",
            empty: true,
            includeGlobalScripts: false
        }
    ],
    rollupPlugins: {
        before: [externalsRollupBeforePlugin([...defaultExternals, /ionx\/(?!modules\/Block)/])],
        after: [generateModuleBundle({defineFunctionName: "defineIonxBlock", elements: ["ionx-block"]})]
    }
};
