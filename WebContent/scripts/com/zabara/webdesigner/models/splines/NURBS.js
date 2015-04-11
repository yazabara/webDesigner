/**

 * User: Yaroslav_Zabara
 * Date: 15.08.12
 * Time: 17:38
 */

/**
 * CANNOT extend to Backbone.Model !@!!
 *
 * @param settings
 * @constructor
 */
function NURBS(settings) {
    this.n = settings.n;
    this.m = settings.m;
    this.start = settings.calStart;
    this.end = settings.calEnd;
    this.step = settings.calStep;
    this.degree = settings.degree;
    this.tArray = this.fillArray(this.degree, this.start, this.end, this.step, this.m);
}

NURBS.prototype.initializeTArray = function(){
    this.tArray = this.fillArray(this.degree, this.start, this.end, this.step, this.m);
};


NURBS.prototype.N = function (i, p) {
    // базис
    if (p == 0) {
        return function (t, nurbs) {
            if (nurbs.tArray[i] <= t && t < nurbs.tArray[i + 1]) {
                return 1;
            } else {
                return 0;
            }
        };
    } else {
        return function (t, nurbs) {
            //деление на ноль
            if ((nurbs.tArray[i + p + 1] - nurbs.tArray[i + 1]) == 0 ||
                (nurbs.tArray[i + p] - nurbs.tArray[i]) == 0) {
                return 0;
            }

            var b1 = ((t - nurbs.tArray[i]) * nurbs.N(i, p - 1).call(this, t, nurbs)) /
                (nurbs.tArray[i + p] - nurbs.tArray[i]);
            var b2 = ((nurbs.tArray[i + p + 1] - t) * nurbs.N(i + 1, p - 1).call(this, t, nurbs)) /
                (nurbs.tArray[i + p + 1] - nurbs.tArray[i + 1]);
            return  b1 + b2;
        };
    }
};

NURBS.prototype.fillArray = function (degree, start, end, step, m) {
    if ((!start && start != 0) || !end || !degree) {
        return [];
    }
    if (degree <= 0) {
        degree = 1;
    }
    if (start > end) {
        var tmp = end;
        end = start;
        start = tmp;
    }
    var array = [];
    for (var i = 0; i < degree; i++) {
        array.push(start);
    }
    for (i = 1; i < m - (2 * degree) + 1; i += 1) {
        array.push(i * step + start);
    }

    for (i = 0; i < degree; i++) {
        array.push(end);
    }
    return array;
};

