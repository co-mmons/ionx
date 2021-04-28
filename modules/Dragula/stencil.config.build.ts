import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../defaultExternals";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    outputTargets: [
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/Dragula",
            defineFunctionName: "defineIonxDragula",
            external: [
                ...defaultExternals,
                /ionx\/(?!modules\/Dragula)/
            ],
            empty: true,
            includeGlobalScripts: false
        }
    ]
};
