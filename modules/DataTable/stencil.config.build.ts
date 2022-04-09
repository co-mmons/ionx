import {Config} from "@stencil/core";
import {defaultExternals} from "../defaultExternals";
import {defaultStencilPlugins} from "../defaultStencilPlugins";

export const config: Config = {
    namespace: "ionx",
    plugins: defaultStencilPlugins(),
    tsconfig: "tsconfig.build.json",
    outputTargets: [
        {type: "docs-readme"},
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/DataTable",
            defineFunctionName: "defineIonxDataTable",
            autoDefineCustomElements: true,
            includeGlobalScripts: false,
            external: [...defaultExternals, /ionx\/(?!modules\/DataTable)/],
            empty: true
        }
    ]
};
