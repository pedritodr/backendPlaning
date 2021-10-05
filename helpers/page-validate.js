const validatePage = (page) => {

    if (page <= 0) {
        throw new Error(`The page ${page} is not valid`);
    }
    return true;
}

module.exports = {
    validatePage
}