/*
 * B-сплайн - функции.
 */
var BSpline;
BSpline = {

    B0: function (t) {
        return Math.pow((1 - t), 3);
    },
    /**
     * @return {number}
     */
    B1: function (t) {
        return (3 * (t * t * t)) - (6 * (t * t)) + 4;
    },
    /**
     * @return {number}
     */
    B2: function (t) {
        return ((-3) * (t * t * t)) + (3 * (t * t)) + (3 * t) + 1;
    },
    /**
     * @return {number}
     */
    B3: function (t) {
        return (t * t * t);
    }
};
var B2Spline;
B2Spline = {
    /**
     * @return {number}
     */
    B0: function (t) {
        return 1 / 6 * Math.pow((2 + t), 3);
    },

    /**
     * @return {number}
     */
    B1: function (t) {
        return 1 / 6 * (4 - 6 * t * t - 3 * t * t * t);
    },

    /**
     * @return {number}
     */
    B2: function (t) {
        return 1 / 6 * (4 - 6 * t * t + 3 * t * t * t);
    },

    /**
     * @return {number}
     */
    B3: function (t) {
        return 1 / 6 * Math.pow((2 - t), 3);
    }
};

