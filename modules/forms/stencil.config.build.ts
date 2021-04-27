import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
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
            external: [
                "fast-equals",
                "ionicons",
                "rxjs",
                "scroll-into-view",
                "ts-error",
                /@co.mmons\/.*/,
                /@ionic\/.*/,
                /@stencil\/.*/,
                /ionx\/(?!modules\/forms)/
            ],
            empty: true
        }
    ]
};
