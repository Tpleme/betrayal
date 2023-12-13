export const getCharacterStatValue = (range, index, modifier) => {
    if (index + modifier > range.length) {
        return range[range.length - 1]
    }

    if (index + modifier < 0) return 0

    return range[index + modifier]
}