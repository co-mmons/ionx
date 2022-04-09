export function currentTimeZone() {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}
