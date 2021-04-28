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
            dir: "../../dist/Svg",
            defineFunctionName: "defineIonxSvg",
            includeGlobalScripts: false,
            external: [...defaultExternals, /ionx\/(?!modules\/Svg)/],
            empty: true
        }
    ]
};
