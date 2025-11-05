function average(values) {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function getMinimum(values) {
    return Math.min(...values);
}

module.exports = { average, getMinimum };
