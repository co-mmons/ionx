import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../defaultExternals";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    outputTargets: [
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/DateTime",
            defineFunctionName: "defineIonxDateTime",
            external: [
                ...defaultExternals,
                /ionx\/(?!modules\/DateTime)/
            ],
            empty: true,
            includeGlobalScripts: false
        }
    ]
};
