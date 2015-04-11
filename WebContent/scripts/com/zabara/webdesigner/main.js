WebEditorManager = {
    //main Class
    splineManager: null,
    //main Viewer
    canvasView: null,
    //main logger
    logger: new Log(Log.DEBUG, Log.consoleLogger),
    //текущий режим
    currentMode: SplineEditorModes.default,

    mainPanel: null,

    //main func "add spline"
    addSpline: function (anyspline) {
        anyspline.set("splineId", globalSettings.maxSplineModelId++);
        this.splineManager.addSpline(anyspline);
        this.canvasView.addAnySpline(anyspline);
        this.canvasView.redraw();
    },

    initialization: function () {
        this.splineManager = new SplineManager({
            splines: new SplineListModel(),
            selectedPoint: new SelectedPointModel()
        });

        this.canvasView = new CanvasView({
            el: $("#" + globalSettings.CONTAINER),
            splineManager: this.splineManager,
            stage: new Kinetic.Stage({
                container: globalSettings.CONTAINER,
                width: globalSettings.curMaxCanvasSize.width,
                height: globalSettings.curMaxCanvasSize.height
            })
        });

        this.mainPanel = new MainPanelView({
            splineManager: this.splineManager
        });
    },

    initializationModesEditor: function () {
        $(EditorElements.mainPanel.radioModes.container).buttonset();
        $(EditorElements.mainPanel.radioModes.default).change(function () {
            WebEditorManager.currentMode = SplineEditorModes.default;
        });
        $(EditorElements.mainPanel.radioModes.addSplinePoint).change(function () {
            WebEditorManager.currentMode = SplineEditorModes.addSplinePoint;
        });
        $(EditorElements.mainPanel.radioModes.deleteSplinePoint).change(function () {
            WebEditorManager.currentMode = SplineEditorModes.deleteSplinePoint;
        });
    }
};

$(function () {
    $(".dialog").hide();

    $('#add-spline').button().click(addNewSpline);
    $('#show-basic-functions').button();
    $(EditorElements.mainPanel.buttons.showAssessment).button();

    WebEditorManager.initialization();
    WebEditorManager.initializationModesEditor();
    //parallax
    /*$(function () {
     $('#stars-fore').scrollingParallax({
     staticSpeed: .15
     });

     $('#stars-aft').scrollingParallax({
     staticSpeed: .30
     });
     });*/
});

function addNewSpline() {
    var contrPoints = [
        new PointModel({x: 263, y: 86, t: 0, r: 10}),
        new PointModel({x: 320, y: 91, t: 0, r: 10}),
        new PointModel({x: 342, y: 96, t: 0, r: 10}),
        new PointModel({x: 382, y: 121, t: 0, r: 10})
    ];

    //TODO в будущем будут передавать от пользователя
    //задается:
    var degree = 1; // порядок
    var calStart = 0;
    var calEnd = 1;
    //считается
    var n = contrPoints.length;
    var m = degree + n + 1;
    var calStep = ((calEnd - calStart) / (m - (2 * degree) + 1));

    var nurbs = new NURBS({
        m: m, //зависит от порядка и количества точек
        calStart: calStart, //переменная задается
        calEnd: calEnd, //переменная задается
        calStep: calStep, // расчитывается от начала и конца
        degree: degree, //переменная задается.
        n: n
    });

    var functions = [nurbs.N(0, nurbs.degree), nurbs.N(1, nurbs.degree),
        nurbs.N(2, nurbs.degree), nurbs.N(3, nurbs.degree)];

    var settings = {
        controlPoints: converters.toPointCollection(contrPoints),
        functions: functions,
        nurbs: nurbs // Базисные вычисления конкретно для этого сплайна
    };

    var anyspline = new AnySpline(settings);
    WebEditorManager.addSpline(anyspline);

    //todo вынести для каждого сплайна(либо содавать либо переписывать)
    /*var plotView = new AssessmentView({
     canvasContainer: "#assessmentFunctions",
     dialogContainer: "#dialog-assessment",
     anySpline: anyspline
     });*/

    //$(".ui-dialog-titlebar").removeClass(" ui-corner-all");
}
