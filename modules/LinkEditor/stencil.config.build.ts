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
            defineFunctionName: "defineIonxLinkEditor",
            dir: "../../dist/LinkEditor",
            includeGlobalScripts: false,
            external: [
                ...defaultExternals,
                /ionx\/(?!modules\/LinkEditor)/
            ],
            empty: true
        }
    ]
};
