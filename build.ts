const utils = require("@appspltfrm/stencil-dev-utils");

/**
 * List of modules, the order is important as some modules are required by other!
 */
const modules = [
    "utils",

    "forms",
    "forms/TooltipErrorPresenter",

    "Loading",
    ["Toolbar", ["WidthBreakpoints"]],

    "Dialog",
    "ContextMenu",
    "Select",
    "Popover",
    "Block",
    "Card",
    ["DateTimeInput", ["Select"]],
    "Dragula",
    "ExpandingSearchbar",
    "Input",
    "InputGroup",
    "LazyLoad",
    "LoadingSkeleton",
    ["MasonryGrid", ["WidthBreakpoints"]],
    "Router",
    "Searchbar",
    "styles",
    "Svg",
    "TagsInput",
    "ToggleLabels",
    "Toggle",
    "Textarea",
    "DataTable",
    "Swiper",
    "VirtualScroller",
    "Checkbox",
    ["WidthBreakpoints", ["utils"]],
    ["Grid", ["WidthBreakpoints"]],

    "LinkEditor",
    "HtmlEditor",
];

(async () => {

    const targetModule = process.argv.length === 3 && process.argv[2].trim();

    await utils.buildModules(modules, targetModule ? [targetModule] : undefined);

})();
