/**
 * Представление редатируемого круга
 *
 * @param data
 * @return {Kinetic.Circle}
 * @constructor
 */
var SplinePoint = function (data) {
    var circle = new Kinetic.Circle({
        x:data.get("x"),
        y:data.get("y"),
        radius:data.get("r") + globalSettings.Eps,
        fill:globalSettings.defaultCirclesFillColor,
        stroke:globalSettings.defaultCirclesStrokeColor,
        strokeWidth:2,
        draggable:true,
        opacity: 0.5
    });
    this.addViewHandlers(circle, data);
    this.addModelhandlers(circle, data);
    return circle;
};

SplinePoint.prototype.addViewHandlers = function (circle, data) {
    //add eventhandlers
    (function (data) {
        circle.on("mousedown", function (evt) {
            if (WebEditorManager.currentMode == SplineEditorModes.deleteSplinePoint) {
                WebEditorManager.splineManager.deletePointFromSelectedSpline(data,circle);
            } else {
                WebEditorManager.splineManager.selectPoint(this, data);
                WebEditorManager.splineManager.selectSpline(data.get("splineId"));
                // SET-DRAGGBLE - нужно (если нажата - то тянуть только круги, иначе тянуть всё)
                this.parent.setDraggable(false);
            }
        });
    })(data);
    //срабатывает при отпускании после ЗАЖАТИЯ(mousedown)
    circle.on("dragend", function (evt) {
        //WebEditorManager.splineManager.unselectPoint();
        // SET-DRAGGBLE - нужно (если нажата - то тянуть только круги, иначе тянуть всё)
        this.parent.setDraggable(true);
    });

    circle.on("mouseup", function (evt) {
        //WebEditorManager.splineManager.unselectPoint();
        // SET-DRAGGBLE - нужно (если нажата - то тянуть только круги, иначе тянуть всё)
        this.parent.setDraggable(true);
    });
    // add hover styling
    circle.on("mouseover", function () {
        document.body.style.cursor = "pointer";
    });
    circle.on("mouseout", function () {
        document.body.style.cursor = "default";
    });

    data.set({shape:circle});
    (function (data) {
        circle.on("dragmove", function (evnt) {
            data.set({x:this.attrs.x});
            data.set("y", this.attrs.y);
            // SET-DRAGGBLE - нужно (если нажата - то тянуть только круги, иначе тянуть всё)
            this.parent.setDraggable(true);
        });
    })(data);
};

/**
 *
 * @param circle - kinectic object
 * @param data - splineManager object
 */
SplinePoint.prototype.addModelhandlers = function (circle, data) {
    (function (circle) {
        data.on("change:x", function (model, newX) {
            circle.setX(newX);
        });
    })(circle);
    (function (circle) {
        data.on("change:y", function (model, newY) {
            circle.setY(newY);
        });
    })(circle);
    (function (circle) {
        data.on("change:r", function (model, newR) {
            circle.setRadius(newR);
        });
    })(circle);
};

