function NyutonAssessmanet() {
};

NyutonAssessmanet.getAssessment = function (points, order) {
    var result = [];
    var calculatePoints = points;
    //идем по всем порядкам
    for (var i = 0; i < order; i++) {
        //по всем точкам.
        calculatePoints = NyutonAssessmanet._getAssessment(calculatePoints);
        result.push({
            data: calculatePoints,
            order: i
        });
    }
    return result;
};

NyutonAssessmanet._getAssessment = function (calculatePoints) {
    var result = [];
    for (var i = 1; i < calculatePoints.length - 1; i++) {
        //result.push(calculatePoints[i].get("x"), NyutonAssessmanet.getDerivativeValue(calculatePoints[i], calculatePoints[i - 1]));
        result.push(new PointModel({
            x: calculatePoints[i].get("x"),
            y: NyutonAssessmanet.getDerivativeValue(calculatePoints[i], calculatePoints[i - 1])
        }));
    }
    return result;
};

NyutonAssessmanet.getDerivativeValue = function (pi, pi_1) {
    var delta = pi_1.get("x") - pi.get("x");
    if (delta == 0) {
        delta = 0.001;
    }
    return (pi_1.get("y") - pi.get("y")) / delta;
};
