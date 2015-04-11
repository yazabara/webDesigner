inter.CanvasView = Backbone.View.extend({

    stage: null,
    layer: null,
    canvasClass: ".kineticjs-content",

    render: function () {
        return this;
    },

    initialize: function (attr) {
        //инициализируем параметры
        this.stage = attr.stage;
        this.setResizable();

        this.layer = new Kinetic.Layer();
        this.stage.add(this.layer);
        //добавляем обработчики
        this.setEventsListeners();
        // добавляем дополнительные функции отрисовки
        this.addMousePositionView(this.stage);
    },

    setEventsListeners: function () {

    },

    setStage: function (stage) {
        this.stage = stage;
    },

    getStage: function () {
        return this.stage;
    },

    setResizable: function () {
        $("#" + globalSettings.CONTAINER).width(1200).height(1000).resizable({
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
                inter.WebInterpolationManager.interCanvasView.writeMessage(messageLayer, "x: " + x + ", y: " + y);
            });
        })(stage);
        stage.add(messageLayer);
    },

    writeMessage: function (messageLayer, message) {
        var context = messageLayer.getContext();
        messageLayer.clear();
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
    },

    drawCircles: function (points, color) {
        var group = new Kinetic.Group({
            draggable: true
        });

        var ccolor = color || globalSettings.defaultCirclesFillColor;

        for (var i =0; i < points.length; i++) {
            var data = points.at(i);
            var circle = new Kinetic.Circle({
                x:data.get("x"),
                y:data.get("y"),
                radius:data.get("r") + globalSettings.Eps,
                fill:ccolor,
                stroke:globalSettings.defaultCirclesStrokeColor,
                strokeWidth:2,
                draggable:true,
                opacity: 0.5
            });
            var simpleText = new Kinetic.Text({
                x:data.get("x"),
                y:data.get("y"),
                text: i,
                fontSize: 30,
                fontFamily: 'Calibri',
                fill: 'green'
            });
            group.add(simpleText);
            group.add(circle);
        }
        this.layer.add(group);
        this.stage.draw();
    }
});