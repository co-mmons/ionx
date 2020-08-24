export const debounce = (func: (...args: any[]) => void, wait = 0) => {
    let timer: any;
    return (...args: any[]): any => {
        clearTimeout(timer);
        timer = setTimeout(func, wait, ...args);
    };
};
