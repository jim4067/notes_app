const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(params);
    }
}

const error = (...err) => {
    console.error(err)
}

module.exports = {
    info, error
}