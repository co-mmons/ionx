/**
 * Plugin, który powinien byc dodany w stencil.config.build.ts w rollupPlugins.before, a który
 * określa, które moduły mają być zexternalizowane przez rollupa.
 *
 * @param externals Tablica z nazwami nazwami modułów (np. ionx/utils) albo wyrażeniem regularnym, które
 * określa moduły do zeksternalizowania.
 */
export function externalsRollupBeforePlugin(externals: (string | RegExp)[]) {

    return {
        id: "externalsPlugin",
        resolveId(id: string) {
            for (const e of externals) {
                if ((typeof e === "string" && id === e) || (e instanceof RegExp && e.exec(id))) {
                    return {id, external: true}
                }
            }
        }
    }
}
