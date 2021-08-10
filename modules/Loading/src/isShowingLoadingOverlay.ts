export function isShowingLoadingOverlay() {
    return document.getElementsByClassName("ionx-loading-overlay").length > 0 || document.getElementsByClassName(".ionx-loading-popover").length > 0;
}
