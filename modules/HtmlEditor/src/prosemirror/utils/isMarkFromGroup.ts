import {MarkSpec, MarkType} from "prosemirror-model";

export function isMarkFromGroup(mark: MarkSpec | MarkType, groupName: string) {

    if (mark instanceof MarkType) {
        mark = mark.spec;
    }

    return mark.group && mark.group.split(" ").includes(groupName);
}
