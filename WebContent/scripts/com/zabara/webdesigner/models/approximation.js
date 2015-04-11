var Approximation;
Approximation = {

    MAX_X: 2000,
    MAX_Y: 1000,
    // аппроксимация б-сплайна
    bSpline: {
        //
        approximation: function (spline) {
            return Approximation.bSpline._appx(spline);
        },

        _appx: function (spline) {
            var res = [];
            // обходим все точки
            for (var i = 0; i < spline.get("controlPoints").length - 3; i++) {
                var controlPointsOfOneBlock = [];
                for (var k = 0; k < 4; k++, i++) {
                    controlPointsOfOneBlock.push(spline.get("controlPoints").at(i));
                }
                var points = spline.get("calculatePoints");//_calculate(controlPointsOfOneBlock);
                i -= 4;
                var result = Approximation.bSpline._approxOneBlock(controlPointsOfOneBlock, points);

                $(result).each(function (index, value) {
                    res.push(value);
                });
            }
            return res;
        },

        _approxOneBlock: function (controlPointsOfOneBlock, points) {
            if (controlPointsOfOneBlock.length != 4) {
                return [];
            }
            var result = {
                left: [],
                right: []
            }
            var j = 0;
            //по всем точкам
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                //константы для выражения x1,y1
                var H0x = controlPointsOfOneBlock[j].get('x');
                var H1x = controlPointsOfOneBlock[j + 1].get('x');
                var H2x = controlPointsOfOneBlock[j + 2].get('x');
                var H3x = controlPointsOfOneBlock[j + 3].get('x');
                //константы для выражения x1,y1
                var H0y = controlPointsOfOneBlock[j].get('x');
                var H1y = controlPointsOfOneBlock[j + 1].get('y');
                var H2y = controlPointsOfOneBlock[j + 2].get('y');
                var H3y = controlPointsOfOneBlock[j + 3].get('y');
                //константы для выражения x1,y1
                var H0r = controlPointsOfOneBlock[j].get('r');
                var H1r = controlPointsOfOneBlock[j + 1].get('r');
                var H2r = controlPointsOfOneBlock[j + 2].get('r');
                var H3r = controlPointsOfOneBlock[j + 3].get('r');
                //координаты для точки. (x1, y1)
                var x1 = Approximation.bSpline.X1(
                    Approximation.bSpline.derivative(p.t, H0x, H1x, H2x, H3x),
                    Approximation.bSpline.derivative(p.t, H0y, H1y, H2y, H3y),
                    Approximation.bSpline.derivative(p.t, H0r, H1r, H2r, H3r),
                    points[i].r,
                    points[i].x);
                var y1 = Approximation.bSpline.Y1(
                    Approximation.bSpline.derivative(p.t, H0x, H1x, H2x, H3x),
                    Approximation.bSpline.derivative(p.t, H0y, H1y, H2y, H3y),
                    Approximation.bSpline.derivative(p.t, H0r, H1r, H2r, H3r),
                    points[i].r,
                    points[i].y);
                //проверка, что входит в канвас по размеру
                if (( x1 > 0 && x1 < Approximation.MAX_X) && ( y1 > 0 && y1 < Approximation.MAX_Y )) {
                    if (Approximation.bSpline.isNewPoint(new Point(x1, y1), result.left) == true) {
                        result.left.push(new Point(x1, y1));
                    }
                }
                //координаты для точки. (x2, y2)
                var x2 = Approximation.bSpline.X2(
                    Approximation.bSpline.derivative(p.t, H0x, H1x, H2x, H3x),
                    Approximation.bSpline.derivative(p.t, H0y, H1y, H2y, H3y),
                    Approximation.bSpline.derivative(p.t, H0r, H1r, H2r, H3r),
                    points[i].r,
                    points[i].x);

                var y2 = Approximation.bSpline.Y2(
                    Approximation.bSpline.derivative(p.t, H0x, H1x, H2x, H3x),
                    Approximation.bSpline.derivative(p.t, H0y, H1y, H2y, H3y),
                    Approximation.bSpline.derivative(p.t, H0r, H1r, H2r, H3r),
                    points[i].r,
                    points[i].y);
                //проверка, что входит в канвас по размеру
                if (( x2 > 0 && x2 < Approximation.MAX_X) && ( y2 > 0 && y2 < Approximation.MAX_Y )) {
                    if (Approximation.bSpline.isNewPoint(new Point(x2, y2), result.right) == true) {
                        result.right.push(new Point(x2, y2, p.t));
                    }
                }

                //проверка, что входит в канвас по размеру
                if (( x1 > 0 && x1 < Approximation.MAX_X) && ( y1 > 0 && y1 < Approximation.MAX_Y )) {
                    if (Approximation.bSpline.isNewPoint(new Point(x1, y1), result.left) == true) {
                        result.left.push(new Point(x1, y1, p.t));
                    }
                }
            }
            var polygon = [];
            $(result.left).each(function (index, value) {
                polygon.push(value);
            });
            for (var i = result.right.length - 1; i > 0; i--) {
                polygon.push(result.right[i]);
            }
            return polygon;
        },

        //true - если точка новая(т.е. поблизости нет другой точки)
        isNewPoint: function (pt, points, epsilon) {
            if (points) {
                for (var i = 0; i < points.length; i++) {
                    var eps = points[i].r || epsilon;
                    if (utils.nearPoints(pt, points[i], eps) == true) {
                        return false;
                    }
                }
            }
            return true;
        },
        // возвращает значение производной...в точке с параметром t, константами Hi
        derivative: function (t, H0, H1, H2, H3) {
            return t * t * (-((H0) / 2) + ((3 * H1) / 2) - ((3 * H2) / 2) + (H3 / 2)) + t * (H0 - (2 * H1) + H2) - (H0 / 2) + (H2 / 2);
        },
        // возвращает х правой огибающей
        // U(x),V(y),R -значения производной, r,u - значение функции
        /**
         * @return {number}
         */
        X1: function (U, V, R, r, u) {
            return u -
                (((U * R * r) / ((U * U) + (V * V))) +
                    ((V * r * Math.sqrt((U * U) + (V * V) - (R * R))) / ((U * U) + (V * V))));
        },

        /**
         * возвращает х левой огибающей
         * U(x),V(y),R -значения производной, ru - значение функции
         * @return {number}
         */
        X2: function (U, V, R, r, u) {
            return u -
                (((U * R * r) / ((U * U) + (V * V))) -
                    ((V * r * Math.sqrt((U * U) + (V * V) - (R * R))) / ((U * U) + (V * V))));
        },

        /**
         * возвращает y правой огибающей
         * U(x),V(y),R -значения производной, rv - значение функции
         * @return {number}
         */
        Y1: function (U, V, R, r, v) {
            return v -
                (((V * R * r) / ((U * U) + (V * V))) -
                    ((U * r * Math.sqrt((U * U) + (V * V) - (R * R))) / ((U * U) + (V * V))));
        },
        /**
         *  возвращает y левой огибающей
         *  U(x),V(y),R -значения производной, rv - значение функции
         * @return {number}
         */
        Y2: function (U, V, R, r, v) {
            return v -
                (((V * R * r) / ((U * U) + (V * V))) +
                    ((U * r * Math.sqrt((U * U) + (V * V) - (R * R))) / (U * U + V * V)));
        }
    },

    anySpline: {
        approximation: function (spline) {
            //левая и правая границы

            var points = spline.get("calculatePoints").models;
            return this._appx(points);
        },

        _appx: function(points){
            var result = {
                left: [],
                right: []
            };

            for (var i = 0; i < points.length - 1; i++) {
                var leftPoint = utils.getRotatePointOnRass(points[i].get("x"), points[i].get("y"), points[i + 1].get("x"), points[i + 1].get("y"), Math.PI / 2, points[i].get("r"));
                var rightPoint = utils.getRotatePointOnRass(points[i].get("x"), points[i].get("y"), points[i + 1].get("x"), points[i + 1].get("y"), -Math.PI / 2, points[i + 1].get("r"));
                result.left.push(leftPoint);
                result.right.push(rightPoint);
            }
            return result;
        }
    }
};