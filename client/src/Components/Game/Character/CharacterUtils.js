export const getCharacterStatValue = (range, index, modifier) => {
    if (index + modifier > range.length - 1) {
        return range[range.length - 1]
    }

    if (index + modifier < 0) return 0

    return range[index + modifier]
}

export const checkIfStatValueIsSameAsIndex = (range, indexValue, index) => {

    if (indexValue > range.length - 1) {
        return index === range.length - 1
    }

    if (indexValue < 0) return parseInt(index) === 0

    return parseInt(index) === indexValue
}