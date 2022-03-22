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
            defineFunctionName: "defineIonxHtmlEditor",
            includeGlobalScripts: false,
            autoDefineCustomElements: true,
            dir: "../../dist/HtmlEditor",
            external: [...defaultExternals, "orderedmap", /prosemirror-+/, /ionx\/(?!modules\/HtmlEditor)/],
            empty: true
        }
    ]
};
