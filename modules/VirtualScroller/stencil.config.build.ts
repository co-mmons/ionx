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
            dir: "../../dist/VirtualScroller",
            includeGlobalScripts: false,
            defineFunctionName: "defineIonxVirtualScroller",
            external: [
                ...defaultExternals,
                /ionx\/(?!modules\/VirtualScroller)/
            ],
            empty: true
        }
    ]
};
