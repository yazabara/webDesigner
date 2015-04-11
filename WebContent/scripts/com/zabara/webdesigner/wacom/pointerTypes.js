wacom.PointerTypes = {
    PEN: 1, // ручка
    MOUSE: 2, //мышь
    ERASER: 3, //ластик
    OTHER: 4, // другое

    getDesc: function (penType, language) {
        var lang = language || "RU";
        switch (lang) {
            case "RU":
                switch (penType) {
                    case this.PEN:
                        return "Ручка";
                    case  this.MOUSE:
                        return "Мышь";
                    case this.ERASER:
                        return "Ластик";
                    case  this.OTHER:
                        return "Другое(!)";
                }
                break;
            case "EN":
                switch (penType) {
                    case this.PEN:
                        return "Pen";
                    case  this.MOUSE:
                        return "Mouse";
                    case this.ERASER:
                        return "Eraser";
                    case  this.OTHER:
                        return "Other";
                }
                break;
            default :
                switch (penType) {
                    case this.PEN:
                        return "Ручка";
                    case  this.MOUSE:
                        return "Мышь";
                    case this.ERASER:
                        return "Ластик";
                    case  this.OTHER:
                        return "Другое(!)";
                }
        }
    }
};