import {Config} from "@stencil/core";
import {defaultExternals} from "../defaultExternals";
import {defaultStencilPlugins} from "../defaultStencilPlugins";
import {customElementsBundlePlugin, externalsPlugin} from "@appspltfrm/stencil-dev-utils";

export const config: Config = {
    namespace: "ionx",
    plugins: defaultStencilPlugins(),
    tsconfig: "tsconfig.build.json",
    outputTargets: [
        {type: "docs-readme"},
        {
            type: "dist-custom-elements",
            dir: "../../dist/VirtualScroller",
            autoDefineCustomElements: true,
            externalRuntime: true,
            includeGlobalScripts: false,
            empty: true
        }
    ],
    rollupPlugins: {
        before: [externalsPlugin([...defaultExternals, /ionx\/(?!modules\/VirtualScroller)/])],
        after: [customElementsBundlePlugin("ionx-virtual-scroller")]
    }
};
