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

export const msToMinutesAndSeconds = (ms) => {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export async function copyTextToClipboard(textToCopy) {
    try {
        await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
        console.log('failed to copy to clipboard. error:' + error);
    }
}