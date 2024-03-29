import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../defaultExternals";
import {intlMessagesLoaderGeneratorPlugin} from "../intlMessagesLoaderGeneratorPlugin";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass(), intlMessagesLoaderGeneratorPlugin()],
    tsconfig: "tsconfig.build.json",
    outputTargets: [
        {type: "docs-readme"},
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/forms",
            defineFunctionName: "defineIonxForms",
            includeGlobalScripts: false,
            autoDefineCustomElements: true,
            external: [
                "scroll-into-view",
                ...defaultExternals,
                /ionx\/(?!modules\/forms)/
            ],
            empty: true
        }
    ]
};
