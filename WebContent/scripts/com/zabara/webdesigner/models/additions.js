/**
 * Умножение векторов (произвольные компоненты)
 * @param other -
 * @return {*}
 * @private
 */
Vector.prototype.dot_ = function (other) {
    //различные размеры векторов
    if (this.elements.length != other.elements.length) {
        return this;
    }
    //возвращаем новый вектор функций
    return this.map(function (fi, i) {
        return function () {
            return other.e(i).apply(this, arguments) * fi.apply(this, arguments);
        }
    });
};

/**
 *
 * @param i
 * @param j
 * @param left
 * @param right
 * @return {Function}
 * @private
 */
Matrix.prototype._multFunc = function (i, j, left, right) {
    return function () {
        var sum = 0;
        for (var k = 0; k < left[i].length; k++) {
            sum += (left[i][k].apply(this, arguments) * right[k][j].apply(this, arguments));
        }
        return sum;
    }
}

/**
 * Умножение матриц (произвольные компоненты)
 * @param other
 * @return {*}
 * @private
 */
Matrix.prototype.dot_ = function (other) {
    var result = [];
    if (other.elements.length != this.elements[0].length) {
        return this;
    }
    for (var i = 0; i < this.elements.length; i++) {
        var row = [];
        for (var j = 0; j < other.elements[0].length; j++) {
            row.push(this._multFunc(i, j, this.elements, other.elements));
        }
        result.push(row);
    }
    return Matrix.create(result);
};

/**
 *
 * @param row
 * @return {*}
 */
Matrix.prototype.addRow = function (row) {
    var result = this.elements;
    result.push(row);
    return Matrix.create(result);
}

Log.prototype.logControlPoints = function (matrixOfControlPoints) {
    console.log("matrix of control points");
    for (var i = 0; i < matrixOfControlPoints.elements.length; i++) {
        var str = "";
        for (var j = 0; j < matrixOfControlPoints.elements[i].length; j++) {
            if (j == matrixOfControlPoints.elements[i].length - 1) {
                str += matrixOfControlPoints.elements[i][j].call();
            } else {
                str += matrixOfControlPoints.elements[i][j].call() + "|";
            }
        }
        console.log("[" + str + "]");
    }
}

Log.prototype.logCoordinates = function (x, y, z, r) {
    var str = "x:" + x + " | y:" + y + " | z:" + z + " | r:" + r;
    console.log("[" + str + "]");
}

Log.prototype.logFunctions = function (matrixOfControlFunctions, matrixOfControlFunctions, t) {
    str = "";
    console.log("matrix of functions");
    for (var i = 0; i < matrixOfControlFunctions.elements.length; i++) {
        var str = "";
        for (var j = 0; j < matrixOfControlFunctions.elements[i].length; j++) {
            if (j == matrixOfControlFunctions.elements[i].length - 1) {
                str += matrixOfControlFunctions.elements[i][j].call(null, t);
            } else {
                str += matrixOfControlFunctions.elements[i][j].call(null, t) + "|";
            }

        }
        console.log("[" + str + "]");
    }
}


String.prototype.replaceAll = function(search, replace){
    return this.split(search).join(replace);
}