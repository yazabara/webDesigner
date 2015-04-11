var EditorElements = {
    mainPanel: {
        //основная панель
        id: "#spline-main-panel",
        //инпут для номера сплайна
        splineId: "#id-spline",
        //выбор цвета для заливки фигуры
        fillColorId: "#color-picker",
        //выбор цвета для окантовки фигуры
        strokeColorId: "#stroke-picker",
        //ввод для прозрачности фигуры
        opacityInput: "#opacity-body-spline-input",
        //слайдер для прозрачности фигуры
        opacitySlider: "#opacity-body-spline-slide",
        //инпут порядка сплайна
        splineDegree: "#spline-degree",
        //canvas'ы
        canvasClass: ".kineticjs-content",

        controlLineCheckbox: "#control-line-checkbox",

        circlesMenu: {
            //инпут прозрачности контрольных кругов
            circlesOpacityInput: "#opacity-circles-spline-input",
            //слайдер прозрачности кругов контрольных
            circlesOpacitySlider: "#opacity-circles-spline-slide",
            //выбор цвета для заливки фигуры
            circlesFillId: "#color-circles-picker",
            //выбор цвета для окантовки фигуры
            circlesStrokeId: "#stroke-circles-picker"
        },

        // режимы канваса
        radioModes: {
            container: "#radio",
            default :"#default-mode",
            addSplinePoint: "#add-spline-point-mode",
            deleteSplinePoint: "#delete-spline-point-mode"
        },

        buttons: {
            showBasicFunctionsButton: "#show-basic-functions",
            showAssessment: "#show-assessment"
        }
    },
    dialogs: {
        basicFunctionsDialog: {
            container: "#dialog-function",
            plot:"#basicFunctions"
        }
    }
};