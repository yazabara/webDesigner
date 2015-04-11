$(function () {
    //Start
    inter.WebInterpolationManager.initialization();

    wacom.WacomManager.initialization(inter.WebInterpolationManager.interCanvasView.stage);

    var contrPoints = [
        new PointModel({x: 63, y: 86, t: 0, r: 10}),
        new PointModel({x: 120, y: 91, t: 0, r: 10}),
        new PointModel({x: 242, y: 96, t: 0, r: 10}),
        new PointModel({x: 482, y: 121, t: 0, r: 10}),
        new PointModel({x: 682, y: 200, t: 0, r: 10}),
        new PointModel({x: 782, y: 400, t: 0, r: 10}),
        new PointModel({x: 482, y: 550, t: 0, r: 10}),
        new PointModel({x: 382, y: 650, t: 0, r: 10}),
        new PointModel({x: 282, y: 250, t: 0, r: 10})
    ];
    //test1();
    //test();

    //inter.WebInterpolationManager.interCanvasView.drawCircles(converters.toPointCollection(contrPoints),"red");
    //var points = inter.RestoreSpline.restore(converters.toPointCollection(contrPoints));
    //inter.WebInterpolationManager.interCanvasView.drawCircles(points);
});

function test() {

    var B = [5, 6, 4, -3];
    var N = 4;

    var C = [0, 3 , 1, 1];
    var A = [ 3, 1, -2];
    var D = [8, 10, 3, -2];

    console.log(utils.progonkaSolution(C, B, A, D));
}

function test1() {
    points = [];
    points.push({
        x: 120,
        y: 120,
        r: 20
    });
    points.push({
        x: 145,
        y: 170,
        r: 20
    });
    points.push({
        x: 170,
        y: 200,
        r: 20
    });
    points.push({
        x: 195,
        y: 250,
        r: 20
    });
    points.push({
        x: 220,
        y: 250,
        r: 20
    });
    points.push({
        x: 250,
        y: 230,
        r: 20
    });
    points.push({
        x: 270,
        y: 190,
        r: 20
    });
    points.push({
        x: 280,
        y: 150,
        r: 20
    });
    points.push({
        x: 300,
        y: 120,
        r: 20
    });
    points.push({
        x: 350,
        y: 120,
        r: 20
    });
    points.push({
        x: 400,
        y: 120,
        r: 20
    });
    points.push({
        x: 500,
        y: 120,
        r: 20
    });
    points.push({
        x: 600,
        y: 120,
        r: 20
    });
    points.push({
        x: 620,
        y: 150,
        r: 20
    });
    points.push({
        x: 650,
        y: 180,
        r: 20
    });
    points.push({
        x: 700,
        y: 120,
        r: 20
    });


   var gg1 = new Kinetic.Group({
        draggable: true
    });
    for (var i = 0; i < points.length; i++) {
        var point = new Kinetic.Circle({
            x: points[i].x,
            y: points[i].y,
            radius: points[i].r,
            fill: globalSettings.defaultCirclesFillColor,
            stroke: globalSettings.defaultCirclesStrokeColor,
            strokeWidth: 2,
            draggable: true,
            opacity: 0.5
        });
        gg1.add(point);
    }
    wacom.WacomManager.layer.add(gg1);



    var truePoints = inter.Appx.getTruePoints(points);
   var gg = new Kinetic.Group({
        draggable: true
    });
    for (var i = 0; i < truePoints.length; i++) {
        var point = new Kinetic.Circle({
            x: truePoints[i].x,
            y: truePoints[i].y,
            radius: truePoints[i].r,
            fill: "red",
            stroke: globalSettings.defaultCirclesStrokeColor,
            strokeWidth: 2,
            draggable: true,
            opacity: 0.5
        });
        gg.add(point);
    }
    wacom.WacomManager.layer.add(gg);
    wacom.WacomManager.stage.draw();
}