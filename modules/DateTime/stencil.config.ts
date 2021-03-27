import {Config} from "@stencil/core";
import {sass} from "@stencil/sass";

export const config: Config = {
    namespace: "ionx",
    plugins: [sass()],
    outputTargets: [
        {
            type: "dist-custom-elements-bundle",
            dir: "../../dist/DateTime",
            external: [/@ionic\/.*/, "ionicons", /@co.mmons\/.*/, /@stencil\/.*/, /ionx\/(?!modules\/DateTime)/],
            empty: true,
            includeGlobalScripts: false
        }
    ]
};
