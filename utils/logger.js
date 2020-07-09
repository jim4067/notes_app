const info = (...params) => {
    console.log(params);
}

const error = (...err) => {
    console.error(err)
}

module.exports = {
    info, error
}