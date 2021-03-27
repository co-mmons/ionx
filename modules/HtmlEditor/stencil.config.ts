import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    outputTargets: [
        {type: "docs-readme"},
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/HtmlEditor",
            external: [/ionx\/(?!modules\/HtmlEditor)/],
            empty: true
        }
    ]
};
