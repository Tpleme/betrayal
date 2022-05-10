const { v4: uuidv4 } = require('uuid')

let keysBeingUsed = [process.env.API_BO_KEY]

const getIdParam = req => {
    const id = req.params.id

    if (/^\d+$/.test(id)) {
        return Number.parseInt(id, 10);
    }
    throw new TypeError(`invalid id param: ${id}`)
}

const getApiKey = (id) => {
    return `${id}/${uuidv4()}`
}

const addKeyToBeingUsed = (key) => {
    keysBeingUsed.push(key)
    console.log(key)
}

const popKeyBeingUsed = (id) => {
    let key = keysBeingUsed.find(elem => elem.split("/")[0] === id);
    let index = keysBeingUsed.indexOf(key);
    
    if(index > -1) {
        keysBeingUsed.splice(index, 1)
    }
}

const checkKeyBeingUsed = (key) => {
    console.log(keysBeingUsed)
    return keysBeingUsed.includes(key)
}


module.exports = {
    getIdParam,
    getApiKey,
    addKeyToBeingUsed,
    popKeyBeingUsed,
    checkKeyBeingUsed
}