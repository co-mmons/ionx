interface GenerateModuleBundleParams {

    /**
     * Nazwy tagów, które mają być włączone do paczki.
     */
    elements: Array<string | RegExp>;

    /**
     * Nazwa funkcji definiującej elementy, jeżeli definiowanie nie
     * jest automatyczne (czyli gdy nie korzystamy z opcji autoDefineCustomElements w dist-custom-elements).
     *
     * Uwaga: jeżeli funkcja ma być wygenerowana to w index.ts musimy zadeklarować taką funkcję, np:
     * <code>export declare function defineIonxComponent()</code>
     */
    defineFunctionName?: string;
}

export function generateModuleBundle(params: GenerateModuleBundleParams);

export function generateModuleBundle(...elements: Array<string | RegExp>);

/**
 * Plugin rollup'a, który powinien byc dodany w stencil.config.build.ts w rollupPlugins.after, a który
 * umożliwia wykesportowanie głównych komponentów modułu w index.js, czyli coś na kształt custom-elements-bundle.
 */
export function generateModuleBundle() {

    const params: GenerateModuleBundleParams = typeof arguments[0] === "string" || arguments[0] instanceof RegExp ? {elements: Array.prototype.slice.call(arguments)} : arguments[0];

    return {
        id: "moduleBundle",
        generateBundle(_options: any, bundle: {[file: string]: {code: string}}) {

            const index = bundle["index.js"];

            let code = index.code;

            const elemClass: {tagName: string, className: string}[] = [];

            const tagNames: string[] = [];
            for (const elem of params.elements) {
                if (typeof elem === "string") {
                    tagNames.push(elem);
                } else if (elem instanceof RegExp) {
                    for (const fileName of Object.keys(bundle)) {
                        if (fileName.match(elem)) {
                            tagNames.push(fileName.replace(".js", ""));
                        }
                    }
                }
            }

            for (const tagName of tagNames) {
                const className = tagName.split("-").map(segment => `${segment[0].toUpperCase()}${segment.substring(1)}`).join("");
                code += `\nimport {${className}} from "./${tagName}";`;
                elemClass.push({tagName, className});
            }

            if (params.defineFunctionName) {
                code += `\nexport function ${params.defineFunctionName}() {`;
            } else {
                code += `\n(function() {`;
            }

            code += `\n\tif (typeof customElements === "undefined") { return; }`;
            code += `\n\t[${elemClass.map(elem => `{tagName: "${elem.tagName}", clazz: ${elem.className}}`).join(", ")}].forEach(elem => {`;
            code += `\n\t\tif (!customElements.get(elem.tagName)) { customElements.define(elem.tagName, elem.clazz) }`;
            code += `\n\t});\n}`;

            if (!params.defineFunctionName) {
                code += `\n)();`;
            }

            index.code = code;
        }
    }
}
