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
            dir: "../../dist/Toolbar",
            includeGlobalScripts: false,
            defineFunctionName: "defineIonxToolbar",
            external: [
                ...defaultExternals,
                /ionx\/(?!modules\/Toolbar)/
            ],
            empty: true
        }
    ]
};
