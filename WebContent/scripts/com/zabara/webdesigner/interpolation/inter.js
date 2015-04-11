var inter = {
    //package for interpolation
    //http://matlab.exponenta.ru/spline/book1/4.php

    WebInterpolationManager: {

        //тестовый канвас
        interCanvasView: null,

        initialization: function () {
            this.interCanvasView = new inter.CanvasView({
                el: $("#" + globalSettings.CONTAINER),
                stage: new Kinetic.Stage({
                    container: globalSettings.CONTAINER,
                    width: globalSettings.curMaxCanvasSize.width,
                    height: globalSettings.curMaxCanvasSize.height
                })
            });
        }
    }
};