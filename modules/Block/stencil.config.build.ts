import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../defaultExternals";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    outputTargets: [
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/Block",
            empty: true,
            includeGlobalScripts: false,
            defineFunctionName: "defineIonxBlock",
            external: [
                ...defaultExternals,
                /ionx\/(?!modules\/Block)/
            ],

        }
    ]
};
