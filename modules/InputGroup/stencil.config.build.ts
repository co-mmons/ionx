import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";
import {defaultExternals} from "../defaultExternals";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    outputTargets: [
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/InputGroup",
            defineFunctionName: "defineIonxInputGroup",
            external: [
                ...defaultExternals,
                /ionx\/(?!modules\/InputGroup)/
            ],
            empty: true,
            includeGlobalScripts: false
        }
    ]
};
