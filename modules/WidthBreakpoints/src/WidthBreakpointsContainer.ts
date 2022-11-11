import {MediaBreakpoint} from "ionx/utils";
import {Observable, Subject} from "rxjs";
import {WidthBreakpoint} from "./WidthBreakpoint";

const reversedBreakpoints = WidthBreakpoint.values().reverse();

export interface WidthBreakpointChange {
    breakpoint: MediaBreakpoint;
    queries: string[];
}

export class WidthBreakpointsContainer {

    constructor(private readonly element: HTMLElement, private accessorName?: string) {
        this.connect();

        if (!this.accessorName) {
            this.accessorName = WidthBreakpointsContainer.defaultAccessorName;
        }
    }

    private changeObservable: Subject<WidthBreakpointChange>;

    get onBreakpointChange(): Observable<WidthBreakpointChange> {
        return this.changeObservable;
    }

    private observer: ResizeObserver;

    private resized() {

        const element = this.element;

        const page = this.element.closest(".ion-page");
        if (page && page.classList.contains("ion-page-hidden")) {
            return;
        }

        const style = element.style;
        const {width} = element.getBoundingClientRect();

        style.setProperty(`--${this.accessorName}`, `${width}px`);

        const oldQueries = element.getAttribute(this.accessorName);
        const queries: string[] = [];

        let breakpoint: MediaBreakpoint;

        for (const bp of reversedBreakpoints) {

            if (!breakpoint && width >= bp.minWidth) {
                breakpoint = bp;
                queries.push(`=${bp.name}`, `>=${bp.name}`, `<=${bp.name}`);
            } else if (width > bp.minWidth) {
                queries.push(`>=${bp.name}`, `>${bp.name}`);
            } else if (width < bp.minWidth) {
                queries.push(`<=${bp.name}`, `<${bp.name}`);
            }

            style.setProperty(`--${this.accessorName}-${bp.name}`, bp === breakpoint ? "\t" : "initial");
        }
        const newQueries = queries.join(" ");
        element.setAttribute(this.accessorName, newQueries);

        if (oldQueries !== newQueries) {
            this.changeObservable.next({breakpoint, queries})
        }
    }

    private connect() {

        if (this.observer) {
            return;
        }

        this.changeObservable = new Subject<WidthBreakpointChange>();
        this.observer = new ResizeObserver(this.resized.bind(this));
        this.observer.observe(this.element);
    }

    disconnect() {
        this.changeObservable.complete();
        this.changeObservable = undefined;
        this.observer.disconnect();
        this.observer = undefined;
    }
}

export namespace WidthBreakpointsContainer {
    export const defaultAccessorName = "ionx-width-breakpoints";
}
