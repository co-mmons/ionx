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
            dir: "../../dist/Grid",
            autoDefineCustomElements: true,
            externalRuntime: true,
            includeGlobalScripts: false,
            empty: true
        }
    ],
    rollupPlugins: {
        before: [externalsRollupBeforePlugin([...defaultExternals, /ionx\/(?!modules\/Grid)/])],
        after: [generateModuleBundle(/ionx-grid*/)]
    }
};
