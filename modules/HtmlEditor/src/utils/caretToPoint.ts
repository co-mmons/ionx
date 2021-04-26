export function caretTopPoint(): {left: number, top: number} {

    const selection = document.getSelection();
    const range0 = selection.getRangeAt(0);

    let rect: {left: number, top: number};
    let range: Range;

    // supposed to be textNode in most cases
    // but div[contenteditable] when empty
    const node = range0.startContainer as Element;

    const offset = range0.startOffset;
    if (offset > 0) {

        // new range, don't influence DOM state
        range = document.createRange();
        range.setStart(node, (offset - 1));
        range.setEnd(node, offset);

        // https://developer.mozilla.org/en-US/docs/Web/API/range.getBoundingClientRect
        // IE9, Safari?(but look good in Safari 8)
        rect = range.getBoundingClientRect();

        return {left: rect["right"], top: rect.top};

    } else if (offset < node["length"]) {

        range = document.createRange();
        // similar but select next on letter
        range.setStart(node, offset);
        range.setEnd(node, (offset + 1));
        rect = range.getBoundingClientRect();

        return {left: rect.left, top: rect.top};

    } else {
        // textNode has length

        // https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
        rect = node.getBoundingClientRect();
        const styles = getComputedStyle(node);
        const lineHeight = parseInt(styles.lineHeight);
        const fontSize = parseInt(styles.fontSize);

        // roughly half the whitespace... but not exactly
        const delta = (lineHeight - fontSize) / 2;

        return {left: rect.left, top: (rect.top + delta)};
    }

}
