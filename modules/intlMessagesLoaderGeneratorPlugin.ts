export function intlMessagesLoaderGeneratorPlugin(loaderPath: string = "src/intl/intlMessagesLoader.ts") {
    return {
        name: "intlMessagesLoaderGenerator",
        transform: (_sourceText: string, sourcePath: string) => {
            if (sourcePath.endsWith(loaderPath)) {
                const locales = ["pl"];
                return _sourceText.replace(/(switch \(locale\) \{)/, "$1" + locales.map(locale => `case "${locale}": return (await import("./${locale}.json")).default;\n`).join(""));
            }
        }
    }
}
