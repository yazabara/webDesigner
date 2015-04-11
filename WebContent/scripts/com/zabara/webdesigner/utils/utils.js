function utils() {
}

/**
 *
 * @param x
 * @returns {boolean}
 */
utils.isUndefined = function (x) {
    return x == null && x !== null;
};

/**
 *
 * @param pt1
 * @param pt2
 * @returns {*}
 */
utils.getAngleP = function (pt1, pt2) {
    var len = utils.getRass(pt1, pt2);
    var sin = (pt1.get("x") - pt2.get("x")) / len;
    var cos = (pt1.get("y") - pt2.get("y")) / len;
    return utils.getAngle(sin, cos);
};

/**
 *
 * @param sinus
 * @param cosine
 * @returns {number}
 */
utils.getAngle = function (sinus, cosine) {
    var angel = 0;
    if (sinus > 0) {
        angel = Math.acos(cosine);
    }
    else {
        angel = (Math.PI * 2) - Math.acos(cosine);
    }
    return angel;
};


/**
 *
 * @param pt1 (model)
 * @param pt2 (model)
 * @returns {number}
 */
utils.getRass = function (pt1, pt2) {
    //Rass = (( x1 - x2 )^2 + ( y1- y2 )^2)^0.5
    var res = Math.sqrt((pt1.get("x") - pt2.get("x")) * (pt1.get("x") - pt2.get("x")) + (pt1.get("y") - pt2.get("y")) * (pt1.get("y") - pt2.get("y")));
    if (res <= 0) {
        return 0.001;
    }
    return res;
};

/**
 *
 * @param pt1 (object)
 * @param pt2  (object)
 * @returns {number}
 */
utils.getPointDistance = function (pt1, pt2) {
    //Rass = (( x1 - x2 )^2 + ( y1- y2 )^2)^0.5
    var res = Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
    if (res <= 0) {
        return 0.001;
    }
    return res;
};

/**
 *
 * @param centerX
 * @param centerY
 * @param x
 * @param y
 * @param angle
 * @returns {{x: number, y: number}}
 */
//поворочавает точку (x,y) на указанный угол вокруг центра(centerX,centerY)
utils.getRotatePoint = function (centerX, centerY, x, y, angle) {
    return {
        x: centerX + Math.cos(angle) * (x - centerX) + Math.sin(angle) * (y - centerY),
        y: centerY + -Math.sin(angle) * (x - centerY) + Math.cos(angle) * (y - centerY)
    }

};

/**
 *
 * @param centerX
 * @param centerY
 * @param x
 * @param y
 * @param angle
 * @param rass
 * @returns {{x: number, y: number}}
 */
//поворачивает точку (x,y) на указанный угол вокруг центра(centerX,centerY) и сдвигает на указанное расстояние rass
utils.getRotatePointOnRass = function (centerX, centerY, x, y, angle, rass) {
    var angleState = utils.getAngleP(new PointModel({
        x: centerX,
        y: centerY
    }), new PointModel({
        x: x,
        y: y
    }));
    return {
        x: centerX + Math.sin(angle + angleState) * rass,
        y: centerY + Math.cos(angle + angleState) * rass
    }

};

/**
 *
 * @returns {string}
 */
utils.getRandomColor = function () {
    var r = Math.floor(Math.random() * 255) + 70;
    var g = Math.floor(Math.random() * 255) + 70;
    var b = Math.floor(Math.random() * 255) + 70;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
};

/**
 *
 * @param pt1
 * @param pt2
 * @returns {number}
 */
utils.coordinatesComparatorX = function (pt1, pt2) {
    return (pt1.x - pt2.x);
};

/**
 *
 * @param pt1
 * @param pt2
 * @returns {number}
 */
utils.coordinatesComparatorY = function (pt1, pt2) {
    return (pt1.y - pt2.y);
};

/**
 *
 * @param min
 * @param max
 * @returns {number}
 */
utils.getRandom = function (min, max) {
    return Math.random() * (max - min) + min;
};

/**
 *
 * @param canvas
 * @param evt
 * @returns {{x: number, y: number}}
 */
utils.getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // return relative mouse position
    var mouseX = evt.clientX - rect.top - root.scrollTop;
    var mouseY = evt.clientY - rect.left - root.scrollLeft;
    return {
        x: mouseX,
        y: mouseY
    };
};

/**
 *
 * @param x
 * @param y
 * @returns {number}
 */
utils.hypot = function (x, y) {
    return Math.sqrt(x * x + y * y) || 0;
};

/**
 *
 * @param length длинна массива
 * @param value значение, которым нужно заполнить массив
 * @param className имя класса (например Number.prototype.valueOf)
 * @return {*}
 */
utils.getArray = function (length, value, className) {
    if (length <= 0) {
        return null;
    }
    return Array.apply(null, new Array(length)).map(className, 0);
};

/**
 *
 * @param A - наддиагональ  матрицы коэффициентов
 * @param Bcopy - главная диагональ матрици коэффициентов
 * @param C - поддиагональ матрицы коэффициентов
 * @param D - вектор правой части системы
 * @param eps - необязательный параметр
 *
 * (B A 0 0 0)  = |D|
 * (C B A 0 0)  = |D|
 * (0 C B A 0)  = |D|
 * (0 0 C B A)  = |D|
 * (0 0 0 C B)  = |D|
 */
utils.progonkaSolution = function (A, B, C, D, eps) {
    var n = B.length;
    var dX = eps || 2;

    var X = [];
    //http://mathhelpplanet.com/static.php?p=metod-progonki-dlya-resheniya-sistem-uravnenii
    var P = [];
    var Q = [];

    var Bcopy = [];

    //меняем знак
    for (var i = 0; i < n; i++) {
        Bcopy[i] = -B[i];
    }
    //console.log(C);

    P[0] = C[0] / Bcopy[0];
    Q[0] = -D[0] / Bcopy[0];
    //console.log("P[" + 0 + "] = " + P[0] + " = " + (-C[0]) + " / " + B[0]);
    //console.log("Q[" + 0 + "] = " + Q[0] + " = " + D[0] + "/" + B[0]);
    //прямой ход
    //предполагается, что A[0] = 0;
    for (var i = 1; i < n - 1; i++) {
        var znam = Bcopy[i] - A[i] * P[i - 1];
        P[i] = C[i] / znam;
        // console.log("P[" + i + "] = " + P[i] + " = " + C[i] + " / ( " + B[i] + " - " + A[i] + "*" + P[i - 1] + ")");
        Q[i] = (A[i] * Q[i - 1] - D[i]) / znam;
        // console.log("Q[" + i + "] = " + Q[i] + " = " + A[i] + " * " + Q[i - 1] + " - " + D[i] + " / ( " + B[i] + " - " + A[i] + "*" + P[i - 1] + ")");
    }
    //обратный ход
    //предполагается D[n-1] = 0
    X[n - 1] = (A[n - 1] * Q[n - 2] - D[n - 1]) / (Bcopy[n - 1] - A[n - 1] * P[n - 2]);
    X[n - 1] = X[n - 1].toFixed(dX);
    for (var j = n - 2; j >= 0; j--) {
        X[j] = P[j] * X[j + 1] + Q[j];
        X[j] = X[j].toFixed(dX);
    }

    return X;
};

/**
 *
 * @param value1
 * @param value2
 * @param eps
 * @returns {boolean}
 */
utils.isNear = function (value1, value2, eps) {
    var eps = eps || 0.1;
    if (value1 - eps <= value2 && value1 + eps >= value2) {
        return true;
    }
    return false;
};


