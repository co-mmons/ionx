const cli = require("child_process");
const path = require("path");

/**
 * List of modules, the order is important as some modules are required by other!
 */
const modules = [
    "utils",

    "Dialog",
    "Select",
    "Popover",
    "Block",
    "Card",
    "DateTime",
    "Dragula",
    "ExpandingSearchbar",
    "Input",
    "InputGroup",
    "LazyLoad",
    "Loading",
    "LoadingSkeleton",
    "MasonryGrid",
    "Router",
    "Searchbar",
    "styles",
    "Svg",
    "TagsInput",
    "Textarea",

    "forms",
    "forms/TooltipErrorPresenter",

    "LinkEditor",
    "HtmlEditor",
];

(async () => {

    try {
        const targetModule = process.argv.length === 3 && process.argv[2].trim();

        for (const module of modules) {

            if (!targetModule || module === targetModule) {
                console.log(`--- ${module} ---`);
                cli.execSync(`npm run build`, {cwd: path.resolve("modules", module), stdio: "inherit"});
            }
        }

    } catch (error) {
        console.error(error);
        process.exit(0);
    }

})();
