/**
 * Sleep before continuing to execute the code.
 * @param {Number} ms - The time in milliseconds to wait until continuing.
 * @returns {Promise} Promise which resolves after a given time.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  module.exports = { sleep };