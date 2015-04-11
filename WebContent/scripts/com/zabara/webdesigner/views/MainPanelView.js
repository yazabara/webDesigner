var MainPanelView = Backbone.View.extend({

    //model
    splineManager: null,

    dialogs: {
        basicFunctionsDialog: null,
        assessmentDialog: null
    },

    render: function () {
        return this;
    },

    initialize: function (attr) {
        this.splineManager = attr.splineManager;

        $(EditorElements.mainPanel.opacitySlider).slider({
            value: 50,
            min: 0,
            max: 100,
            slide: $.proxy(function (event, ui) {
                if (this.splineManager.get("selectedSpline")) {
                    this.setOpacity(ui.value);
                    //WebEditorManager.canvasView.redraw();
                }
            }, this)
        });
        $(EditorElements.mainPanel.opacityInput).val($(EditorElements.mainPanel.opacitySlider).slider("value"));

        $(EditorElements.mainPanel.circlesMenu.circlesOpacitySlider).slider({
            value: 50,
            min: 0,
            max: 100,
            slide: $.proxy(function (event, ui) {
                if (this.splineManager.get("selectedSpline")) {
                    this.setCirclesOpacity(ui.value);
                    //WebEditorManager.canvasView.redraw();
                }
            }, this)
        });
        $(EditorElements.mainPanel.circlesMenu.circlesOpacityInput).val($(EditorElements.mainPanel.circlesMenu.circlesOpacitySlider).slider("value"));

        this.setEventsListeners();

        this.dialogs.basicFunctionsDialog = new BasicFuncView({
            canvasContainer: EditorElements.dialogs.basicFunctionsDialog.plot,
            dialogContainer: EditorElements.dialogs.basicFunctionsDialog.container
        });

        this.dialogs.assessmentDialog = new AssessmentView({
            canvasContainer: "#assessmentFunctions",
            dialogContainer: "#dialog-assessment"
        });

        $(EditorElements.mainPanel.buttons.showBasicFunctionsButton).click($.proxy(function(){
            if (!this.splineManager.get("selectedSpline")) {
                return;
            }
            if (this.dialogs.basicFunctionsDialog.dialog.dialog("isOpen")) {
                this.dialogs.basicFunctionsDialog.dialog.dialog("close");
            } else {
                this.dialogs.basicFunctionsDialog.dialog.dialog("open");
                this.dialogs.basicFunctionsDialog.redraw();
            }

        },this));

        $(EditorElements.mainPanel.buttons.showAssessment).click($.proxy(function(){
            if (!this.splineManager.get("selectedSpline")) {
                return;
            }
            if (this.dialogs.assessmentDialog.dialog.dialog("isOpen")) {
                this.dialogs.assessmentDialog.dialog.dialog("close");
            } else {
                this.dialogs.assessmentDialog.dialog.dialog("open");
                this.dialogs.assessmentDialog.redraw();
            }

        },this));
    },

    setEventsListeners: function () {
        if (!this.splineManager) {
            return;
        }
        $(EditorElements.mainPanel.splineId).change($.proxy(function () {
            spline = this.splineManager.getSplineById(parseInt($(EditorElements.mainPanel.splineId).val()));
            if (spline == null) {
                alert("id incorrect");
                return;
            }
            this.splineManager.selectSpline(spline.get("splineId"));
        }, this));

        $(EditorElements.mainPanel.controlLineCheckbox).change($.proxy(function () {
            if (this.splineManager.get("selectedSpline")) {
                this.getSelectedView().set("showLine", $(EditorElements.mainPanel.controlLineCheckbox).is(':checked'));
            }
        }, this));

        $(EditorElements.mainPanel.fillColorId).change($.proxy(function () {
            if (this.splineManager.get("selectedSpline")) {
                this.setFill($(EditorElements.mainPanel.fillColorId).val());
            }
        }, this));

        $(EditorElements.mainPanel.circlesMenu.circlesFillId).change($.proxy(function () {
            if (this.splineManager.get("selectedSpline")) {
                this.setCirclesFill($(EditorElements.mainPanel.circlesMenu.circlesFillId).val());
            }
        }, this));

        $(EditorElements.mainPanel.circlesMenu.circlesStrokeId).change($.proxy(function () {
            if (this.splineManager.get("selectedSpline")) {
                this.setCirclesStroke($(EditorElements.mainPanel.circlesMenu.circlesStrokeId).val());
            }
        }, this));

        $(EditorElements.mainPanel.strokeColorId).change($.proxy(function () {
            if (this.splineManager.get("selectedSpline")) {
                this.setColor($(EditorElements.mainPanel.strokeColorId).val());
            }
        }, this));

        $(EditorElements.mainPanel.opacityInput).change($.proxy(function () {
            if (this.splineManager.get("selectedSpline")) {
                this.setOpacity($(EditorElements.mainPanel.opacityInput).val());
            }
        }, this));

        $(EditorElements.mainPanel.circlesMenu.circlesOpacityInput).change($.proxy(function () {
            if (this.splineManager.get("selectedSpline")) {
                this.setCirclesOpacity($(EditorElements.mainPanel.circlesMenu.circlesOpacityInput).val());
            }
        }, this));

        $(EditorElements.mainPanel.splineDegree).change($.proxy(function () {
            var val = parseInt($(EditorElements.mainPanel.splineDegree).val());
            if (this.splineManager.get("selectedSpline")) {
                this.splineManager.setDegreeToSelectedSpline(val)
                this.splineManager.get("selectedSpline").calculate();
                //redraw dialog
                if (this.dialogs.basicFunctionsDialog != null) {
                    this.dialogs.basicFunctionsDialog.redraw();
                }
            }
        }, this));

        this.splineManager.on(ModelEvents.changes.views.opacity, this.updateOpacityView, this);
        this.splineManager.on(ModelEvents.changes.views.fill, this.updateFillView, this);
        this.splineManager.on(ModelEvents.changes.views.stroke, this.updateColorView, this);
        this.splineManager.on(ModelEvents.changes.splines.event, this.updateMainPanelView, this);
        this.splineManager.on(ModelEvents.changes.splines.selectedSpline, this.selectNewSpline, this);

        this.splineManager.on(ModelEvents.changes.views.circlesOpacity, this.updateOpacityCirclesView, this);
        this.splineManager.on(ModelEvents.changes.views.circlesFill, this.updateFillCirclesView, this);
        this.splineManager.on(ModelEvents.changes.views.circlesStroke, this.updateColorCirclesView, this);
    },

    updateMainPanelView: function () {
        //TODO хз
        //WebEditorManager.logger.debug("updateMainPanelView");
    },

    //изменен выбранный сплайн
    selectNewSpline: function () {
        if (!this.splineManager.get("selectedSpline")) {
            return;
        }
        this.setCirclesFill(this.getSelectedView().get("circlesFill"));
        this.setCirclesStroke(this.getSelectedView().get("circlesStroke"));
        this.setColor(this.getSelectedView().get("stroke"));
        this.setOpacity(this.getSelectedView().get("opacity") * globalSettings.opacityConst);
        this.setFill(this.getSelectedView().get("fill"));
        this.setCirclesOpacity(this.getSelectedView().get("circlesOpacity") * globalSettings.opacityConst);
        $(EditorElements.mainPanel.splineId).val(this.splineManager.get("selectedSpline").get("splineId"));
        $(EditorElements.mainPanel.splineDegree).val(this.splineManager.get("selectedSpline").get("nurbs").degree);
        $(EditorElements.mainPanel.controlLineCheckbox).attr('checked', this.getSelectedView().get("showLine"));
        //WebEditorManager.canvasView.redraw();
        //dialogs
        this.dialogs.basicFunctionsDialog.setAnySpline(this.splineManager.get("selectedSpline"));
        this.dialogs.assessmentDialog.setAnySpline(this.splineManager.get("selectedSpline"));
        this.dialogs.assessmentDialog.redraw();
    },

    updateFillView: function () {
        this.setFill(this.getSelectedView().get("fill"));
    },

    updateOpacityView: function () {
        this.setOpacity(this.getSelectedView().get("opacity") * globalSettings.opacityConst);
    },

    updateOpacityCirclesView: function () {
        this.setCirclesOpacity(this.getSelectedView().get("circlesOpacity") * globalSettings.opacityConst);
    },

    updateColorView: function () {
        this.setColor(this.getSelectedView().get("stroke"));
    },

    updateColorCirclesView: function () {
        this.setCirclesStroke(this.getSelectedView().get("circlesStroke"));
    },

    updateFillCirclesView: function () {
        this.setCirclesFill(this.getSelectedView().get("circlesFill"));
    },

    /* Дополнительные функции*/
    getSelectedView: function () {
        return this.splineManager.getViewById(this.splineManager.get("selectedSpline").get("splineId"));
    },

    setFill: function (color) {
        this.getSelectedView().set("fill", color);
        $(EditorElements.mainPanel.fillColorId).val(color);
        WebEditorManager.canvasView.redraw();
    },

    setCirclesFill: function (color) {
        this.getSelectedView().set("circlesFill", color);
        $(EditorElements.mainPanel.circlesMenu.circlesFillId).val(color);
        WebEditorManager.canvasView.redraw();
    },

    setCirclesStroke: function (color) {
        this.getSelectedView().set("circlesStroke", color);
        $(EditorElements.mainPanel.circlesMenu.circlesStrokeId).val(color);
        WebEditorManager.canvasView.redraw();
    },

    setOpacity: function (opacity) {
        this.getSelectedView().set("opacity", opacity / globalSettings.opacityConst);
        $(EditorElements.mainPanel.opacityInput).val(opacity);
        $(EditorElements.mainPanel.opacitySlider).slider('value', opacity);
        WebEditorManager.canvasView.redraw();
    },

    setCirclesOpacity: function (circlesOpacity) {
        this.getSelectedView().set("circlesOpacity", circlesOpacity / globalSettings.opacityConst);
        $(EditorElements.mainPanel.circlesMenu.circlesOpacityInput).val(circlesOpacity);
        $(EditorElements.mainPanel.circlesMenu.circlesOpacitySlider).slider('value', circlesOpacity);
        WebEditorManager.canvasView.redraw();
    },

    setColor: function (color) {
        this.getSelectedView().set("stroke", color);
        $(EditorElements.mainPanel.strokeColorId).val(color);
        WebEditorManager.canvasView.redraw();
    }

});