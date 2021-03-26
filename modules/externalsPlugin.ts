export function externalsPlugin(additionalDeps?: string[]) {

    const deps = ["@co.mmons/js-intl"];

    if (additionalDeps) {
        for (const d of additionalDeps) {
            this.deps.push(d);
        }
    }

    return {
        id: "externals",
        resolveId(id: string) {
            if (deps.includes(id)) {
                return {id, external: true};
            }
        }
    }
}
