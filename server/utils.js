const getIdParam = req => {
    const id = req.params.id

    if (/^\d+$/.test(id)) {
        return Number.parseInt(id, 10);
    }
    throw new TypeError(`invalid id param: ${id}`)
}

module.exports = {
    getIdParam,
}