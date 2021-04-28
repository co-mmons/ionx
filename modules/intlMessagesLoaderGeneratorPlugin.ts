import {readdirSync} from "fs";

export function intlMessagesLoaderGeneratorPlugin(jsonPath: string = "src/intl", loaderPath: string = "src/intl/loadIntlMessages.ts") {
    return {
        name: "intlMessagesLoaderGenerator",
        transform: (_sourceText: string, sourcePath: string) => {
            if (sourcePath.endsWith(loaderPath)) {
                const locales = readdirSync(jsonPath).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""));
                return _sourceText.replace(/(switch \(locale\) \{)/, "$1" + locales.map(locale => `case "${locale}": return (await import("./${locale}.json")).default;\n`).join(""));
            }
        }
    }
}
