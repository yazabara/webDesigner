var SplineListModel = Backbone.Collection.extend({

    model: AnySpline,

    initialize: function () {
    }
});

var SplineViewListModel = Backbone.Collection.extend({

    model: SplineKineticModel,

    initialize: function () {
    }
});

var SelectedPointModel = Backbone.Model.extend({
    defaults: {
        selectedShape: null,
        backboneData: null,
        isSelected: false
    }
});

//класс для работы со всеми сплайнами
var SplineManager = Backbone.Model.extend({
    defaults: {
        splines: new SplineListModel(),
        views: new SplineViewListModel(),

        selectedPoint: null, // new SelectedPointModel(),
        selectedSpline: null//new AnySpline()
    },

    initialize: function () {
        //изменились сплайны - посылаем выше сигнал(event)
        this.get("splines").on(ModelEvents.changes.anySpline.event, function () {
            //WebEditorManager.logger.debug("splines has changed");
            this.trigger(ModelEvents.changes.splines.event);
        }, this);

    },

    addSpline: function (spline) {
        if (this.get("splines")) {
            //см. anySpline.js (PointModel)
            spline.get("controlPoints").each(function (point) {
                point.set("splineId", spline.get("splineId"));
            });
            this.get("splines").add(spline);
            //send events
            this.trigger(ModelEvents.changes.splines.event);
            this.trigger(ModelEvents.changes.splines.addSpline);
        }
    },

    getSplinesCollection: function () {
        return this.get("splines");
    },

    getSplineByIndex: function (index) {
        if (this.get("splines").length <= index || index < 0) {
            return null;
        }
        return this.get("splines").at(index);
    },

    getSplineById: function (id) {
        try {
            return this.get("splines").where({splineId: id})[0];
        } catch (e) {
            return null;
        }
    },

    getViewById: function (id) {
        try {
            return this.get("views").where({splineId: id})[0];
        } catch (e) {
            return null;
        }
    },

    /**
     * Метод добавляет отображения нужного(splineId)сплайна
     * @param splineId
     * @param shape
     * @param circles
     * @param line
     */
    addView: function (splineId, shape, circles, line, groupId) {
        var viewObj = new SplineKineticModel({
            groupId: groupId,
            splineId: splineId,
            shapeBody: shape,
            opacity: shape.getOpacity(),
            fill: shape.getFill(),
            stroke: shape.getStroke(),
            circles: circles,
            line: line
        });

        if (this.get("views")) {
            this.get("views").add(viewObj);
            //send events
            this.trigger(ModelEvents.changes.views.event);
            this.trigger(ModelEvents.changes.views.addView);
        }
    },

    updateViews: function () {
        this.get("splines").each($.proxy(function (spline) {
            var view = this.getViewById(spline.get("splineId"));
            if (view) {
                view.updateShapeBody(spline);
            }
        }, this));
    },

    setDegreeToSelectedSpline: function (val) {
        if (this.get("selectedSpline") == null) {
            return;
        }
        //update spline<start>
        var n = this.get("selectedSpline").get("controlPoints").length;
        var m = val + n + 1;
        var calStart = this.get("selectedSpline").get("nurbs").start;
        var calEnd = this.get("selectedSpline").get("nurbs").end;
        var calStep = ((calEnd - calStart) / (m - (2 * val) + 1));

        this.get("selectedSpline").get("nurbs").m = m;
        this.get("selectedSpline").get("nurbs").step = calStep;
        this.get("selectedSpline").get("nurbs").degree = val;
        this.get("selectedSpline").get("nurbs").initializeTArray();
        //update spline<end>


        var funcSize = this.get("selectedSpline").get("functions").length;
        var functions = [];
        var nurbs = this.get("selectedSpline").get("nurbs");

        for (var i = 0; i < funcSize; i++) {
            functions.push(nurbs.N(i, val));
        }
        this.get("selectedSpline").set("functions", functions);
    },

    addPointToSelectedSpline: function (pt) {
        if (this.get("selectedSpline") == null) {
            return;
        }
        var pointData = new PointModel({x: pt.x, y: pt.y, t: 0, r: pt.r});
        this.get("selectedSpline").get("controlPoints").push(pointData);
        //update spline<start>
        var n = this.get("selectedSpline").get("controlPoints").length;
        var m = this.get("selectedSpline").get("nurbs").degree + n + 1;
        var calStart = this.get("selectedSpline").get("nurbs").start;
        var calEnd = this.get("selectedSpline").get("nurbs").end;
        var calStep = ((calEnd - calStart) / (m - (2 * this.get("selectedSpline").get("nurbs").degree) + 1));

        this.get("selectedSpline").get("nurbs").m = m;
        this.get("selectedSpline").get("nurbs").step = calStep;
        this.get("selectedSpline").get("nurbs").initializeTArray();
        //update spline<end>
        var funcSize = this.get("selectedSpline").get("functions").length + 1;
        var functions = [];
        var nurbs = this.get("selectedSpline").get("nurbs");

        for (var i = 0; i < funcSize; i++) {
            functions.push(nurbs.N(i, this.get("selectedSpline").get("nurbs").degree));
        }
        this.get("selectedSpline").set("functions", functions);
        this.getViewById(this.get("selectedSpline").get("splineId")).addControlPoint(pointData);

    },

    deletePointFromSelectedSpline: function(dataPoint, drawPoint) {

    },

    deleteSpline: function(id){

    },

    /*Работа с выбранным сплайном*/
    selectSpline: function (id) {
        if (id == null || utils.isUndefined(id)) {
            return;
        }

        if (this.get("selectedSpline") != null && !utils.isUndefined(this.get("selectedSpline")) &&
            this.get("selectedSpline").get("splineId") == id) {
            return;
        }

        this.set("selectedSpline", this.getSplineById(id));
        //send events
        this.trigger(ModelEvents.changes.splines.selectedSpline);
    },

    /* РАБОТА С ВЫБРАННОЙ ТОЧКОЙ */
    selectPoint: function (shape, data) {
        this.get("selectedPoint").set("selectedShape", shape);
        this.get("selectedPoint").set("backboneData", data);
        this.get("selectedPoint").set("isSelected", true);
    },

    unselectPoint: function () {
        this.get("selectedPoint").set("selectedShape", null);
        this.get("selectedPoint").set("backboneData", null);
        this.get("selectedPoint").set("isSelected", false);
    },

    getSelectedPoint: function () {
        if (this.get("selectedPoint") && this.get("selectedPoint").get("isSelected")) {
            return this.get("selectedPoint");
        }
        return null;
    }
});
