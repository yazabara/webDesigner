var SplineBody = function (anyspline) {

    var points = Approximation.anySpline.approximation(anyspline);
    var pointForShape = converters.splineToKinecticArray(points);

    var shape = new Kinetic.Polygon({
        points: pointForShape,
        fill: globalSettings.defaultSplineFillColor,
        stroke: globalSettings.defaultSplineStrokeColor,
        strokeWidth: 2,
        opacity: 0.5,
        alpha: 0.5
    });

    //add eventhandlers
    (function (anyspline) {
        shape.on("mousedown", function (evt) {
            WebEditorManager.splineManager.selectSpline(anyspline.get("splineId"));
        });
    })(anyspline);

    // add hover styling
    shape.on("mouseover", function () {
        document.body.style.cursor = "pointer";
    });
    shape.on("mouseout", function () {
        document.body.style.cursor = "default";
    });

    return shape;
};