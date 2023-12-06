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
        console.log('failed to copy to clipboard. error=' + error);
    }
}

export const getVisualPlayerPosition = (nPlayers, playerIndex) => {

    //returns the player style depending how many players are in the room
    const positions = [
        [
            { top: 25, left: 25 }
        ],
        [
            { top: 25, left: 10 },
            { top: 25, left: 40 }
        ],
        [
            { top: 10, left: 10 },
            { top: 10, left: 40 },
            { top: 35, left: 25 }
        ],
        [
            { top: 10, left: 10 },
            { top: 10, left: 40 },
            { top: 35, left: 10 },
            { top: 35, left: 40 }
        ],
        [
            { top: 2, left: 10, scale: '0.8' },
            { top: 2, left: 40, scale: '0.8' },
            { top: 23, left: 10, scale: '0.8' },
            { top: 23, left: 40, scale: '0.8' },
            { top: 44, left: 25, scale: '0.8' }
        ],
        [
            { top: 2, left: 10, scale: '0.8' },
            { top: 2, left: 40, scale: '0.8' },
            { top: 23, left: 10, scale: '0.8' },
            { top: 23, left: 40, scale: '0.8' },
            { top: 44, left: 10, scale: '0.8' },
            { top: 44, left: 40, scale: '0.8' }
        ],
    ]
    
    return positions[nPlayers][playerIndex]
}