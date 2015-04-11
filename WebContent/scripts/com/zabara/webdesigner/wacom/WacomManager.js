wacom.WacomManager = {

    //points collection (PointListCollection class)
    points: null,
    //api for wacom tables
    penAPI: null,
    //stage (canvas-painter)
    stage: null,
    layer: null,
    //div-container for canvas
    painter: null,

    lastGroup: null,

    //для нажатия
    capturing: false,

    //храним последние нажатые координаты, чтобы не записывать одиннаковые(+- eps)
    lastMousePos: null,

    initialization: function (stage) {
        this.fillPluginInfo();
        this.painter = $("#painter");
        this.stage = stage;

        this.layer = new Kinetic.Layer();
        this.stage.add(this.layer);


        this.painter.mousemove($.proxy(this.mouseMove, this));
        this.painter.mouseup($.proxy(this.mouseUp, this));
        this.painter.mousedown($.proxy(this.mouseDown, this));

    },

    fillPluginInfo: function () {
        //плагин есть
        if (this.plugin() && this.plugin().version && !utils.isUndefined(this.plugin().version)) {
            this.penAPI = this.plugin().penAPI;
            $("#plugin-version #version-lbl").text(this.plugin().version);
        } else {
            $("#plugin-version #version-lbl").text("Плагин не установлен или нe работает на этом браузере");
        }
    },

    plugin: function () {
        return document.getElementById('wtPlugin');
    },

    mouseDown: function (evt) {
        //console.log("MOUSE:DOWN");

        this.capturing = true;

        this.mouseMove(evt);
    },

    mouseMove: function (event) {

        if (!this.capturing) {
            return;
        }
        //console.log("MOUSE:MOVE");
        var pressure = 0.0;
        var isEraser;

        if (this.penAPI) {
            switch (this.penAPI.pointerType) {
                case wacom.PointerTypes.PEN:
                    pressure = this.penAPI.pressure;
                    isEraser = this.penAPI.isEraser;
                    break;
                default :
                    pressure = 0.5;
                    isEraser = false;
                    $("#error-message").text("Тип пера не PEN(" + wacom.PointerTypes.getDesc(this.penAPI.pointerType) + "). Сила нажатия не учитывается");
                    break;
            }

        }
        else {
            $("#error-message").text("Плагин не установлен или н работает на этом браузере. Сила нажатия не учитывается");
            pressure = 0.5;
            isEraser = false;
        }

        var mousePos = this.stage.getMousePosition();

        if (this.lastMousePos) {
            if (utils.isNear(mousePos.x, this.lastMousePos.x, globalSettings.Eps) &&
                utils.isNear(mousePos.y, this.lastMousePos.y, globalSettings.Eps)) {
                return;
            }
        }
        this.lastMousePos = mousePos;
        //console.log("X: " + mousePos.x + "  , Y: " + mousePos.y);

        var point = new Kinetic.Circle({
            x: mousePos.x,
            y: mousePos.y,
            radius: globalSettings.MAX_CONTROL_POINT_SIZE * pressure,
            fill: globalSettings.defaultCirclesFillColor,
            stroke: globalSettings.defaultCirclesStrokeColor,
            strokeWidth: 2,
            draggable: true,
            opacity: 0.5
        });

        if (this.lastGroup) {
            this.lastGroup.add(point);
        } else {
            this.lastGroup = new Kinetic.Group({
                draggable: true
            });
            this.lastGroup.add(point);
            this.layer.add(this.lastGroup);
        }
        this.stage.draw();
    },

    mouseUp: function () {
        //console.log("MOUSE:UP");
        this.capturing = false;
        this.lastGroup = null;
        var points = this.getPointsForGroupByIndex(this.layer.getChildren().length-1);
        var truePoints = inter.Appx.getTruePointsWithMeasure(points,5);

        var restoredSplineCollection = inter.RestoreSpline.restore(converters.toPointCollectionFromObjectArray(truePoints));
        var restoredSplineArray = converters.toObjectArrayFromPointCollection(restoredSplineCollection);

//        gg = new Kinetic.Group({
//            draggable: true
//        });
//        for(var i =0;i < truePoints.length; i++) {
//            var point = new Kinetic.Circle({
//                x: truePoints[i].x,
//                y: truePoints[i].y,
//                radius: truePoints[i].r,
//                fill: "red",
//                stroke: globalSettings.defaultCirclesStrokeColor,
//                strokeWidth: 2,
//                draggable: true,
//                opacity: 0.5
//            });
//            gg.add(point);
//        }
//        this.layer.add(gg);


        var pointsToPolygon = Approximation.anySpline._appx(restoredSplineCollection.models);
        var pointForShape = converters.splineToKinecticArray(pointsToPolygon);

        var shape = new Kinetic.Polygon({
            points: pointForShape,
            fill: globalSettings.defaultSplineFillColor,
            stroke: globalSettings.defaultSplineStrokeColor,
            strokeWidth: 2,
            opacity: 0.5,
            alpha: 0.5
        });

        this.layer.add(shape);


        this.stage.draw();
    },

    getPointsForAllGroups: function () {
        var childrens = this.layer.getChildren();
        var groupsPoints = [];

        $.each(childrens, function (index, group) {
            groupsPoints.push(this.getPointsForGroupByIndex(index));
        });

        return groupsPoints;
    },

    getPointsForGroupByIndex: function (groupIndex) {
        if(groupIndex == null || utils.isUndefined(groupIndex) || groupIndex < 0){
            return null;
        }

        var childrens = this.layer.getChildren();
        var group = childrens[groupIndex];
        var points = [];
        if (group.nodeType == "Group") {

            $.each(group.children, function (pointIndex, point) {
                if (point.nodeType == "Shape" && point.shapeType == "Circle") {
                    points.push({
                        x: point.attrs.x,
                        y: point.attrs.y,
                        r: point.attrs.radius
                    });
                }
            });
        }
        return points;
    }


};