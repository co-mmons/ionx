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
            dir: "../../dist/Select",
            defineFunctionName: "defineIonxSelect",
            includeGlobalScripts: false,
            external: [
                "dragula",
                "fast-equals",
                "ionicons",
                /@capacitor\/.*/,
                /@co.mmons\/.*/,
                /@ionic\/.*/,
                /@stencil\/.*/,
                /ionx\/(?!modules\/Select)/
            ],
            empty: true
        }
    ]
};
