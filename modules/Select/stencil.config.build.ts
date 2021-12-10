import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../defaultExternals";

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
            external: ["sortablejs", ...defaultExternals, /ionx\/(?!modules\/Select)/],
            empty: true
        }
    ]
};
