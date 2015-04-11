var AssessmentView = Backbone.View.extend({

    anySpline: null,
    plot: null,
    dialog: null,

    //settings
    isSetupGrid: true,


    initialize: function (attr) {
        this.plot = $.plot($(attr.canvasContainer), [], {
            series: {
                lines: { show: true },
                points: { show: true }
            },
            grid: {
                backgroundColor: { colors: ["#fff", "#eee"] }
            }
        });
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

        this.anySpline = attr.anySpline;
        //чтобы сразу под размер встал канвас с графиком
        this.dialog.width(620).height(320);
        this.redraw();
        this.setEventsListeners();
        this.dialog.dialog("close");
    },

    render: function () {
        return this;
    },

    setAnySpline: function(anyspline) {
        this.anySpline = anyspline;
        this.setEventsListeners();
    },

    setEventsListeners: function () {
        if (this.anySpline == null) {
            return;
        }
        this.anySpline.on(ModelEvents.changes.anySpline.calculatePoints, this.redraw, this);
    },

    redraw: function () {
        // если диалога нет - зачем считать?)
        if (!this.dialog.is(':visible')) {
            return;
        }
        this.plot.setData(this.getPointFromModel());
        if (this.isSetupGrid) {
            this.plot.setupGrid();
        }
        this.plot.draw();
    },

    getPointFromModel: function () {
        if (this.anySpline == null) {
            return [];
        }

        var points = this.anySpline.get("calculatePoints");
        var result = [];

        $.each(NyutonAssessmanet.getAssessment(points.models, this.anySpline.get("nurbs").degree), function (index, data) {
            var dataRes = [];
            $.each(data.data, function (i, d) {
                dataRes.push([d.get("x"), d.get("y")]);
            });
            result.push({
                label: "order " + data.order,
                data: dataRes
            });
        });

        return result;
    }

});