//моя аппроксимация (не классическая)
inter.Appx = {

    xMax: false,//увеличивается ли координата x
    yMax: false,//увеличивается ли координата y
    rMax: false,//увеличивается ли координата r


    getTruePointsWithMeasure: function (points, eps) {
        eps = eps || 1;
        var resultPoints = [];
        //алгоритм заключается в том, смотрится числа которые идут после текущей в пределах некоторой eps (число точек, которые мы берем)
        //далее выбираем ту, где мера была максимальна
        //мера зависит от x y r
        resultPoints.push(points[0]);
        for (var i = 0; i < points.length; i += eps) {
            var pt = this.getOneTruePoint(points, i, eps);
            if (pt != null && !utils.isUndefined(pt)) {
                resultPoints.push(pt);
            }
        }
        if (resultPoints.length < 4) {
            resultPoints = this.getTruePoints(points);
        }
        return resultPoints;
    },

    getOneTruePoint: function (points, ptIndex, eps) {
        //масси мер
        var p = [];
        var maxMeasure = null;
        var indexWithMaxMeasure = null;
        //идем со следующей точки и смотрим, находятся ли они в близи
        var iteration = 0;
        for (var i = ptIndex + 1; i < points.length && iteration < eps; i++, iteration++) {
            var dX = Math.abs(points[ptIndex].x - points[i].x);
            var dY = Math.abs(points[ptIndex].y - points[i].y);
            var dR = Math.abs(points[ptIndex].r - points[i].r);
            if (maxMeasure == null) {
                maxMeasure = dX + dY + dR;//мера для этой точки
                indexWithMaxMeasure = i;
            } else {
                if (maxMeasure < dX + dY + dR) {
                    maxMeasure = dX + dY + dR;//мера для этой точки
                    indexWithMaxMeasure = i;
                }
            }
        }

        return points[indexWithMaxMeasure];
    },

    /**
     *
     * @param points
     * @returns {Array}
     */
    getTruePoints: function (points) {
        var resultPoints = [];
        this.xMax = false;//увеличивается ли координата x
        this.yMax = false;//увеличивается ли координата y
        this.rMax = false;//увеличивается ли координата r
        //алгоритм заключается в том, что точки добавляются по мере изменении линейности.
        resultPoints.push(points[0]);
        if (resultPoints[0].x <= points[1].x) {
            this.xMax = true;
        }
        if (resultPoints[0].y <= points[1].y) {
            this.yMax = true;
        }
        if (resultPoints[0].r <= points[1].r) {
            this.rMax = true;
        }

        for (var i = 1; i < points.length; i++) {
            //если не линейно изменяется = добавляем
            if (!this.isLinearPoints(points[i - 1], points[i])) {
                resultPoints.push(points[i]);
            }
        }
        resultPoints.push(points[points.length - 1]);

        //в конце проверка, если меньше 4х точек - добавляем пропущенные
        // (такой случай может быть только ,есть линейная прямая)
        if (resultPoints.length < 4) {
            resultPoints = [];
            console.log("ahtung");
            var i = 0;
            var oneBlock = Math.round(points.length / 5);
            for (; i < points.length; i = i + oneBlock) {
                resultPoints.push(points[i]);
            }
            //если не добавляли последнюю точку - добавим
            if (i != (points.length - 1)) {
                resultPoints.push(points[points.length - 1]);
            }

        }

        return resultPoints;
    },

    isLinearPoints: function (pt1, pt2) {
        var result = true;

        //проверка х
        if (pt1.x <= pt2.x) {
            //если левая точка меньше правой и х не(!) увеличивается
            //то изменения не линейные
            if (this.xMax != true) {
                this.xMax = !this.xMax;
                result = false;
            }
        } else {
            //если левая точка больше правой и х увеличивается
            //то изменения не линейные
            if (this.xMax == true) {
                this.xMax = !this.xMax;
                result = false;
            }
        }
        //проверка y
        if (pt1.y <= pt2.y) {
            //если левая точка меньше правой и х не(!) увеличивается
            //то изменения не линейные
            if (this.yMax != true) {
                this.yMax = !this.yMax;
                result = false;
            }
        } else {
            //если левая точка больше правой и х увеличивается
            //то изменения не линейные
            if (this.yMax == true) {
                this.yMax = !this.yMax;
                result = false;
            }
        }
        //проверка r
        if (pt1.r <= pt2.r) {
            //если левая точка меньше правой и х не(!) увеличивается
            //то изменения не линейные
            if (this.rMax != true) {
                this.rMax = !this.rMax;
                result = false;
            }
        } else {
            //если левая точка больше правой и х увеличивается
            //то изменения не линейные
            if (this.rMax == true) {
                this.rMax = !this.rMax;
                result = false;
            }
        }
        return result;
    }
};