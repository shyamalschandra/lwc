import _xCmp from "x:cmp";
const memoized = Symbol();
export default function ($api, $cmp, $slotset) {
    const m = $cmp[memoized] || ($cmp[memoized] = {});
    return [$api.c(
        "x-cmp",
        _xCmp,
        null
    )];
}
export const templateUsedIds = [];