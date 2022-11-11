import { Subject } from 'rxjs';
import { MediaBreakpoint } from 'ionx/utils';

const reversedBreakpoints = MediaBreakpoint.values().reverse();
class WidthBreakpointsContainer {
  constructor(element, accessorName) {
    this.element = element;
    this.accessorName = accessorName;
    this.connect();
    if (!this.accessorName) {
      this.accessorName = WidthBreakpointsContainer.defaultAccessorName;
    }
  }
  get onBreakpointChange() {
    return this.changeObservable;
  }
  resized() {
    const element = this.element;
    const page = this.element.closest(".ion-page");
    if (page && page.classList.contains("ion-page-hidden")) {
      return;
    }
    const style = element.style;
    const { width } = element.getBoundingClientRect();
    style.setProperty(`--${this.accessorName}`, `${width}px`);
    const oldQueries = element.getAttribute(this.accessorName);
    const queries = [];
    let breakpoint;
    for (const bp of reversedBreakpoints) {
      if (!breakpoint && width >= bp.minWidth) {
        breakpoint = bp;
        queries.push(`=${bp.name}`, `>=${bp.name}`, `<=${bp.name}`);
      }
      else if (width > bp.minWidth) {
        queries.push(`>=${bp.name}`, `>${bp.name}`);
      }
      else if (width < bp.minWidth) {
        queries.push(`<=${bp.name}`, `<${bp.name}`);
      }
      style.setProperty(`--${this.accessorName}-${bp.name}`, bp === breakpoint ? "\t" : "initial");
    }
    const newQueries = queries.join(" ");
    element.setAttribute(this.accessorName, newQueries);
    if (oldQueries !== newQueries) {
      this.changeObservable.next({ breakpoint, queries });
    }
  }
  connect() {
    if (this.observer) {
      return;
    }
    this.changeObservable = new Subject();
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
(function (WidthBreakpointsContainer) {
  WidthBreakpointsContainer.defaultAccessorName = "ionx-width-breakpoints";
})(WidthBreakpointsContainer || (WidthBreakpointsContainer = {}));

export { WidthBreakpointsContainer as W };
