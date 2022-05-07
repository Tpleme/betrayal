export function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn(...args)
        }, ms)
    };
}