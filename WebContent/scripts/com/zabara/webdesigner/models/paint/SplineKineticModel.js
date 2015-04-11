/**
 * Класс свойств обьекта для рисования.
 * @type {*}
 */
var SplineKineticModel = Backbone.Model.extend({
    defaults: {
        //id сплайна в модели
        splineId: null,
        //тело сплайна (фигура)
        shapeBody: null,
        //id группы, где находится сплайн
        groupId: null,
        //круги сплайна (фигуры)
        circles: null,
        //линия которые соединяют круги контрольные
        line: null,
        //properties
        opacity: null,
        fill: null,
        stroke: null,
        //circles prop
        circlesOpacity: 0.5,
        circlesFill: globalSettings.defaultCirclesFillColor,
        circlesStroke: globalSettings.defaultCirclesStrokeColor,
        //line prop
        showLine: false
    },

    initialize: function () {
        $.proxy(this.on(ModelEvents.changes.views.fill, function () {
            if (this.get("shapeBody")) {
                WebEditorManager.logger.debug("SplineKineticModel has changed:fill " + this.get("fill"));
                this.get("shapeBody").setFill(this.get("fill"));
            }
        }), this);

        $.proxy(this.on(ModelEvents.changes.views.opacity, function () {
            if (this.get("shapeBody")) {
                WebEditorManager.logger.debug("SplineKineticModel has changed:opacity " + this.get("opacity"));
                this.get("shapeBody").setOpacity(this.get("opacity"));
            }
        }), this);

        $.proxy(this.on(ModelEvents.changes.views.stroke, function () {
            if (this.get("shapeBody")) {
                WebEditorManager.logger.debug("SplineKineticModel has changed:color " + this.get("stroke"));
                this.get("shapeBody").setStroke(this.get("stroke"));
            }
        }), this);

        //circles:
        $.proxy(this.on(ModelEvents.changes.views.circlesOpacity, function () {
            if (this.get("circles")) {
                WebEditorManager.logger.debug("SplineKineticModel has changed:circles opacity " + this.get("circlesOpacity"));
                $(this.get("circles")).each($.proxy(function (index, value) {
                    value.setOpacity(this.get("circlesOpacity"));
                }, this));
            }
        }), this);

        $.proxy(this.on(ModelEvents.changes.views.circlesFill, function () {
            if (this.get("circles")) {
                WebEditorManager.logger.debug("SplineKineticModel has changed:circles fill " + this.get("circlesFill"));
                $(this.get("circles")).each($.proxy(function (index, value) {
                    value.setFill(this.get("circlesFill"));
                }, this));
            }
        }), this);

        $.proxy(this.on(ModelEvents.changes.views.circlesStroke, function () {
            if (this.get("circles")) {
                WebEditorManager.logger.debug("SplineKineticModel has changed:circles stroke " + this.get("circlesStroke"));
                $(this.get("circles")).each($.proxy(function (index, value) {
                    value.setStroke(this.get("circlesStroke"));
                }, this));
            }
        }), this);

        $.proxy(this.on(ModelEvents.changes.views.showLine, function () {
            var opacity = this.get("showLine") == true ? globalSettings.defaultLineOpacity : 0;
            this.get("line").setOpacity(opacity);
            //вынужденно
            WebEditorManager.canvasView.redraw();
        }), this);
    },

    updateShapeBody: function (spline) {
        if (spline && this.get("shapeBody")) {
            var points = Approximation.anySpline.approximation(spline);
            var pointForShape = converters.splineToKinecticArray(points);
            this.get("shapeBody").setPoints(pointForShape);
        }
    },

    addControlPoint: function (pointData) {
        var newCirlce = new SplinePoint(pointData);
        //set prop
        newCirlce.setOpacity(this.get("circlesOpacity"));
        newCirlce.setFill(this.get("circlesFill"));
        newCirlce.setStroke(this.get("circlesStroke"));

        this.get("circles").push(newCirlce);
        //TODO add to canvas
        WebEditorManager.canvasView.addCircleToCanvas(this.get("groupId"), newCirlce,
            this.get("shapeBody"), this.get("line"), WebEditorManager.splineManager.getSplineById(this.get("splineId")));
    }


});