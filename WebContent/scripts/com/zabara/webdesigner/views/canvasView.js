var CanvasView = Backbone.View.extend({

    stage: null,
    layer: null,
    splineManager: new SplineManager(),

    canvasClass: ".kineticjs-content",

    render: function () {
        return this;
    },

    initialize: function (attr) {
        //инициализируем параметры
        this.stage = attr.stage;
        this.splineManager = attr.splineManager;
        this.setResizable();

        this.layer = new Kinetic.Layer();
        this.stage.add(this.layer);
        //добавляем обработчики
        this.setEventsListeners();
        // добавляем дополнительные функции отрисовки
        this.addMousePositionView(this.stage);
        this.AddMouseWheelHandler();


        //добавлениt новой точки сплайна
        (function (stage, splineManager) {
            var canvas = $("drawContainer").context;
            canvas.addEventListener("click", function () {
                var mousePos = stage.getMousePosition();
                if (!mousePos || !mousePos.x || !mousePos.y) {
                    return;
                }
                //add spline point
                if (WebEditorManager.currentMode == SplineEditorModes.addSplinePoint) {
                    splineManager.addPointToSelectedSpline({
                        x: mousePos.x,
                        y: mousePos.y,
                        r: globalSettings.radius
                    });
                }
            });
        })(this.stage, this.splineManager);
    },

    setEventsListeners: function () {
        this.splineManager.on(ModelEvents.changes.splines.event, this.updateSplines, this);
    },

    setStage: function (stage) {
        this.stage = stage;
    },

    getStage: function () {
        return this.stage;
    },

    setResizable: function () {
        $("#" + globalSettings.CONTAINER).width(800).height(600).resizable({
            minWidth: 400,
            minHeight: 400
        });

        (function (stage) {
            $('#' + globalSettings.CONTAINER).resize(function () {
                if ($('#painter').width() > globalSettings.curMaxCanvasSize.width) {
                    globalSettings.curMaxCanvasSize.width = globalSettings.curMaxCanvasSize.width * 2;
                    stage.setSize(globalSettings.curMaxCanvasSize.width, globalSettings.curMaxCanvasSize.height);
                }
                if ($('#' + globalSettings.CONTAINER).height() > globalSettings.curMaxCanvasSize.height) {
                    globalSettings.curMaxCanvasSize.height = globalSettings.curMaxCanvasSize.height * 2;
                    stage.setSize(globalSettings.curMaxCanvasSize.width, globalSettings.curMaxCanvasSize.height);
                }
            });
        })(this.stage);
    },

    updateSplines: function () {
        this.splineManager.updateViews();
        //вынуждено
        this.redraw();
    },

    redraw: function () {

        WebEditorManager.logger.debug("redraw");
        this.stage.draw();
    },

    addMousePositionView: function (stage) {
        var messageLayer = new Kinetic.Layer();
        var canvas = $("drawContainer").context;
        (function (stage) {
            canvas.addEventListener('mousemove', function (evt) {
                var mousePos = stage.getMousePosition();
                if (!mousePos || !mousePos.x || !mousePos.y) {
                    return;
                }
                var x = mousePos.x;
                var y = mousePos.y;
                WebEditorManager.canvasView.writeMessage(messageLayer, "x: " + x + ", y: " + y);
            });
        })(stage);
        stage.add(messageLayer);
    },

    AddMouseWheelHandler: function () {
        //mouse scroll
        $($(".kineticjs-content")[0].children).mousewheel($.proxy(function (event, delta) {
            if (this.splineManager.getSelectedPoint()) {
                var r = this.splineManager.getSelectedPoint().get("selectedShape").getRadius();//если старая версия кинектика - то getRadius().x
                delta = globalSettings.SCROLL_COEFFICIENT * delta;
                if (r + delta > globalSettings.MIN_CONTROL_POINT_SIZE && delta < 0) {
                    this.splineManager.getSelectedPoint().get("backboneData").set("r", r + delta);
                }
                if (r - delta < globalSettings.MAX_CONTROL_POINT_SIZE && delta > 0) {
                    this.splineManager.getSelectedPoint().get("backboneData").set("r", r + delta);
                }
                this.splineManager.get("selectedSpline").calculate();
                //вынуждено
                this.redraw();
            }

        }, this));
    },

    addAnySpline: function (anyspline) {
        var group = new Kinetic.Group({
            draggable: true
        });
        var splineLine = new Kinetic.Line({
            dashArray: [10, 10, 0, 10],
            strokeWidth: 3,
            stroke: "black",
            lineCap: "round",
            id: "quadLine",
            opacity: 0,
            alpha: 0
        });
        var pointForShape = converters.controlPointsToKinecticArray(anyspline);
        splineLine.setPoints(pointForShape);
        var shape = new SplineBody(anyspline);
        var calculatePoints = anyspline.calculate();
        var circles = [];

        for (var i = 0; i < anyspline.get("controlPoints").length; i++) {
            var data = anyspline.get("controlPoints").at(i);
            var circle = new SplinePoint(data);
            this.addSplineEventDependency(circle, shape, anyspline, splineLine);
            group.add(circle);
            circles.push(circle);
        }
        group.add(splineLine);
        group.add(shape);
        //todo где искать все группы(сплайны)
        this.stage.children[0].add(group);
        WebEditorManager.splineManager.addView(anyspline.get("splineId"), shape, circles, splineLine, group._id);
    },

    writeMessage: function (messageLayer, message) {
        var context = messageLayer.getContext();
        messageLayer.clear();
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
    },

    addCircleToCanvas: function (groupId, circle, shape, splineLine, anyspline) {
        if (this.stage == null || this.stage.getChildren() == null || this.stage.getChildren().length < 1 ||
            this.stage.getChildren()[0].getChildren() == null) {
            return;
        }
        var group = null;
        for (var i = 0; i < this.stage.getChildren()[0].getChildren().length; i++) {
            if (this.stage.getChildren()[0].getChildren()[i]._id == groupId) {
                group = this.stage.getChildren()[0].getChildren()[i];
                break;
            }
        }
        if (group == null) {
            return;
        }
        this.addSplineEventDependency(circle, shape, anyspline, splineLine);
        group.add(circle);
        // актуальные данные + перерисовка
        anyspline.calculate();
    },

    addSplineEventDependency: function (circle, shape, anyspline, splineLine) {
        (function (anyspline, splineLine, shape, circle) {
            circle.on("dragmove", function (evnt) {
                //перерасчет сплайна
                anyspline.calculate();
                //изменение тела сплайна
                shape.setPoints(converters.splineToKinecticArray(Approximation.anySpline.approximation(anyspline)));
                //изменение линии редактирования
                splineLine.setPoints(converters.controlPointsToKinecticArray(anyspline));
            });
        })(anyspline, splineLine, shape, circle);

    }

});

