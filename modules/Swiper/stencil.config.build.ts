import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../defaultExternals";
import {externalsRollupBeforePlugin} from "../externalsRollupBeforePlugin";
import {generateModuleBundle} from "../generateModuleBundle";
import {intlMessagesLoaderGeneratorPlugin} from "../intlMessagesLoaderGeneratorPlugin";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass(), intlMessagesLoaderGeneratorPlugin()],
    tsconfig: "tsconfig.build.json",
    outputTargets: [
        {type: "docs-readme"},
        {
            type: "dist-custom-elements",
            autoDefineCustomElements: true,
            externalRuntime: true,
            dir: "../../dist/Swiper",
            includeGlobalScripts: false,
            empty: true
        }
        // {
        //     type: "dist-custom-elements-bundle",
        //     dir: "../../dist/Swiper",
        //     includeGlobalScripts: false,
        //     defineFunctionName: "defineIonxSwiper",
        //     empty: true
        // }
    ],
    rollupPlugins: {
        before: [externalsRollupBeforePlugin([...defaultExternals, "swiper", /ionx\/(?!modules\/Swiper)/])],
        after: [generateModuleBundle({defineFunctionName: "defineIonxSwiper", elements: [/ionx-swiper*/]})]
    }
};
