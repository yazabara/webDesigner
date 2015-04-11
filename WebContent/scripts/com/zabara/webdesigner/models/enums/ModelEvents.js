var ModelEvents = {
    changes: {
        //SplineManager splines event's
        splines: {
            event: "change:splines",
            selectedSpline: "change:selectedSpline",
            addSpline: "change:addSpline"
        },

        //SplineManager views event's
        views: {
            event: "change:views",
            fill: "change:fill",
            stroke: "change:stroke",
            opacity: "change:opacity",
            circlesOpacity: "change:circlesOpacity",
            circlesFill: "change:circlesFill",
            circlesStroke: "change:circlesStroke",
            showLine: "change:showLine",
            addView: "change:addView"
        },

        //aneSpline event's
        anySpline: {
            event: "change:anySpline",
            controlPoints: "change:anySpline_controlPoints",
            functions: "change:anySpline_functions",
            nurbs: "change:anySpline_nurbs",
            coefficients: "change:anySpline_coefficients",
            calculatePoints: "change:anySpline_calculatePoints"
        }
    }
};