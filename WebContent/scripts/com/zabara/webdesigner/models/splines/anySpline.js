var PointModel = Backbone.Model.extend({
    defaults:{
        // для быстрого обнаружения сплайна(т.е. к какому сплайну относится эта точка)
        splineId: null,
        x:0,
        y:0,
        r:0,
        z:0,
        t:0
    }
});

var PointListCollection = Backbone.Collection.extend({

    splineManager:PointModel,

    initialize:function () {
    }
});

var AnySpline = Backbone.Model.extend({

    defaults:{
        splineId: null,
        controlPoints:new PointListCollection(),
        functions:[],
        coefficients:[],
        nurbs:null,
        calculatePoints:[]
    },

    initialize:function () {
        //связываем с событиями сплайна.
        this.get("controlPoints").on("change", function () {
            this.trigger(ModelEvents.changes.anySpline.event);
            this.trigger(ModelEvents.changes.anySpline.controlPoints);
        }, this);

        //сразу просчитываем.
        this.calculate();
    },

    calculate:function () {
        /**
         * отдельно передаются массивы контрольных точек, фукнций и коэффициентов,
         * т.к. с backbone обьектами отказывается работать Matrix
         */
        var controlPoints = this.get("controlPoints");
        var functions = this.get("functions");
        var coefficients = this.get("coefficients");
        var nurbs = this.get("nurbs");

        if (!controlPoints || controlPoints.length <= 0 || !functions || functions.length <= 0) {
            return [];
        }
        var matrixF = [];
        var matrixC = [];
        var matrixCoif = [];
        var points = new PointListCollection();
        // формируем матрицу контрольных точек
        for (var i = 0; i < controlPoints.length; i++) {
            (function (value) {
                matrixC.push([
                    function () {
                        return value.get("x")
                    },
                    function () {
                        return value.get("y")
                    },
                    function () {
                        return value.get("z")
                    },
                    function () {
                        return value.get("r")
                    }
                ]);
            })(controlPoints.at(i));
        }
        // формируем матрицу функций
        $(functions).each(function (index, value) {
            matrixF.push(value);
        });

        var matrixOfControlPoints = Matrix.create(matrixC);
        var matrixOfControlFunctions = Matrix.create([matrixF]);
        //просчитываем сплайн (матрицу преобразования)
        var matrix = matrixOfControlFunctions.dot_(matrixOfControlPoints);

        // если есть коэфициенты - просчитываем и матрицу коэфициентов
        if (coefficients && coefficients.length != 0) {
            $(coefficients).each(function (index, value) {
                matrixCoif.push(function () {
                    return value
                });
            });
            var matrixOfControlCoif = Matrix.create(matrixCoif);
            matrix = matrixOfControlCoif.dot_(matrix);
        }

        //TODO дальше идет просчет для рисовалки надо перенести аккуратно в view
        var t = this.getStartT(0.05);
        //TODO шаг для прорисовки !!!
        var step = 0.01;
        var end = this.getEndT(0.05);
        //вычислем
        for (t; t < end; t += step) {
            var x = matrix.elements[0][0](t, nurbs);
            var y = matrix.elements[0][1](t, nurbs);
            var z = matrix.elements[0][2](t, nurbs);
            var r = matrix.elements[0][3](t, nurbs);

            points.add(new PointModel({
                x:x,
                y:y,
                t:t,
                r:r,
                z:z}));
        }
        // после расчета записываем новые дынные и посылаем событие
        this.set("calculatePoints", points);
        this.trigger(ModelEvents.changes.anySpline.event);
        this.trigger(ModelEvents.changes.anySpline.calculatePoints);
        return points;
    },

    //todo реализовать быстрый спуск
    getStartT:function (eps) {
        var t = 0;
        var nurbs = this.get("nurbs");
        var step = 0.2;
        while (true) {
            var sum = 0;
            for (var i = 0; i < this.get("functions").length; i++) {
                sum += this.get("functions")[i](t, nurbs);
            }
            if (Math.abs(sum - 1) <= eps) {
                break;
            } else {
                t += step;
            }
            if (t > 1) {
                t = 0;
                step = step / 2;
            }
        }
        return t;
    },

    //todo реализовать быстрый спуск
    getEndT:function (eps) {
        var nurbs = this.get("nurbs");
        var step = 0.01;
        var t = nurbs.end;
        while (true) {
            var sum = 0;
            for (var i = 0; i < this.get("functions").length; i++) {
                sum += this.get("functions")[i](t, nurbs);
            }
            if (Math.abs(sum - 1) <= eps) {
                break;
            } else {
                t -= step;
            }
            if (t > 1) {
                t = 0;
                step = step / 2;
            }
        }
        return t;
    }
});

