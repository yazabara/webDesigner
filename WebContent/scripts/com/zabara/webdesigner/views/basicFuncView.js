var BasicFuncView = Backbone.View.extend({

    anySpline: null,
    plot: null,
    dialog: null,

    //settings
    step: 0.005,

    initialize: function (attr) {
        this.dialog = $(attr.dialogContainer).dialog({
            height: 325,
            width: 635,
            minWidth: 500,
            minHeight: 300,
            resize: function () {
                $(attr.canvasContainer).width($(attr.dialogContainer).width() - 15);
                $(attr.canvasContainer).height($(attr.dialogContainer).height() - 15);
            }
        });

        this.plot = $.plot($(attr.canvasContainer), [], {
            series: {
                lines: { show: true },
                points: { show: true }
            },
            grid: {
                backgroundColor: { colors: ["#fff", "#eee"] }
            }
        });

        this.dialog.width(620).height(320);
        this.dialog.dialog("close");
        this.setAnySpline(attr.anySpline);
    },

    setAnySpline: function(anyspline) {
        this.anySpline = anyspline;
        this.redraw();
    },

    redraw: function() {
        if (this.anySpline != null && !utils.isUndefined(this.anySpline) && this.dialog.dialog("isOpen")) {
            this.drawBasicFunctions(
                this.getNurbsFucntionPoints(this.anySpline.get("functions"),
                    this.anySpline.get("nurbs")
                ));
            this.plot.setupGrid();
            this.plot.draw();
        }
    },

    //функция считает
    getNurbsFucntionPoints: function (functions, nurbs) {
        var funcArray = [];
        for (var i = 0; i < functions.length; i++) {
            var array = [];
            var t = nurbs.tArray[nurbs.degree - 1];
            for (t; t <= nurbs.end + this.step; t += this.step) {
                var y = functions[i](t, nurbs);
                array.push([t, y]);//x,y
            }
            funcArray.push(array);
        }
        return funcArray;
    },

    drawBasicFunctions: function (funcArray) {
        var obj = [];
        $.each(funcArray, function (index, data) {
            obj.push({
                label: "basic func #" + index,
                data: data
            });
        });
        this.plot.setData(obj);
    }

});