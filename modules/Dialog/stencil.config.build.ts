import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    tsconfig: "tsconfig.build.json",
    outputTargets: [
        {type: "docs-readme"},
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/Dialog",
            defineFunctionName: "defineIonxDialog",
            external: [
                "ionicons",
                /@co.mmons\/.*/,
                /@ionic\/.*/,
                /@stencil\/.*/,
                /ionx\/(?!modules\/Dialog)/,
                /rxjs/
            ],
            empty: true
        }
    ]
};
