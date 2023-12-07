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


//calcula onde estão as portas independentemente da rotação
export const getDoors = (doors, rotation) => {
    const splitDoors = doors.split('')
    const coord = ['N', 'E', 'S', 'W']
    const newDoorArray = []

    const getRotationNumber = (rotation) => {
        switch (rotation) {
            case 90: return 1;
            case 180: return 2;
            case 270: return 3;
            default: return 0
        }
    }

    splitDoors.forEach(door => {
        const doorIndex = coord.findIndex(coord => coord === door);
        if (coord[doorIndex + getRotationNumber(rotation)]) {
            newDoorArray.push(coord[doorIndex + getRotationNumber(rotation)])
        } else {
            const overflow = getRotationNumber(rotation) - (coord.length - doorIndex)
            newDoorArray.push(coord[overflow])
        }

    })

    return newDoorArray
}