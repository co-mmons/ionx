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
            defineFunctionName: "defineIonxHtmlEditor",
            includeGlobalScripts: false,
            dir: "../../dist/HtmlEditor",
            external: [/@ionic\/.*/, "ionicons", /@co.mmons\/.*/, /@stencil\/.*/, /ionx\/(?!modules\/HtmlEditor)/],
            empty: true
        }
    ]
};
