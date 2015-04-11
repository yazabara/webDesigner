function converters() {
}

converters.splineToKinecticArray = function (points) {
    var pointForShape = [];
    $(points.left).each(function (index, value) {
        pointForShape.push(value.x);
        pointForShape.push(value.y);
    });
    for (var i = points.right.length - 1; i > 0; i--) {
        pointForShape.push(points.right[i].x);
        pointForShape.push(points.right[i].y);
    }
    return pointForShape;
};

converters.controlPointsToKinecticArray = function (anyspline) {
    var result = [];
    for (var i = 0; i < anyspline.get("controlPoints").length; i++) {
        result.push(anyspline.get("controlPoints").at(i).get("x"));
        result.push(anyspline.get("controlPoints").at(i).get("y"));
    }
    return result;
};


/**
 *
 * @param controlPoints
 * @returns {PointListCollection}
 */
converters.toPointCollection = function (controlPoints) {
    var controlPoints1 = new PointListCollection();
    $.each(controlPoints, function (index, data) {
        controlPoints1.add(new PointModel({
            x: data.get("x"),
            y: data.get("y"),
            z: data.get("z"),
            t: data.get("t"),
            r: data.get("r")
        }));
    });
    return controlPoints1;
};

/**
 *
 * @param controlPoints
 * @returns {PointListCollection}
 */
converters.toPointCollectionFromObjectArray = function (controlPoints) {
    var controlPoints1 = new PointListCollection();
    $.each(controlPoints, function (index, data) {
        controlPoints1.add(new PointModel({
            x: data.x,
            y: data.y,
            z: data.z,
            t: data.t,
            r: data.r
        }));
    });
    return controlPoints1;
};


converters.toObjectArrayFromPointCollection = function (controlPoints) {
    var controlPoints1 = [];
    for(var i =0; i < controlPoints.length; i++) {
        var data = controlPoints.at(i);
        controlPoints1.push({
            x: data.get("x"),
            y: data.get("y"),
            z: data.get("z"),
            t: data.get("t"),
            r: data.get("r")
        });
    }
    return controlPoints1;
};


/**
 *
 * @param gradus
 * @returns {number}
 */
converters.gradusToRadian = function (gradus) {
    return (180 / Math.PI) * gradus;
};


