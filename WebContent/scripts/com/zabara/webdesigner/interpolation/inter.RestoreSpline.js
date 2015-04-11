inter.RestoreSpline = {

    //разница в t
    dt: 1,
    restoreT: 0.1,

    /**
     *
     * @param points
     * @returns {PointListCollection}
     */
    restore: function (points) {
        var resultPoints = new PointListCollection();

        var pointsX = this.getArrayCoordinatesFromCollection(points, "x");
        var pointsY = this.getArrayCoordinatesFromCollection(points, "y");
        var pointsR = this.getArrayCoordinatesFromCollection(points, "r");
        //текущее количество точек
        var N = pointsR.length;
        // текущее разбиение
        var T = this.getSplitCoff(pointsX, pointsY);
        //for i:=0 to N+5 do T[i]:=i*i*i+1; //todo пока не буду
        var diagonal = this.getDiagonal(T, N);
        //теперь нужно добавить решения (т.к. n неизвестных и n-2 уравнения)
        //добавим первую и последнюю строку
        var c = utils.getArray(N + 2, 0, Number.prototype.valueOf);
        var a = utils.getArray(N + 2, 0, Number.prototype.valueOf);
        var b = utils.getArray(N + 2, 0, Number.prototype.valueOf);
        c[0] = 1; // решение 1го уравнения есть йая точка
        for (var i = 1; i < N + 1; i++) {
            c[i] = diagonal.Bzero[i];
            a[i] = diagonal.Bplus[i - 1];
            b[i] = diagonal.Bminus[i + 1];
        }
        c[N + 1] = 1;  //решение последнего - есть последняя точка.

        //теперь нужно добавить эти точки (первую и последнюю) к точкам
        //т.е. скопировать
        pointsX = this.addFirstLastPoints(pointsX, N);
        pointsY = this.addFirstLastPoints(pointsY, N);
        pointsR = this.addFirstLastPoints(pointsR, N);

        //после того как подготовили диагональ коэффицинтов и добавили к точкам(правый столбец)
        //начинаем решать систему с помощью прогонки.

        var Rx = utils.progonkaSolution(a, c, b, pointsX);
        var Ry = utils.progonkaSolution(a, c, b, pointsY);
        var Rr = utils.progonkaSolution(a, c, b, pointsR);

        //восстанавливаем сплайн
//            resultPoints.push(new PointModel({
//                x: pointsX[0],
//                y: pointsY[0],
//                r: pointsR[0],
//                t: T[0]
//            }));
        for (var i = 3; i <= N + 1; i++) {
            //берем между текущим и следующей точкой разбиения
            var t0 = T[i] + ((T[i + 1] - T[i]) / 2);

            //цикл по всем t в промежутке
            for(var t0 = T[i]; t0 < T[i + 1]; t0 += this.restoreT){

                var B0 = this.Spl4(t0, T[i - 3], T[i - 2], T[i - 1], T[i], T[i + 1]);
                var B1 = this.Spl3(t0, T[i - 2], T[i - 1], T[i], T[i + 1], T[i + 2]);
                var B2 = this.Spl2(t0, T[i - 1], T[i], T[i + 1], T[i + 2], T[i + 3]);
                var B3 = this.Spl1(t0, T[i], T[i + 1], T[i + 2], T[i + 3], T[i + 4]);

                var x0 = Math.round(Rx[i - 3] * B0 + Rx[i - 2] * B1 + Rx[i - 1] * B2 + Rx[i] * B3);
                var y0 = Math.round(Ry[i - 3] * B0 + Ry[i - 2] * B1 + Ry[i - 1] * B2 + Ry[i] * B3);
                var r0 = Math.round(Rr[i - 3] * B0 + Rr[i - 2] * B1 + Rr[i - 1] * B2 + Rr[i] * B3);

                resultPoints.add(new PointModel({
                    x: x0,
                    y: y0,
                    r: r0,
                    t: t0
                }));
            }
        }


        return resultPoints;
    },

    /**
     * функция добавляет в начало и конец первую и последнюю точки
     * нужна для того, чтобы было возможо применить метод Прогонки для нахождения решения
     *
     * @param points
     * @param N
     * @returns {Array}
     */
    addFirstLastPoints: function (points, N) {
        var f = [];
        f.push(points[0]);//первая
        //N остальных
        for (var i = 0; i < N; i++) {
            f.push(points[i]);
        }
        //последняя
        f.push(points[N - 1]);
        return f;
    },

    /**
     * возвращает массив t, необходимое для разбиения(создания сплайна)
     *
     * @param pointsX
     * @param pointsY
     * @return {Array}
     */
    getSplitCoff: function (pointsX, pointsY) {
        var N = pointsX.length;
        var T = [];
        /*T[3] = 0;
         for (var i = 4; i < N + 2; i++) {
         // можно не только hypot (любой шаг)
         T[i] = T [i - 1] + this.dt;//utils.hypot(pointsX[i - 3] - pointsX[i - 4], pointsY[i - 3] - pointsY[i - 4]);
         }
         T[2] = -T[4];
         T[1] = -T[5];
         T[0] = -T[6];
         T[N + 3] = 2 * T[N + 2] - T[N + 1];
         T[N + 4] = 2 * T[N + 3] - T[N + 2];
         T[N + 5] = 2 * T[N + 4] - T[N + 3];
         */
        for (var i = 0; i < N + 6; i++) {
            T.push(this.dt * i);
        }
        return T;
    },


    /**
     *
     * @param T
     * @param N
     * @returns {{Bminus: Array, Bzero: Array, Bplus: Array}}
     */
    getDiagonal: function (T, N) {
        var Bminus = [];
        var Bzero = [];
        var Bplus = [];

        //подсчитываем диагональные коэффициенты
        for (var i = 0; i <= N + 1; i++) {
            //скрытые функции сплайна (различные).
            //отличаются от оригинальных только тем, что многое сокращается (1 или 0), соответственно удалили
            Bminus[i] = (T[i + 1] - T[i  ]) / (T[i + 3] - T[i  ]) * (T[i + 1] - T[i  ]) / (T[i + 2] - T[i  ]);
            Bzero[i] = (T[i + 4] - T[i + 2]) / (T[i + 4] - T[i + 1]) * (T[i + 2] - T[i + 1]) / (T[i + 3] - T[i + 1]) +
                (T[i + 2] - T[i  ]) / (T[i + 3] - T[i  ]) * (T[i + 3] - T[i + 2]) / (T[i + 3] - T[i + 1]);
            Bplus[i] = (T[i + 4] - T[i + 3]) / (T[i + 4] - T[i + 1]) * (T[i + 4] - T[i + 3]) / (T[i + 4] - T[i + 2])
        }

        return {
            Bminus: Bminus,
            Bzero: Bzero,
            Bplus: Bplus
        }
    },

    /**
     *
     * @param collection
     * @param propName
     * @returns {*}
     * можно оптимизировать, если сразу за один проход возвращать
     * все списки координат(т.е. за один цикл собирать всё)
     */
    getArrayCoordinatesFromCollection: function (collection, propName) {
        if (collection == null || collection.length <= 0) {
            return null;
        }
        var result = [];
        for (var i = 0; i < collection.length; i++) {
            result.push(collection.at(i).get(propName));
        }

        return result;
    },

    /**
     *
     * @param t
     * @param t0
     * @param t1
     * @param t2
     * @param t3
     * @param t4
     * @returns {number}
     * @constructor
     */
    Spl1: function (t, t0, t1, t2, t3, t4) {
        return (t - t0) / (t3 - t0) * (t - t0) / (t2 - t0) * (t - t0) / (t1 - t0);
    },

    /**
     *
     * @param t
     * @param t0
     * @param t1
     * @param t2
     * @param t3
     * @param t4
     * @returns {number}
     * @constructor
     */
    Spl2: function (t, t0, t1, t2, t3, t4) {
        return (t - t0) / (t3 - t0) * (t - t0) / (t2 - t0) * (t2 - t) / (t2 - t1) +
            (t - t0) / (t3 - t0) * (t3 - t) / (t3 - t1) * (t - t1) / (t2 - t1) +
            (t4 - t) / (t4 - t1) * (t - t1) / (t3 - t1) * (t - t1) / (t2 - t1);
    },

    /**
     *
     * @param t
     * @param t0
     * @param t1
     * @param t2
     * @param t3
     * @param t4
     * @returns {number}
     * @constructor
     */
    Spl3: function (t, t0, t1, t2, t3, t4) {
        return (t4 - t) / (t4 - t1) * (t - t1) / (t3 - t1) * (t3 - t) / (t3 - t2) +
            (t4 - t) / (t4 - t1) * (t4 - t) / (t4 - t2) * (t - t2) / (t3 - t2) +
            (t - t0) / (t3 - t0) * (t3 - t) / (t3 - t1) * (t3 - t) / (t3 - t2);
    },

    /**
     *
     * @param t
     * @param t0
     * @param t1
     * @param t2
     * @param t3
     * @param t4
     * @returns {number}
     * @constructor
     */
    Spl4: function (t, t0, t1, t2, t3, t4) {
        return (t4 - t) / (t4 - t1) * (t4 - t) / (t4 - t2) * (t4 - t) / (t4 - t3);
    }

}