/**
 * KineticJS JavaScript Library v3.10.5
 * http://www.kineticjs.com/
 * Copyright 2012, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Aug 02 2012
 *
 * Copyright (C) 2011 - 2012 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Kinetic = {};
Kinetic.Filters = {}, Kinetic.Plugins = {}, Kinetic.Global = {BUBBLE_WHITELIST:["mousedown", "mousemove", "mouseup", "mouseover", "mouseout", "click", "dblclick", "touchstart", "touchmove", "touchend", "tap", "dbltap", "dragstart", "dragmove", "dragend"], stages:[], idCounter:0, tempNodes:{}, maxDragTimeInterval:20, drag:{moving:!1, offset:{x:0, y:0}, lastDrawTime:0}, warn:function (a) {
    console && console.warn && console.warn("Kinetic warning: " + a)
}, _pullNodes:function (a) {
    var b = this.tempNodes;
    for (var c in b) {
        var d = b[c];
        d.getStage() !== undefined && d.getStage()._id === a._id && (a._addId(d), a._addName(d), this._removeTempNode(d))
    }
}, _addTempNode:function (a) {
    this.tempNodes[a._id] = a
}, _removeTempNode:function (a) {
    delete this.tempNodes[a._id]
}}, Kinetic.Transition = function (a, b) {
    function d(a, b, e, f) {
        for (var g in a)g !== "duration" && g !== "easing" && g !== "callback" && (Kinetic.Type._isObject(a[g]) ? (e[g] = {}, d(a[g], b[g], e[g], f)) : c._add(c._getTween(b, g, a[g], e, f)))
    }

    this.node = a, this.config = b, this.tweens = [];
    var c = this, e = {};
    d(b, a.attrs, e, e);
    var f = 0;
    for (var g = 0; g < this.tweens.length; g++) {
        var h = this.tweens[g];
        h.onFinished = function () {
            f++, f >= c.tweens.length && c.onFinished()
        }
    }
}, Kinetic.Transition.prototype = {start:function () {
    for (var a = 0; a < this.tweens.length; a++)this.tweens[a].start()
}, stop:function () {
    for (var a = 0; a < this.tweens.length; a++)this.tweens[a].stop()
}, resume:function () {
    for (var a = 0; a < this.tweens.length; a++)this.tweens[a].resume()
}, _onEnterFrame:function () {
    for (var a = 0; a < this.tweens.length; a++)this.tweens[a].onEnterFrame()
}, _add:function (a) {
    this.tweens.push(a)
}, _getTween:function (a, b, c, d, e) {
    var f = this.config, g = this.node, h = f.easing;
    h === undefined && (h = "linear");
    var i = new Kinetic.Tween(g, function (a) {
        d[b] = a, g.setAttrs(e)
    }, Kinetic.Tweens[h], a[b], c, f.duration);
    return i
}}, Kinetic.Filters.Grayscale = function () {
    var a = this.imageData.data;
    for (var b = 0; b < a.length; b += 4) {
        var c = .34 * a[b] + .5 * a[b + 1] + .16 * a[b + 2];
        a[b] = c, a[b + 1] = c, a[b + 2] = c
    }
}, Kinetic.Type = {_isElement:function (a) {
    return!!a && a.nodeType == 1
}, _isFunction:function (a) {
    return!!(a && a.constructor && a.call && a.apply)
}, _isObject:function (a) {
    return!!a && a.constructor == Object
}, _isArray:function (a) {
    return Object.prototype.toString.call(a) == "[object Array]"
}, _isNumber:function (a) {
    return Object.prototype.toString.call(a) == "[object Number]"
}, _isString:function (a) {
    return Object.prototype.toString.call(a) == "[object String]"
}, _hasMethods:function (a) {
    var b = [];
    for (var c in a)this._isFunction(a[c]) && b.push(c);
    return b.length > 0
}, _getXY:function (a) {
    if (this._isNumber(a))return{x:a, y:a};
    if (this._isArray(a)) {
        if (a.length === 1) {
            var b = a[0];
            if (this._isNumber(b))return{x:b, y:b};
            if (this._isArray(b))return{x:b[0], y:b[1]};
            if (this._isObject(b))return b
        } else if (a.length >= 2)return{x:a[0], y:a[1]}
    } else if (this._isObject(a))return a;
    return{x:0, y:0}
}, _getSize:function (a) {
    if (this._isNumber(a))return{width:a, height:a};
    if (this._isArray(a))if (a.length === 1) {
        var b = a[0];
        if (this._isNumber(b))return{width:b, height:b};
        if (this._isArray(b)) {
            if (b.length >= 4)return{width:b[2], height:b[3]};
            if (b.length >= 2)return{width:b[0], height:b[1]}
        } else if (this._isObject(b))return b
    } else {
        if (a.length >= 4)return{width:a[2], height:a[3]};
        if (a.length >= 2)return{width:a[0], height:a[1]}
    } else if (this._isObject(a))return a;
    return{width:0, height:0}
}, _getPoints:function (a) {
    if (a === undefined)return[];
    if (this._isObject(a[0]))return a;
    var b = [];
    for (var c = 0; c < a.length; c += 2)b.push({x:a[c], y:a[c + 1]});
    return b
}, _getImage:function (a, b) {
    if (!a)b(null); else if (this._isElement(a))b(a); else if (this._isString(a)) {
        var c = new Image;
        c.onload = function () {
            b(c)
        }, c.src = a
    } else if (a.data) {
        var d = document.createElement("canvas");
        d.width = a.width, d.height = a.height;
        var e = d.getContext("2d");
        e.putImageData(a, 0, 0);
        var f = d.toDataURL(), c = new Image;
        c.onload = function () {
            b(c)
        }, c.src = f
    } else b(null)
}}, Kinetic.Canvas = function (a, b) {
    this.element = document.createElement("canvas"), this.context = this.element.getContext("2d"), this.element.width = a, this.element.height = b
}, Kinetic.Canvas.prototype = {clear:function () {
    var a = this.getContext(), b = this.getElement();
    a.clearRect(0, 0, b.width, b.height)
}, getElement:function () {
    return this.element
}, getContext:function () {
    return this.context
}, setWidth:function (a) {
    this.element.width = a
}, setHeight:function (a) {
    this.element.height = a
}, getWidth:function () {
    return this.element.width
}, getHeight:function () {
    return this.element.height
}, setSize:function (a, b) {
    this.setWidth(a), this.setHeight(b)
}, strip:function () {
    var a = this.context;
    a.stroke = function () {
    }, a.fill = function () {
    }, a.fillRect = function (b, c, d, e) {
        a.rect(b, c, d, e)
    }, a.strokeRect = function (b, c, d, e) {
        a.rect(b, c, d, e)
    }, a.drawImage = function () {
    }, a.fillText = function () {
    }, a.strokeText = function () {
    }
}, toDataURL:function (a, b) {
    try {
        return this.element.toDataURL(a, b)
    } catch (c) {
        return this.element.toDataURL()
    }
}}, function () {
    var a = !1;
    Kinetic.Class = function () {
    }, Kinetic.Class.extend = function (b) {
        function f() {
            !a && this.init && this.init.apply(this, arguments)
        }

        var c = this.prototype;
        a = !0;
        var d = new this;
        a = !1;
        for (var e in b)d[e] = typeof b[e] == "function" && typeof c[e] == "function" ? function (a, b) {
            return function () {
                var d = this._super;
                this._super = c[a];
                var e = b.apply(this, arguments);
                return this._super = d, e
            }
        }(e, b[e]) : b[e];
        return f.prototype = d, f.prototype.constructor = f, f.extend = arguments.callee, f
    }
}(), Kinetic.Tween = function (a, b, c, d, e, f) {
    this._listeners = [], this.addListener(this), this.obj = a, this.propFunc = b, this.begin = d, this._pos = d, this.setDuration(f), this.isPlaying = !1, this._change = 0, this.prevTime = 0, this.prevPos = 0, this.looping = !1, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.name = "", this.func = c, this.setFinish(e)
}, Kinetic.Tween.prototype = {setTime:function (a) {
    this.prevTime = this._time, a > this.getDuration() ? this.looping ? (this.rewind(a - this._duration), this.update(), this.broadcastMessage("onLooped", {target:this, type:"onLooped"})) : (this._time = this._duration, this.update(), this.stop(), this.broadcastMessage("onFinished", {target:this, type:"onFinished"})) : a < 0 ? (this.rewind(), this.update()) : (this._time = a, this.update())
}, getTime:function () {
    return this._time
}, setDuration:function (a) {
    this._duration = a === null || a <= 0 ? 1e5 : a
}, getDuration:function () {
    return this._duration
}, setPosition:function (a) {
    this.prevPos = this._pos, this.propFunc(a), this._pos = a, this.broadcastMessage("onChanged", {target:this, type:"onChanged"})
}, getPosition:function (a) {
    return a === undefined && (a = this._time), this.func(a, this.begin, this._change, this._duration)
}, setFinish:function (a) {
    this._change = a - this.begin
}, getFinish:function () {
    return this.begin + this._change
}, start:function () {
    this.rewind(), this.startEnterFrame(), this.broadcastMessage("onStarted", {target:this, type:"onStarted"})
}, rewind:function (a) {
    this.stop(), this._time = a === undefined ? 0 : a, this.fixTime(), this.update()
}, fforward:function () {
    this._time = this._duration, this.fixTime(), this.update()
}, update:function () {
    this.setPosition(this.getPosition(this._time))
}, startEnterFrame:function () {
    this.stopEnterFrame(), this.isPlaying = !0, this.onEnterFrame()
}, onEnterFrame:function () {
    this.isPlaying && this.nextFrame()
}, nextFrame:function () {
    this.setTime((this.getTimer() - this._startTime) / 1e3)
}, stop:function () {
    this.stopEnterFrame(), this.broadcastMessage("onStopped", {target:this, type:"onStopped"})
}, stopEnterFrame:function () {
    this.isPlaying = !1
}, continueTo:function (a, b) {
    this.begin = this._pos, this.setFinish(a), this._duration !== undefined && this.setDuration(b), this.start()
}, resume:function () {
    this.fixTime(), this.startEnterFrame(), this.broadcastMessage("onResumed", {target:this, type:"onResumed"})
}, yoyo:function () {
    this.continueTo(this.begin, this._time)
}, addListener:function (a) {
    return this.removeListener(a), this._listeners.push(a)
}, removeListener:function (a) {
    var b = this._listeners, c = b.length;
    while (c--)if (b[c] == a)return b.splice(c, 1), !0;
    return!1
}, broadcastMessage:function () {
    var a = [];
    for (var b = 0; b < arguments.length; b++)a.push(arguments[b]);
    var c = a.shift(), d = this._listeners, e = d.length;
    for (var b = 0; b < e; b++)d[b][c] && d[b][c].apply(d[b], a)
}, fixTime:function () {
    this._startTime = this.getTimer() - this._time * 1e3
}, getTimer:function () {
    return(new Date).getTime() - this._time
}}, Kinetic.Tweens = {"back-ease-in":function (a, b, c, d, e, f) {
    var g = 1.70158;
    return c * (a /= d) * a * ((g + 1) * a - g) + b
}, "back-ease-out":function (a, b, c, d, e, f) {
    var g = 1.70158;
    return c * ((a = a / d - 1) * a * ((g + 1) * a + g) + 1) + b
}, "back-ease-in-out":function (a, b, c, d, e, f) {
    var g = 1.70158;
    return(a /= d / 2) < 1 ? c / 2 * a * a * (((g *= 1.525) + 1) * a - g) + b : c / 2 * ((a -= 2) * a * (((g *= 1.525) + 1) * a + g) + 2) + b
}, "elastic-ease-in":function (a, b, c, d, e, f) {
    var g = 0;
    return a === 0 ? b : (a /= d) == 1 ? b + c : (f || (f = d * .3), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), -(e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f)) + b)
}, "elastic-ease-out":function (a, b, c, d, e, f) {
    var g = 0;
    return a === 0 ? b : (a /= d) == 1 ? b + c : (f || (f = d * .3), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), e * Math.pow(2, -10 * a) * Math.sin((a * d - g) * 2 * Math.PI / f) + c + b)
}, "elastic-ease-in-out":function (a, b, c, d, e, f) {
    var g = 0;
    return a === 0 ? b : (a /= d / 2) == 2 ? b + c : (f || (f = d * .3 * 1.5), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), a < 1 ? -0.5 * e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f) + b : e * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f) * .5 + c + b)
}, "bounce-ease-out":function (a, b, c, d) {
    return(a /= d) < 1 / 2.75 ? c * 7.5625 * a * a + b : a < 2 / 2.75 ? c * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + b : a < 2.5 / 2.75 ? c * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + b : c * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + b
}, "bounce-ease-in":function (a, b, c, d) {
    return c - Kinetic.Tweens["bounce-ease-out"](d - a, 0, c, d) + b
}, "bounce-ease-in-out":function (a, b, c, d) {
    return a < d / 2 ? Kinetic.Tweens["bounce-ease-in"](a * 2, 0, c, d) * .5 + b : Kinetic.Tweens["bounce-ease-out"](a * 2 - d, 0, c, d) * .5 + c * .5 + b
}, "ease-in":function (a, b, c, d) {
    return c * (a /= d) * a + b
}, "ease-out":function (a, b, c, d) {
    return-c * (a /= d) * (a - 2) + b
}, "ease-in-out":function (a, b, c, d) {
    return(a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b
}, "strong-ease-in":function (a, b, c, d) {
    return c * (a /= d) * a * a * a * a + b
}, "strong-ease-out":function (a, b, c, d) {
    return c * ((a = a / d - 1) * a * a * a * a + 1) + b
}, "strong-ease-in-out":function (a, b, c, d) {
    return(a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b
}, linear:function (a, b, c, d) {
    return c * a / d + b
}}, Kinetic.Transform = function () {
    this.m = [1, 0, 0, 1, 0, 0]
}, Kinetic.Transform.prototype = {translate:function (a, b) {
    this.m[4] += this.m[0] * a + this.m[2] * b, this.m[5] += this.m[1] * a + this.m[3] * b
}, scale:function (a, b) {
    this.m[0] *= a, this.m[1] *= a, this.m[2] *= b, this.m[3] *= b
}, rotate:function (a) {
    var b = Math.cos(a), c = Math.sin(a), d = this.m[0] * b + this.m[2] * c, e = this.m[1] * b + this.m[3] * c, f = this.m[0] * -c + this.m[2] * b, g = this.m[1] * -c + this.m[3] * b;
    this.m[0] = d, this.m[1] = e, this.m[2] = f, this.m[3] = g
}, getTranslation:function () {
    return{x:this.m[4], y:this.m[5]}
}, multiply:function (a) {
    var b = this.m[0] * a.m[0] + this.m[2] * a.m[1], c = this.m[1] * a.m[0] + this.m[3] * a.m[1], d = this.m[0] * a.m[2] + this.m[2] * a.m[3], e = this.m[1] * a.m[2] + this.m[3] * a.m[3], f = this.m[0] * a.m[4] + this.m[2] * a.m[5] + this.m[4], g = this.m[1] * a.m[4] + this.m[3] * a.m[5] + this.m[5];
    this.m[0] = b, this.m[1] = c, this.m[2] = d, this.m[3] = e, this.m[4] = f, this.m[5] = g
}, invert:function () {
    var a = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), b = this.m[3] * a, c = -this.m[1] * a, d = -this.m[2] * a, e = this.m[0] * a, f = a * (this.m[2] * this.m[5] - this.m[3] * this.m[4]), g = a * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = b, this.m[1] = c, this.m[2] = d, this.m[3] = e, this.m[4] = f, this.m[5] = g
}, getMatrix:function () {
    return this.m
}}, Kinetic.Animation = function (a) {
    a || (a = {});
    for (var b in a)this[b] = a[b];
    this.id = Kinetic.Animation.animIdCounter++
}, Kinetic.Animation.animations = [], Kinetic.Animation.animIdCounter = 0, Kinetic.Animation.animRunning = !1, Kinetic.Animation.frame = {time:0, timeDiff:0, lastTime:(new Date).getTime()}, Kinetic.Animation._addAnimation = function (a) {
    this.animations.push(a)
}, Kinetic.Animation._removeAnimation = function (a) {
    var b = a.id, c = this.animations;
    for (var d = 0; d < c.length; d++)if (c[d].id === b)return this.animations.splice(d, 1), !1
}, Kinetic.Animation._runFrames = function () {
    var a = {};
    for (var b = 0; b < this.animations.length; b++) {
        var c = this.animations[b];
        c.node && c.node._id !== undefined && (a[c.node._id] = c.node), c.func && c.func(this.frame)
    }
    for (var d in a)a[d].draw()
}, Kinetic.Animation._updateFrameObject = function () {
    var a = (new Date).getTime();
    this.frame.timeDiff = a - this.frame.lastTime, this.frame.lastTime = a, this.frame.time += this.frame.timeDiff
}, Kinetic.Animation._animationLoop = function () {
    if (this.animations.length > 0) {
        this._updateFrameObject(), this._runFrames();
        var a = this;
        requestAnimFrame(function () {
            a._animationLoop()
        })
    } else this.animRunning = !1, this.frame.lastTime = 0
}, Kinetic.Animation._handleAnimation = function () {
    var a = this;
    this.animRunning ? this.frame.lastTime = 0 : (this.animRunning = !0, a._animationLoop())
}, requestAnimFrame = function (a) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
        window.setTimeout(a, 1e3 / 60)
    }
}(), Kinetic.Node = Kinetic.Class.extend({init:function (a) {
    this.defaultNodeAttrs = {visible:!0, listening:!0, name:undefined, alpha:1, x:0, y:0, scale:{x:1, y:1}, rotation:0, offset:{x:0, y:0}, dragConstraint:"none", dragBounds:{}, draggable:!1, dragThrottle:80}, this.setDefaultAttrs(this.defaultNodeAttrs), this.eventListeners = {}, this.lastDragTime = 0, this.transAnim = new Kinetic.Animation, this.setAttrs(a), this.on("draggableChange.kinetic", function () {
        this._onDraggableChange()
    });
    var b = this;
    this.on("idChange.kinetic", function (a) {
        var c = b.getStage();
        c && (c._removeId(a.oldVal), c._addId(b))
    }), this.on("nameChange.kinetic", function (a) {
        var c = b.getStage();
        c && (c._removeName(a.oldVal, b._id), c._addName(b))
    }), this._onDraggableChange()
}, on:function (a, b) {
    var c = a.split(" ");
    for (var d = 0; d < c.length; d++) {
        var e = c[d], f = e, g = f.split("."), h = g[0], i = g.length > 1 ? g[1] : "";
        this.eventListeners[h] || (this.eventListeners[h] = []), this.eventListeners[h].push({name:i, handler:b})
    }
}, off:function (a) {
    var b = a.split(" ");
    for (var c = 0; c < b.length; c++) {
        var d = b[c], e = d, f = e.split("."), g = f[0];
        if (this.eventListeners[g] && f.length > 1) {
            var h = f[1];
            for (var i = 0; i < this.eventListeners[g].length; i++)if (this.eventListeners[g][i].name === h) {
                this.eventListeners[g].splice(i, 1);
                if (this.eventListeners[g].length === 0) {
                    delete this.eventListeners[g];
                    break
                }
                i--
            }
        } else delete this.eventListeners[g]
    }
}, getAttrs:function () {
    return this.attrs
}, setDefaultAttrs:function (a) {
    this.attrs === undefined && (this.attrs = {});
    if (a)for (var b in a)this.attrs[b] === undefined && (this.attrs[b] = a[b])
}, setAttrs:function (a) {
    var b = Kinetic.Type, c = this;
    if (a !== undefined) {
        function d(a, e, f) {
            for (var g in e) {
                var h = e[g], i = a[g];
                f === 0 && c._fireBeforeChangeEvent(g, i, h), a[g] === undefined && h !== undefined && (a[g] = {});
                if (b._isObject(h) && !b._isArray(h) && !b._isElement(h) && !b._hasMethods(h))Kinetic.Type._isObject(a[g]) || (a[g] = {}), d(a[g], h, f + 1); else switch (g) {
                    case"rotationDeg":
                        c._setAttr(a, "rotation", e[g] * Math.PI / 180), g = "rotation";
                        break;
                    case"offset":
                        var j = b._getXY(h);
                        c._setAttr(a[g], "x", j.x), c._setAttr(a[g], "y", j.y);
                        break;
                    case"scale":
                        var j = b._getXY(h);
                        c._setAttr(a[g], "x", j.x), c._setAttr(a[g], "y", j.y);
                        break;
                    case"points":
                        c._setAttr(a, g, b._getPoints(h));
                        break;
                    case"crop":
                        var j = b._getXY(h), k = b._getSize(h);
                        c._setAttr(a[g], "x", j.x), c._setAttr(a[g], "y", j.y), c._setAttr(a[g], "width", k.width), c._setAttr(a[g], "height", k.height);
                        break;
                    default:
                        c._setAttr(a, g, h)
                }
                f === 0 && c._fireChangeEvent(g, i, h)
            }
        }

        d(this.attrs, a, 0)
    }
}, isVisible:function () {
    return this.attrs.visible && this.getParent() && !this.getParent().isVisible() ? !1 : this.attrs.visible
}, show:function () {
    this.setAttrs({visible:!0})
}, hide:function () {
    this.setAttrs({visible:!1})
}, getZIndex:function () {
    return this.index
}, getAbsoluteZIndex:function () {
    function e(b) {
        var f = [];
        for (var g = 0; g < b.length; g++) {
            var h = b[g];
            d++, h.nodeType !== "Shape" && (f = f.concat(h.getChildren())), h._id === c._id && (g = b.length)
        }
        f.length > 0 && f[0].getLevel() <= a && e(f)
    }

    var a = this.getLevel(), b = this.getStage(), c = this, d = 0;
    return c.nodeType !== "Stage" && e(c.getStage().getChildren()), d
}, getLevel:function () {
    var a = 0, b = this.parent;
    while (b)a++, b = b.parent;
    return a
}, setPosition:function () {
    var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
    this.setAttrs(a)
}, getPosition:function () {
    return{x:this.attrs.x, y:this.attrs.y}
}, getAbsolutePosition:function () {
    var a = this.getAbsoluteTransform(), b = this.getOffset();
    return a.translate(b.x, b.y), a.getTranslation()
}, setAbsolutePosition:function () {
    var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), b = this._clearTransform();
    this.attrs.x = b.x, this.attrs.y = b.y, delete b.x, delete b.y;
    var c = this.getAbsoluteTransform();
    c.invert(), c.translate(a.x, a.y), a = {x:this.attrs.x + c.getTranslation().x, y:this.attrs.y + c.getTranslation().y}, this.setPosition(a.x, a.y), this._setTransform(b)
}, move:function () {
    var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), b = this.getX(), c = this.getY();
    a.x !== undefined && (b += a.x), a.y !== undefined && (c += a.y), this.setAttrs({x:b, y:c})
}, getRotationDeg:function () {
    return this.attrs.rotation * 180 / Math.PI
}, rotate:function (a) {
    this.setAttrs({rotation:this.getRotation() + a})
}, rotateDeg:function (a) {
    this.setAttrs({rotation:this.getRotation() + a * Math.PI / 180})
}, moveToTop:function () {
    var a = this.index;
    this.parent.children.splice(a, 1), this.parent.children.push(this), this.parent._setChildrenIndices()
}, moveUp:function () {
    var a = this.index;
    this.parent.children.splice(a, 1), this.parent.children.splice(a + 1, 0, this), this.parent._setChildrenIndices()
}, moveDown:function () {
    var a = this.index;
    a > 0 && (this.parent.children.splice(a, 1), this.parent.children.splice(a - 1, 0, this), this.parent._setChildrenIndices())
}, moveToBottom:function () {
    var a = this.index;
    this.parent.children.splice(a, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices()
}, setZIndex:function (a) {
    var b = this.index;
    this.parent.children.splice(b, 1), this.parent.children.splice(a, 0, this), this.parent._setChildrenIndices()
}, getAbsoluteAlpha:function () {
    var a = 1, b = this;
    while (b.nodeType !== "Stage")a *= b.attrs.alpha, b = b.parent;
    return a
}, isDragging:function () {
    var a = Kinetic.Global;
    return a.drag.node !== undefined && a.drag.node._id === this._id && a.drag.moving
}, moveTo:function (a) {
    var b = this.parent;
    b.children.splice(this.index, 1), b._setChildrenIndices(), a.children.push(this), this.index = a.children.length - 1, this.parent = a, a._setChildrenIndices()
}, getParent:function () {
    return this.parent
}, getLayer:function () {
    return this.nodeType === "Layer" ? this : this.getParent().getLayer()
}, getStage:function () {
    return this.nodeType !== "Stage" && this.getParent() ? this.getParent().getStage() : this.nodeType === "Stage" ? this : undefined
}, simulate:function (a) {
    this._handleEvent(a, {})
}, transitionTo:function (a) {
    var b = Kinetic.Animation;
    b._removeAnimation(this.transAnim);
    var c = this.nodeType === "Stage" ? this : this.getLayer(), d = this, e = new Kinetic.Transition(this, a);
    return this.transAnim.func = function () {
        e._onEnterFrame()
    }, this.transAnim.node = c, b._addAnimation(this.transAnim), e.onFinished = function () {
        b._removeAnimation(d.transAnim), d.transAnim.node.draw(), a.callback && a.callback()
    }, e.start(), b._handleAnimation(), e
}, getAbsoluteTransform:function () {
    var a = new Kinetic.Transform, b = [], c = this.parent;
    b.unshift(this);
    while (c)b.unshift(c), c = c.parent;
    for (var d = 0; d < b.length; d++) {
        var e = b[d], f = e.getTransform();
        a.multiply(f)
    }
    return a
}, getTransform:function () {
    var a = new Kinetic.Transform;
    return(this.attrs.x !== 0 || this.attrs.y !== 0) && a.translate(this.attrs.x, this.attrs.y), this.attrs.rotation !== 0 && a.rotate(this.attrs.rotation), (this.attrs.scale.x !== 1 || this.attrs.scale.y !== 1) && a.scale(this.attrs.scale.x, this.attrs.scale.y), this.attrs.offset && (this.attrs.offset.x !== 0 || this.attrs.offset.y !== 0) && a.translate(-1 * this.attrs.offset.x, -1 * this.attrs.offset.y), a
}, clone:function (a) {
    var b = this.shapeType || this.nodeType, c = new Kinetic[b](this.attrs);
    for (var d in this.eventListeners) {
        var e = this.eventListeners[d];
        for (var f = 0; f < e.length; f++) {
            var g = e[f];
            g.name.indexOf("kinetic") < 0 && (c.eventListeners[d] || (c.eventListeners[d] = []), c.eventListeners[d].push(g))
        }
    }
    return c.setAttrs(a), c
}, saveImageData:function (a, b) {
    try {
        var c;
        if (a && b)c = new Kinetic.Canvas(a, b); else {
            var d = this.getStage();
            c = d.bufferCanvas
        }
        var e = c.getContext();
        c.clear(), this._draw(c);
        var f = e.getImageData(0, 0, c.getWidth(), c.getHeight());
        this.imageData = f
    } catch (g) {
        Kinetic.Global.warn("Image data could not saved because canvas is dirty.")
    }
}, clearImageData:function () {
    delete this.imageData
}, getImageData:function () {
    return this.imageData
}, toDataURL:function (a) {
    var b = a && a.mimeType ? a.mimeType : null, c = a && a.quality ? a.quality : null, d;
    a && a.width && a.height ? d = new Kinetic.Canvas(a.width, a.height) : d = this.getStage().bufferCanvas;
    var e = d.getContext();
    return d.clear(), this._draw(d), d.toDataURL(b, c)
}, toImage:function (a) {
    Kinetic.Type._getImage(this.toDataURL(a), function (b) {
        a.callback(b)
    })
}, _clearTransform:function () {
    var a = {x:this.attrs.x, y:this.attrs.y, rotation:this.attrs.rotation, scale:{x:this.attrs.scale.x, y:this.attrs.scale.y}, offset:{x:this.attrs.offset.x, y:this.attrs.offset.y}};
    return this.attrs.x = 0, this.attrs.y = 0, this.attrs.rotation = 0, this.attrs.scale = {x:1, y:1}, this.attrs.offset = {x:0, y:0}, a
}, _setTransform:function (a) {
    for (var b in a)this.attrs[b] = a[b]
}, _setImageData:function (a) {
    a && a.data && (this.imageData = a)
}, _fireBeforeChangeEvent:function (a, b, c) {
    this._handleEvent("before" + a.toUpperCase() + "Change", {oldVal:b, newVal:c})
}, _fireChangeEvent:function (a, b, c) {
    this._handleEvent(a + "Change", {oldVal:b, newVal:c})
}, _setAttr:function (a, b, c) {
    c !== undefined && (a === undefined && (a = {}), a[b] = c)
}, _listenDrag:function () {
    this._dragCleanup();
    var a = Kinetic.Global, b = this;
    this.on("mousedown.kinetic touchstart.kinetic", function (a) {
        b._initDrag()
    })
}, _initDrag:function () {
    var a = Kinetic.Global, b = this.getStage(), c = b.getUserPosition();
    if (c) {
        var d = this.getTransform().getTranslation(), e = this.getAbsoluteTransform().getTranslation(), f = this.getAbsolutePosition();
        a.drag.node = this, a.drag.offset.x = c.x - f.x, a.drag.offset.y = c.y - f.y
    }
}, _onDraggableChange:function () {
    if (this.attrs.draggable)this._listenDrag(); else {
        this._dragCleanup();
        var a = this.getStage(), b = Kinetic.Global;
        a && b.drag.node && b.drag.node._id === this._id && a._endDrag()
    }
}, _dragCleanup:function () {
    this.off("mousedown.kinetic"), this.off("touchstart.kinetic")
}, _handleEvent:function (a, b) {
    this.nodeType === "Shape" && (b.shape = this);
    var c = this.getStage(), d = c ? c.mouseoverShape : null, e = c ? c.mouseoutShape : null, f = this.eventListeners, g = !0;
    a === "mouseover" && e && e._id === this._id ? g = !1 : a === "mouseout" && d && d._id === this._id && (g = !1);
    if (g) {
        if (f[a]) {
            var h = f[a];
            for (var i = 0; i < h.length; i++)h[i].handler.apply(this, [b])
        }
        c && d && e && (c.mouseoverShape = d.parent, c.mouseoutShape = e.parent), Kinetic.Global.BUBBLE_WHITELIST.indexOf(a) >= 0 && !b.cancelBubble && this.parent && this._handleEvent.call(this.parent, a, b)
    }
}}), Kinetic.Node.addSetters = function (constructor, a) {
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        this._addSetter(constructor, c)
    }
}, Kinetic.Node.addGetters = function (constructor, a) {
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        this._addGetter(constructor, c)
    }
}, Kinetic.Node.addGettersSetters = function (constructor, a) {
    this.addSetters(constructor, a), this.addGetters(constructor, a)
}, Kinetic.Node._addSetter = function (constructor, a) {
    var b = this, c = "set" + a.charAt(0).toUpperCase() + a.slice(1);
    constructor.prototype[c] = function () {
        arguments.length == 1 ? arg = arguments[0] : arg = Array.prototype.slice.call(arguments);
        var b = {};
        b[a] = arg, this.setAttrs(b)
    }
}, Kinetic.Node._addGetter = function (constructor, a) {
    var b = this, c = "get" + a.charAt(0).toUpperCase() + a.slice(1);
    constructor.prototype[c] = function (b) {
        return this.attrs[a]
    }
}, Kinetic.Node.addGettersSetters(Kinetic.Node, ["x", "y", "scale", "detectionType", "rotation", "alpha", "name", "id", "offset", "draggable", "dragConstraint", "dragBounds", "listening", "dragThrottle"]), Kinetic.Node.addSetters(Kinetic.Node, ["rotationDeg"]), Kinetic.Container = Kinetic.Node.extend({init:function (a) {
    this.children = [], this._super(a)
}, getChildren:function () {
    return this.children
}, removeChildren:function () {
    while (this.children.length > 0)this.remove(this.children[0])
}, add:function (a) {
    a._id = Kinetic.Global.idCounter++, a.index = this.children.length, a.parent = this, this.children.push(a);
    var b = a.getStage();
    if (!b)Kinetic.Global._addTempNode(a); else {
        b._addId(a), b._addName(a);
        var c = Kinetic.Global;
        c._pullNodes(b)
    }
    return this._add !== undefined && this._add(a), this
}, remove:function (a) {
    if (a && a.index !== undefined && this.children[a.index]._id == a._id) {
        var b = this.getStage();
        b && (b._removeId(a.getId()), b._removeName(a.getName(), a._id)), Kinetic.Global._removeTempNode(a), this.children.splice(a.index, 1), this._setChildrenIndices();
        while (a.children && a.children.length > 0)a.remove(a.children[0]);
        this._remove !== undefined && this._remove(a)
    }
    return this
}, get:function (a) {
    var b = this.getStage(), c, d = a.slice(1);
    if (a.charAt(0) === "#")c = b.ids[d] !== undefined ? [b.ids[d]] : []; else {
        if (a.charAt(0) !== ".")return a === "Shape" || a === "Group" || a === "Layer" ? this._getNodes(a) : !1;
        c = b.names[d] !== undefined ? b.names[d] : []
    }
    var e = [];
    for (var f = 0; f < c.length; f++) {
        var g = c[f];
        this.isAncestorOf(g) && e.push(g)
    }
    return e
}, isAncestorOf:function (a) {
    if (this.nodeType === "Stage")return!0;
    var b = a.getParent();
    while (b) {
        if (b._id === this._id)return!0;
        b = b.getParent()
    }
    return!1
}, getIntersections:function () {
    var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), b = [], c = this.get("Shape");
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        e.isVisible() && e.intersects(a) && b.push(e)
    }
    return b
}, _getNodes:function (a) {
    function c(d) {
        var e = d.getChildren();
        for (var f = 0; f < e.length; f++) {
            var g = e[f];
            g.nodeType === a ? b.push(g) : g.nodeType !== "Shape" && c(g)
        }
    }

    var b = [];
    return c(this), b
}, _drawChildren:function (a) {
    var b = this.getStage(), c = this.children;
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        e.nodeType === "Shape" ? e.isVisible() && b.isVisible() && e._draw(a) : e.draw(a)
    }
}, _setChildrenIndices:function () {
    for (var a = 0; a < this.children.length; a++)this.children[a].index = a
}}), Kinetic.Stage = Kinetic.Container.extend({init:function (a) {
    this.setDefaultAttrs({width:400, height:200}), typeof a.container == "string" && (a.container = document.getElementById(a.container)), this._super(a), this._setStageDefaultProperties(), this._id = Kinetic.Global.idCounter++, this._buildDOM(), this._bindContentEvents(), this.on("widthChange.kinetic", function () {
        this._resizeDOM()
    }), this.on("heightChange.kinetic", function () {
        this._resizeDOM()
    });
    var b = Kinetic.Global;
    b.stages.push(this), this._addId(this), this._addName(this)
}, onFrame:function (a) {
    this.anim.func = a
}, start:function () {
    if (!this.animRunning) {
        var a = Kinetic.Animation;
        a._addAnimation(this.anim), a._handleAnimation(), this.animRunning = !0
    }
}, stop:function () {
    Kinetic.Animation._removeAnimation(this.anim), this.animRunning = !1
}, draw:function (a) {
    this._draw(a)
}, setSize:function () {
    var a = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
    this.setAttrs(a)
}, getSize:function () {
    return{width:this.attrs.width, height:this.attrs.height}
}, clear:function () {
    var a = this.children;
    for (var b = 0; b < a.length; b++)a[b].clear()
}, toJSON:function () {
    function b(c) {
        var d = {};
        d.attrs = {};
        for (var e in c.attrs) {
            var f = c.attrs[e];
            !a._isFunction(f) && !a._isElement(f) && !a._hasMethods(f) && (d.attrs[e] = f)
        }
        d.nodeType = c.nodeType, d.shapeType = c.shapeType;
        if (c.nodeType !== "Shape") {
            d.children = [];
            var g = c.getChildren();
            for (var h = 0; h < g.length; h++) {
                var i = g[h];
                d.children.push(b(i))
            }
        }
        return d
    }

    var a = Kinetic.Type;
    return JSON.stringify(b(this))
}, reset:function () {
    this.removeChildren(), this._setStageDefaultProperties(), this.setAttrs(this.defaultNodeAttrs)
}, load:function (a) {
    function b(a, c) {
        var d = c.children;
        if (d !== undefined)for (var e = 0; e < d.length; e++) {
            var f = d[e], g;
            f.nodeType === "Shape" ? f.shapeType === undefined ? g = "Shape" : g = f.shapeType : g = f.nodeType;
            var h = new Kinetic[g](f.attrs);
            a.add(h), b(h, f)
        }
    }

    this.reset();
    var c = JSON.parse(a);
    this.attrs = c.attrs, b(this, c), this.draw()
}, getMousePosition:function (a) {
    return this.mousePos
}, getTouchPosition:function (a) {
    return this.touchPos
}, getUserPosition:function (a) {
    return this.getTouchPosition() || this.getMousePosition()
}, getContainer:function () {
    return this.attrs.container
}, getStage:function () {
    return this
}, getDOM:function () {
    return this.content
}, toDataURL:function (a) {
    function i(d) {
        var e = h[d], j = e.getCanvas().toDataURL(b, c), k = new Image;
        k.onload = function () {
            g.drawImage(k, 0, 0), d < h.length - 1 ? i(d + 1) : a.callback(f.toDataURL(b, c))
        }, k.src = j
    }

    var b = a && a.mimeType ? a.mimeType : null, c = a && a.quality ? a.quality : null, d = a && a.width ? a.width : this.attrs.width, e = a && a.height ? a.height : this.attrs.height, f = new Kinetic.Canvas(d, e), g = f.getContext(), h = this.children;
    i(0)
}, toImage:function (a) {
    this.toDataURL({callback:function (b) {
        Kinetic.Type._getImage(b, function (b) {
            a.callback(b)
        })
    }})
}, _resizeDOM:function () {
    var a = this.attrs.width, b = this.attrs.height;
    this.content.style.width = a + "px", this.content.style.height = b + "px", this.bufferCanvas.setSize(a, b), this.pathCanvas.setSize(a, b);
    var c = this.children;
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        e.getCanvas().setSize(a, b), e.draw()
    }
}, _remove:function (a) {
    try {
        this.content.removeChild(a.canvas.element)
    } catch (b) {
    }
}, _add:function (a) {
    a.canvas.setSize(this.attrs.width, this.attrs.height), a.draw(), this.content.appendChild(a.canvas.element), a.lastDrawTime = 0
}, _detectEvent:function (a, b) {
    var c = Kinetic.Global.drag.moving, d = Kinetic.Global, e = this.getUserPosition(), f = a.eventListeners, g = this;
    this.targetShape && a._id === this.targetShape._id && (this.targetFound = !0);
    if (a.isVisible() && e !== undefined && a.intersects(e)) {
        if (!c && this.mouseDown)return this.mouseDown = !1, this.clickStart = !0, a._handleEvent("mousedown", b), !0;
        if (this.mouseUp)return this.mouseUp = !1, a._handleEvent("mouseup", b), this.clickStart && (!d.drag.moving || !d.drag.node) && (a._handleEvent("click", b), this.inDoubleClickWindow && a._handleEvent("dblclick", b), this.inDoubleClickWindow = !0, setTimeout(function () {
            g.inDoubleClickWindow = !1
        }, this.dblClickWindow)), !0;
        if (!c && this.touchStart && !this.touchMove)return this.touchStart = !1, this.tapStart = !0, a._handleEvent("touchstart", b), !0;
        if (this.touchEnd)return this.touchEnd = !1, a._handleEvent("touchend", b), this.tapStart && (!d.drag.moving || !d.drag.node) && (a._handleEvent("tap", b), this.inDoubleClickWindow && a._handleEvent("dbltap", b), this.inDoubleClickWindow = !0, setTimeout(function () {
            g.inDoubleClickWindow = !1
        }, this.dblClickWindow)), !0;
        if (!c && this.touchMove)return a._handleEvent("touchmove", b), !0;
        if (!c && this._isNewTarget(a, b))return this.mouseoutShape && (this.mouseoverShape = a, this.mouseoutShape._handleEvent("mouseout", b), this.mouseoverShape = undefined), a._handleEvent("mouseover", b), this._setTarget(a), !0;
        if (!c && this.mouseMove)return a._handleEvent("mousemove", b), !0
    } else if (!c && this.targetShape && this.targetShape._id === a._id)return this._setTarget(undefined), this.mouseoutShape = a, !0;
    return!1
}, _setTarget:function (a) {
    this.targetShape = a, this.targetFound = !0
}, _isNewTarget:function (a, b) {
    if (!this.targetShape || !this.targetFound && a._id !== this.targetShape._id) {
        if (this.targetShape) {
            var c = this.targetShape.eventListeners;
            c && (this.mouseoutShape = this.targetShape)
        }
        return!0
    }
    return!1
}, _traverseChildren:function (a, b) {
    var c = a.children;
    for (var d = c.length - 1; d >= 0; d--) {
        var e = c[d];
        if (e.getListening())if (e.nodeType === "Shape") {
            var f = this._detectEvent(e, b);
            if (f)return!0
        } else {
            var f = this._traverseChildren(e, b);
            if (f)return!0
        }
    }
    return!1
}, _handleStageEvent:function (a) {
    var b = Kinetic.Global;
    a || (a = window.event), this._setMousePosition(a), this._setTouchPosition(a), this.pathCanvas.clear(), this.targetFound = !1;
    var c = !1;
    for (var d = this.children.length - 1; d >= 0; d--) {
        var e = this.children[d];
        if (e.isVisible() && d >= 0 && e.getListening() && this._traverseChildren(e, a)) {
            c = !0;
            break
        }
    }
    !c && this.mouseoutShape && (this.mouseoutShape._handleEvent("mouseout", a), this.mouseoutShape = undefined)
}, _bindContentEvents:function () {
    var a = Kinetic.Global, b = this, c = ["mousedown", "mousemove", "mouseup", "mouseover", "mouseout", "touchstart", "touchmove", "touchend"];
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        (function () {
            var a = e;
            b.content.addEventListener(a, function (c) {
                b["_" + a](c)
            }, !1)
        })()
    }
}, _mouseover:function (a) {
    this._handleStageEvent(a)
}, _mouseout:function (a) {
    var b = this.targetShape;
    b && (b._handleEvent
        ("mouseout", a), this.targetShape = undefined), this.mousePos = undefined, this._endDrag(a)
}, _mousemove:function (a) {
    this.mouseDown = !1, this.mouseUp = !1, this.mouseMove = !0, this._handleStageEvent(a), this._startDrag(a)
}, _mousedown:function (a) {
    this.mouseDown = !0, this.mouseUp = !1, this.mouseMove = !1, this._handleStageEvent(a), this.attrs.draggable && this._initDrag()
}, _mouseup:function (a) {
    this.mouseDown = !1, this.mouseUp = !0, this.mouseMove = !1, this._handleStageEvent(a), this.clickStart = !1, this._endDrag(a)
}, _touchstart:function (a) {
    a.preventDefault(), this.touchStart = !0, this.touchEnd = !1, this.touchMove = !1, this._handleStageEvent(a), this.attrs.draggable && this._initDrag()
}, _touchend:function (a) {
    this.touchStart = !1, this.touchEnd = !0, this.touchMove = !1, this._handleStageEvent(a), this.tapStart = !1, this._endDrag(a)
}, _touchmove:function (a) {
    a.preventDefault(), this.touchEnd = !1, this.touchMove = !0, this._handleStageEvent(a), this._startDrag(a)
}, _setMousePosition:function (a) {
    var b = a.offsetX || a.clientX - this._getContentPosition().left + window.pageXOffset, c = a.offsetY || a.clientY - this._getContentPosition().top + window.pageYOffset;
    this.mousePos = {x:b, y:c}
}, _setTouchPosition:function (a) {
    if (a.touches !== undefined && a.touches.length === 1) {
        var b = a.touches[0], c = b.clientX - this._getContentPosition().left + window.pageXOffset, d = b.clientY - this._getContentPosition().top + window.pageYOffset;
        this.touchPos = {x:c, y:d}
    }
}, _getContentPosition:function () {
    var a = this.content.getBoundingClientRect(), b = document.documentElement;
    return{top:a.top + b.scrollTop, left:a.left + b.scrollLeft}
}, _endDrag:function (a) {
    var b = Kinetic.Global;
    b.drag.node && b.drag.moving && (b.drag.moving = !1, b.drag.node._handleEvent("dragend", a)), b.drag.node = undefined
}, _startDrag:function (a) {
    var b = this, c = Kinetic.Global, d = c.drag.node;
    if (d) {
        var e = d.attrs.dragThrottle, f = (new Date).getTime(), g = f - d.lastDragTime, h = 1e3 / e;
        if (g >= h || e > 200) {
            var i = b.getUserPosition(), j = d.attrs.dragConstraint, k = d.attrs.dragBounds, l = {x:d.attrs.x, y:d.attrs.y}, m = {x:i.x - c.drag.offset.x, y:i.y - c.drag.offset.y};
            k.left !== undefined && m.x < k.left && (m.x = k.left), k.right !== undefined && m.x > k.right && (m.x = k.right), k.top !== undefined && m.y < k.top && (m.y = k.top), k.bottom !== undefined && m.y > k.bottom && (m.y = k.bottom), d.setAbsolutePosition(m), j === "horizontal" ? d.attrs.y = l.y : j === "vertical" && (d.attrs.x = l.x), c.drag.node.nodeType === "Stage" ? c.drag.node.draw() : c.drag.node.getLayer().draw(), c.drag.moving || (c.drag.moving = !0, c.drag.node._handleEvent("dragstart", a)), c.drag.node._handleEvent("dragmove", a), d.lastDragTime = (new Date).getTime()
        }
    }
}, _buildDOM:function () {
    this.content = document.createElement("div"), this.content.style.position = "relative", this.content.style.display = "inline-block", this.content.className = "kineticjs-content", this.attrs.container.appendChild(this.content), this.bufferCanvas = new Kinetic.Canvas({width:this.attrs.width, height:this.attrs.height}), this.pathCanvas = new Kinetic.Canvas({width:this.attrs.width, height:this.attrs.height}), this.pathCanvas.strip(), this._resizeDOM()
}, _addId:function (a) {
    a.attrs.id !== undefined && (this.ids[a.attrs.id] = a)
}, _removeId:function (a) {
    a !== undefined && delete this.ids[a]
}, _addName:function (a) {
    var b = a.attrs.name;
    b !== undefined && (this.names[b] === undefined && (this.names[b] = []), this.names[b].push(a))
}, _removeName:function (a, b) {
    if (a !== undefined) {
        var c = this.names[a];
        if (c !== undefined) {
            for (var d = 0; d < c.length; d++) {
                var e = c[d];
                e._id === b && c.splice(d, 1)
            }
            c.length === 0 && delete this.names[a]
        }
    }
}, _onContent:function (a, b) {
    var c = a.split(" ");
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        this.content.addEventListener(e, b, !1)
    }
}, _setStageDefaultProperties:function () {
    this.nodeType = "Stage", this.dblClickWindow = 400, this.targetShape = undefined, this.targetFound = !1, this.mouseoverShape = undefined, this.mouseoutShape = undefined, this.mousePos = undefined, this.mouseDown = !1, this.mouseUp = !1, this.mouseMove = !1, this.clickStart = !1, this.touchPos = undefined, this.touchStart = !1, this.touchEnd = !1, this.touchMove = !1, this.tapStart = !1, this.ids = {}, this.names = {}, this.anim = new Kinetic.Animation, this.animRunning = !1
}, _draw:function (a) {
    this._drawChildren(a)
}}), Kinetic.Node.addGettersSetters(Kinetic.Stage, ["width", "height"]), Kinetic.Layer = Kinetic.Container.extend({init:function (a) {
    this.setDefaultAttrs({clearBeforeDraw:!0}), this.nodeType = "Layer", this.lastDrawTime = 0, this.beforeDrawFunc = undefined, this.afterDrawFunc = undefined, this.canvas = new Kinetic.Canvas, this.canvas.getElement().style.position = "absolute", this._super(a)
}, draw:function (a) {
    this._draw(a)
}, beforeDraw:function (a) {
    this.beforeDrawFunc = a
}, afterDraw:function (a) {
    this.afterDrawFunc = a
}, getCanvas:function () {
    return this.canvas
}, getContext:function () {
    return this.canvas.context
}, clear:function () {
    this.getCanvas().clear()
}, toDataURL:function (a) {
    var b, c = a && a.mimeType ? a.mimeType : null, d = a && a.quality ? a.quality : null;
    return a && a.width && a.height ? b = new Kinetic.Canvas(a.width, a.height) : b = this.getCanvas(), b.toDataURL(c, d)
}, _draw:function (a) {
    a || (a = this.getCanvas());
    var b = (new Date).getTime();
    this.lastDrawTime = b, this.beforeDrawFunc !== undefined && this.beforeDrawFunc.call(this), this.attrs.clearBeforeDraw && a.clear(), this.isVisible() && (this.attrs.drawFunc !== undefined && this.attrs.drawFunc.call(this), this._drawChildren(a)), this.afterDrawFunc !== undefined && this.afterDrawFunc.call(this)
}}), Kinetic.Node.addGettersSetters(Kinetic.Layer, ["clearBeforeDraw"]), Kinetic.Group = Kinetic.Container.extend({init:function (a) {
    this.nodeType = "Group", this._super(a)
}, draw:function (a) {
    this._draw(a)
}, _draw:function (a) {
    this.attrs.visible && this._drawChildren(a)
}}), Kinetic.Shape = Kinetic.Node.extend({init:function (a) {
    this.setDefaultAttrs({detectionType:"path"}), this.nodeType = "Shape", this.appliedShadow = !1, this._super(a)
}, getContext:function () {
    return this.getLayer().getContext()
}, getCanvas:function () {
    return this.getLayer().getCanvas()
}, stroke:function (a) {
    var b = this.getStrokeWidth(), c = this.getStroke();
    if (c || b) {
        var d = Kinetic.Global, e = !1;
        a.save(), this.attrs.shadow && !this.appliedShadow && (e = this._applyShadow(a)), a.lineWidth = b || 2, a.strokeStyle = c || "black", a.stroke(a), a.restore(), e && this.stroke(a)
    }
}, fill:function (a) {
    var b = !1, c = this.attrs.fill;
    if (c) {
        a.save(), this.attrs.shadow && !this.appliedShadow && (b = this._applyShadow(a));
        var d = c.start, e = c.end, f = null;
        if (Kinetic.Type._isString(c))a.fillStyle = c, a.fill(a); else if (c.image) {
            var g = c.repeat ? c.repeat : "repeat";
            c.scale && a.scale(c.scale.x, c.scale.y), c.offset && a.translate(c.offset.x, c.offset.y), a.fillStyle = a.createPattern(c.image, g), a.fill(a)
        } else if (!d.radius && !e.radius) {
            var h = a.createLinearGradient(d.x, d.y, e.x, e.y), i = c.colorStops;
            for (var j = 0; j < i.length; j += 2)h.addColorStop(i[j], i[j + 1]);
            a.fillStyle = h, a.fill(a)
        } else if (!d.radius && d.radius !== 0 || !e.radius && e.radius !== 0)a.fillStyle = "black", a.fill(a); else {
            var h = a.createRadialGradient(d.x, d.y, d.radius, e.x, e.y, e.radius), i = c.colorStops;
            for (var j = 0; j < i.length; j += 2)h.addColorStop(i[j], i[j + 1]);
            a.fillStyle = h, a.fill(a)
        }
        a.restore()
    }
    b && this.fill(a)
}, fillText:function (a, b) {
    var c = !1;
    this.attrs.textFill && (a.save(), this.attrs.shadow && !this.appliedShadow && (c = this._applyShadow(a)), a.fillStyle = this.attrs.textFill, a.fillText(b, 0, 0), a.restore()), c && this.fillText(a, b, 0, 0)
}, strokeText:function (a, b) {
    var c = !1;
    if (this.attrs.textStroke || this.attrs.textStrokeWidth) {
        a.save(), this.attrs.shadow && !this.appliedShadow && (c = this._applyShadow(a));
        var d = this.attrs.textStroke ? this.attrs.textStroke : "black", e = this.attrs.textStrokeWidth ? this.attrs.textStrokeWidth : 2;
        a.lineWidth = e, a.strokeStyle = d, a.strokeText(b, 0, 0), a.restore()
    }
    c && this.strokeText(a, b, 0, 0)
}, drawImage:function () {
    var a = !1, b = arguments[0];
    b.save();
    var c = Array.prototype.slice.call(arguments);
    if (c.length === 6 || c.length === 10)this.attrs.shadow && !this.appliedShadow && (a = this._applyShadow(b)), c.length === 6 ? b.drawImage(c[1], c[2], c[3], c[4], c[5]) : b.drawImage(c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9]);
    b.restore(), a && this.drawImage.apply(this, c)
}, applyLineJoin:function (a) {
    this.attrs.lineJoin && (a.lineJoin = this.attrs.lineJoin)
}, _applyShadow:function (a) {
    var b = this.attrs.shadow;
    if (b) {
        var c = this.getAbsoluteAlpha(), d = b.color ? b.color : "black", e = b.blur ? b.blur : 5, f = b.offset ? b.offset : {x:0, y:0};
        return b.alpha && (a.globalAlpha = b.alpha * c), a.shadowColor = d, a.shadowBlur = e, a.shadowOffsetX = f.x, a.shadowOffsetY = f.y, this.appliedShadow = !0, !0
    }
    return!1
}, intersects:function () {
    var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), b = this.getStage();
    if (this.attrs.detectionType === "path") {
        var c = b.pathCanvas, d = c.getContext();
        return this._draw(c), d.isPointInPath(a.x, a.y)
    }
    if (this.imageData) {
        var e = b.attrs.width, f = this.imageData.data[(e * a.y + a.x) * 4 + 3];
        return f
    }
    return!1
}, _draw:function (a) {
    if (this.attrs.drawFunc) {
        var b = this.getStage(), c = a.getContext(), d = [], e = this.parent;
        d.unshift(this);
        while (e)d.unshift(e), e = e.parent;
        c.save();
        for (var f = 0; f < d.length; f++) {
            var g = d[f], h = g.getTransform(), i = h.getMatrix();
            c.transform(i[0], i[1], i[2], i[3], i[4], i[5])
        }
        var j = this.getAbsoluteAlpha();
        j !== 1 && (c.globalAlpha = j), this.applyLineJoin(c), this.appliedShadow = !1, this.attrs.drawFunc.call(this, a.getContext()), c.restore()
    }
}}), Kinetic.Node.addGettersSetters(Kinetic.Shape, ["fill", "stroke", "lineJoin", "strokeWidth", "shadow", "drawFunc", "filter"]), Kinetic.Rect = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({width:0, height:0, cornerRadius:0}), this.shapeType = "Rect", a.drawFunc = this.drawFunc, this._super(a)
}, drawFunc:function (a) {
    a.beginPath(), this.attrs.cornerRadius === 0 ? a.rect(0, 0, this.attrs.width, this.attrs.height) : (a.moveTo(this.attrs.cornerRadius, 0), a.lineTo(this.attrs.width - this.attrs.cornerRadius, 0), a.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, !1), a.lineTo(this.attrs.width, this.attrs.height - this.attrs.cornerRadius), a.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, !1), a.lineTo(this.attrs.cornerRadius, this.attrs.height), a.arc(this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, !1), a.lineTo(0, this.attrs.cornerRadius), a.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, !1)), a.closePath(), this.fill(a), this.stroke(a)
}, setSize:function () {
    var a = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
    this.setAttrs(a)
}, getSize:function () {
    return{width:this.attrs.width, height:this.attrs.height}
}}), Kinetic.Node.addGettersSetters(Kinetic.Rect, ["width", "height", "cornerRadius"]), Kinetic.Ellipse = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({radius:{x:0, y:0}}), this.shapeType = "Ellipse", a.drawFunc = this.drawFunc, this._super(a), this._convertRadius();
    var b = this;
    this.on("radiusChange.kinetic", function () {
        b._convertRadius()
    })
}, drawFunc:function (a) {
    var b = this.getRadius();
    a.beginPath(), a.save(), b.x !== b.y && a.scale(1, b.y / b.x), a.arc(0, 0, b.x, 0, Math.PI * 2, !0), a.restore(), a.closePath(), this.fill(a), this.stroke(a)
}, _convertRadius:function () {
    var a = Kinetic.Type, b = this.getRadius();
    if (a._isObject(b))return!1;
    this.attrs.radius = a._getXY(b)
}}), Kinetic.Circle = Kinetic.Ellipse, Kinetic.Node.addGettersSetters(Kinetic.Ellipse, ["radius"]), Kinetic.Image = Kinetic.Shape.extend({init:function (a) {
    this.shapeType = "Image", a.drawFunc = this.drawFunc, this._super(a)
}, drawFunc:function (a) {
    if (this.attrs.image) {
        var b = this.getWidth(), c = this.getHeight();
        a.beginPath(), a.rect(0, 0, b, c), a.closePath(), this.fill(a), this.stroke(a);
        if (this.attrs.crop && this.attrs.crop.width && this.attrs.crop.height) {
            var d = this.attrs.crop.x ? this.attrs.crop.x : 0, e = this.attrs.crop.y ? this.attrs.crop.y : 0, f = this.attrs.crop.width, g = this.attrs.crop.height;
            this.drawImage(a, this.attrs.image, d, e, f, g, 0, 0, b, c)
        } else this.drawImage(a, this.attrs.image, 0, 0, b, c)
    }
}, setSize:function () {
    var a = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
    this.setAttrs(a)
}, getSize:function () {
    return{width:this.attrs.width, height:this.attrs.height}
}, getWidth:function () {
    return this.attrs.width ? this.attrs.width : this.attrs.image ? this.attrs.image.width : 0
}, getHeight:function () {
    return this.attrs.height ? this.attrs.height : this.attrs.image ? this.attrs.image.height : 0
}, applyFilter:function (a) {
    try {
        var b = this._clearTransform();
        this.saveImageData(this.getWidth(), this.getHeight()), this._setTransform(b), a.filter.call(this, a);
        var c = this;
        Kinetic.Type._getImage(this.getImageData(), function (b) {
            c.setImage(b), a.callback && a.callback()
        })
    } catch (d) {
        Kinetic.Global.warn("Unable to apply filter.")
    }
}}), Kinetic.Node.addGettersSetters(Kinetic.Image, ["image", "crop", "filter"]), Kinetic.Node.addSetters(Kinetic.Image, ["width", "height"]), Kinetic.Polygon = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({points:[]}), this.shapeType = "Polygon", a.drawFunc = this.drawFunc, this._super(a)
}, drawFunc:function (a) {
    a.beginPath(), a.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);
    for (var b = 1; b < this.attrs.points.length; b++)a.lineTo(this.attrs.points[b].x, this.attrs.points[b].y);
    a.closePath(), this.fill(a), this.stroke(a)
}}), Kinetic.Node.addGettersSetters(Kinetic.Polygon, ["points"]), Kinetic.Text = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({fontFamily:"Calibri", text:"", fontSize:12, align:"left", verticalAlign:"top", fontStyle:"normal", padding:0, width:"auto", height:"auto", detectionType:"path", cornerRadius:0, lineHeight:1.2}), this.dummyCanvas = document.createElement("canvas"), this.shapeType = "Text", a.drawFunc = this.drawFunc, this._super(a);
    var b = ["fontFamily", "fontSize", "fontStyle", "padding", "align", "lineHeight", "text", "width", "height"], c = this;
    for (var d = 0; d < b.length; d++) {
        var e = b[d];
        this.on(e + "Change.kinetic", c._setTextData)
    }
    c._setTextData()
}, drawFunc:function (a) {
    a.beginPath();
    var b = this.getBoxWidth(), c = this.getBoxHeight();
    this.attrs.cornerRadius === 0 ? a.rect(0, 0, b, c) : (a.moveTo(this.attrs.cornerRadius, 0), a.lineTo(b - this.attrs.cornerRadius, 0), a.arc(b - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, !1), a.lineTo(b, c - this.attrs.cornerRadius), a.arc(b - this.attrs.cornerRadius, c - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, !1), a.lineTo(this.attrs.cornerRadius, c), a.arc(this.attrs.cornerRadius, c - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, !1), a.lineTo(0, this.attrs.cornerRadius), a.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, !1)), a.closePath(), this.fill(a), this.stroke(a);
    var d = this.attrs.padding, e = this.attrs.lineHeight * this.getTextHeight(), f = this.textArr;
    a.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily, a.textBaseline = "middle", a.textAlign = "left", a.save(), a.translate(d, 0), a.translate(0, d + this.getTextHeight() / 2);
    for (var g = 0; g < f.length; g++) {
        var h = f[g];
        a.save(), this.attrs.align === "right" ? a.translate(this.getBoxWidth() - this._getTextSize(h).width - d * 2, 0) : this.attrs.align === "center" && a.translate((this.getBoxWidth() - this._getTextSize(h).width - d * 2) / 2, 0), this.fillText(a, h), this.strokeText(a, h), a.restore(), a.translate(0, e)
    }
    a.restore()
}, getBoxWidth:function () {
    return this.attrs.width === "auto" ? this.getTextWidth() + this.attrs.padding * 2 : this.attrs.width
}, getBoxHeight:function () {
    return this.attrs.height === "auto" ? this.getTextHeight() * this.textArr.length * this.attrs.lineHeight + this.attrs.padding * 2 : this.attrs.height
}, getTextWidth:function () {
    return this.textWidth
}, getTextHeight:function () {
    return this.textHeight
}, _getTextSize:function (a) {
    var b = this.dummyCanvas, c = b.getContext("2d");
    c.save(), c.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily;
    var d = c.measureText(a);
    return c.restore(), {width:d.width, height:parseInt(this.attrs.fontSize, 10)}
}, _setTextData:function () {
    var a = this.attrs.text.split(""), b = [], c = 0, d = !0;
    this.textWidth = 0, this.textHeight = this._getTextSize(this.attrs.text).height;
    var e = this.attrs.lineHeight * this.textHeight;
    while (a.length > 0 && d && (this.attrs.height === "auto" || e * (c + 1) < this.attrs.height - this.attrs.padding * 2)) {
        var f = 0, g = undefined;
        d = !1;
        while (f < a.length) {
            if (a.indexOf("\n") === f) {
                a.splice(f, 1), g = a.splice(0, f).join("");
                break
            }
            var h = a.slice(0, f);
            if (this.attrs.width !== "auto" && this._getTextSize(h.join("")).width > this.attrs.width - this.attrs.padding * 2) {
                if (f == 0)break;
                var i = h.lastIndexOf(" "), j = h.lastIndexOf("-"), k = Math.max(i, j);
                if (k >= 0) {
                    g = a.splice(0, 1 + k).join("");
                    break
                }
                g = a.splice(0, f).join("");
                break
            }
            f++, f === a.length && (g = a.splice(0, f).join(""))
        }
        this.textWidth = Math.max(this.textWidth, this._getTextSize(g).width), g !== undefined && (b.push(g), d = !0), c++
    }
    this.textArr = b
}}), Kinetic.Node.addGettersSetters(Kinetic.Text, ["fontFamily", "fontSize", "fontStyle", "textFill", "textStroke", "textStrokeWidth", "padding", "align", "lineHeight", "text", "width", "height", "cornerRadius", "fill", "stroke", "strokeWidth", "shadow"]), Kinetic.Line = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({points:[], lineCap:"butt", dashArray:[], detectionType:"pixel"}), this.shapeType = "Line", a.drawFunc = this.drawFunc, this._super(a)
}, drawFunc:function (a) {
    var b = {};
    a.beginPath(), a.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);
    for (var c = 1; c < this.attrs.points.length; c++) {
        var d = this.attrs.points[c].x, e = this.attrs.points[c].y;
        if (this.attrs.dashArray.length > 0) {
            var f = this.attrs.points[c - 1].x, g = this.attrs.points[c - 1].y;
            this._dashedLine(a, f, g, d, e, this.attrs.dashArray)
        } else a.lineTo(d, e)
    }
    !this.attrs.lineCap || (a.lineCap = this.attrs.lineCap), this.stroke(a)
}, _dashedLine:function (a, b, c, d, e, f) {
    var g = f.length, h = d - b, i = e - c, j = h > i, k = j ? i / h : h / i;
    k > 9999 ? k = 9999 : k < -9999 && (k = -9999);
    var l = Math.sqrt(h * h + i * i), m = 0, n = !0;
    while (l >= .1 && m < 1e4) {
        var o = f[m++ % g];
        o === 0 && (o = .001), o > l && (o = l);
        var p = Math.sqrt(o * o / (1 + k * k));
        j ? (b += h < 0 && i < 0 ? p * -1 : p, c += h < 0 && i < 0 ? k * p * -1 : k * p) : (b += h < 0 && i < 0 ? k * p * -1 : k * p, c += h < 0 && i < 0 ? p * -1 : p), a[n ? "lineTo" : "moveTo"](b, c), l -= o, n = !n
    }
    a.moveTo(d, e)
}}), Kinetic.Node.addGettersSetters(Kinetic.Line, ["dashArray", "lineCap", "points"]), Kinetic.Sprite = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({index:0, frameRate:17}), a.drawFunc = this.drawFunc, this._super(a), this.anim = new Kinetic.Animation;
    var b = this;
    this.on("animationChange.kinetic", function () {
        b.setIndex(0)
    })
}, drawFunc:function (a) {
    if (this.attrs.image) {
        var b = this.attrs.animation, c = this.attrs.index, d = this.attrs.animations[b][c];
        a.beginPath(), a.rect(0, 0, d.width, d.height), a.closePath(), this.drawImage(a, this.attrs.image, d.x, d.y, d.width, d.height, 0, 0, d.width, d.height)
    }
}, start:function () {
    var a = this, b = this.getLayer(), c = Kinetic.Animation;
    c._removeAnimation(this.anim), this.anim.node = b, c._addAnimation(this.anim), this.interval = setInterval(function () {
        var b = a.attrs.index;
        a._updateIndex(), a.afterFrameFunc && b === a.afterFrameIndex && a.afterFrameFunc()
    }, 1e3 / this.attrs.frameRate), c._handleAnimation()
}, stop:function () {
    Kinetic.Animation._removeAnimation(this.anim), clearInterval(this.interval)
}, afterFrame:function (a, b) {
    this.afterFrameIndex = a, this.afterFrameFunc = b
}, _updateIndex:function () {
    var a = this.attrs.index, b = this.attrs.animation;
    a < this.attrs.animations[b].length - 1 ? this.attrs.index++ : this.attrs.index = 0
}}), Kinetic.Node.addGettersSetters(Kinetic.Sprite, ["animation", "animations", "index"]), Kinetic.Star = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({numPoints:0, innerRadius:0, outerRadius:0}), this.shapeType = "Star", a.drawFunc = this.drawFunc, this._super(a)
}, drawFunc:function (a) {
    a.beginPath(), a.moveTo(0, 0 - this.attrs.outerRadius);
    for (var b = 1; b < this.attrs.numPoints * 2; b++) {
        var c = b % 2 === 0 ? this.attrs.outerRadius : this.attrs.innerRadius, d = c * Math.sin(b * Math.PI / this.attrs.numPoints), e = -1 * c * Math.cos(b * Math.PI / this.attrs.numPoints);
        a.lineTo(d, e)
    }
    a.closePath(), this.fill(a), this.stroke(a)
}}), Kinetic.Node.addGettersSetters(Kinetic.Star, ["numPoints", "innerRadius", "outerRadius"]), Kinetic.RegularPolygon = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({radius:0, sides:0}), this.shapeType = "RegularPolygon", a.drawFunc = this.drawFunc, this._super(a)
}, drawFunc:function (a) {
    a.beginPath(), a.moveTo(0, 0 - this.attrs.radius);
    for (var b = 1; b < this.attrs.sides; b++) {
        var c = this.attrs.radius * Math.sin(b * 2 * Math.PI / this.attrs.sides), d = -1 * this.attrs.radius * Math.cos(b * 2 * Math.PI / this.attrs.sides);
        a.lineTo(c, d)
    }
    a.closePath(), this.fill(a), this.stroke(a)
}}), Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon, ["radius", "sides"]), Kinetic.Path = Kinetic.Shape.extend({init:function (a) {
    this.shapeType = "Path", this.dataArray = [];
    var b = this;
    a.drawFunc = this.drawFunc, this._super(a), this.dataArray = Kinetic.Path.parsePathData(this.attrs.data), this.on("dataChange", function () {
        b.dataArray = Kinetic.Path.parsePathData(b.attrs.data)
    })
}, drawFunc:function (a) {
    var b = this.dataArray;
    a.beginPath();
    for (var c = 0; c < b.length; c++) {
        var d = b[c].command, e = b[c].points;
        switch (d) {
            case"L":
                a.lineTo(e[0], e[1]);
                break;
            case"M":
                a.moveTo(e[0], e[1]);
                break;
            case"C":
                a.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5]);
                break;
            case"Q":
                a.quadraticCurveTo(e[0], e[1], e[2], e[3]);
                break;
            case"A":
                var f = e[0], g = e[1], h = e[2], i = e[3], j = e[4], k = e[5], l = e[6], m = e[7], n = h > i ? h : i, o = h > i ? 1 : h / i, p = h > i ? i / h : 1;
                a.translate(f, g), a.rotate(l), a.scale(o, p), a.arc(0, 0, n, j, j + k, 1 - m), a.scale(1 / o, 1 / p), a.rotate(-l), a.translate(-f, -g);
                break;
            case"z":
                a.closePath()
        }
    }
    this.fill(a), this.stroke(a)
}}), Kinetic.Path.getLineLength = function (a, b, c, d) {
    return Math.sqrt((c - a) * (c - a) + (d - b) * (d - b))
}, Kinetic.Path.getPointOnLine = function (a, b, c, d, e, f, g) {
    f === undefined && (f = b), g === undefined && (g = c);
    var h = (e - c) / (d - b + 1e-8), i = Math.sqrt(a * a / (1 + h * h)), j = h * i, k;
    if ((g - c) / (f - b + 1e-8) === h)k = {x:f + i, y:g + j}; else {
        var l, m, n = this.getLineLength(b, c, d, e);
        if (n < 1e-8)return undefined;
        var o = (f - b) * (d - b) + (g - c) * (e - c);
        o /= n * n, l = b + o * (d - b), m = c + o * (e - c);
        var p = this.getLineLength(f, g, l, m), q = Math.sqrt(a * a - p * p);
        i = Math.sqrt(q * q / (1 + h * h)), j = h * i, k = {x:l + i, y:m + j}
    }
    return k
}, Kinetic.Path.getPointOnCubicBezier = function (a, b, c, d, e, f, g, h, i) {
    function j(a) {
        return a * a * a
    }

    function k(a) {
        return 3 * a * a * (1 - a)
    }

    function l(a) {
        return 3 * a * (1 - a) * (1 - a)
    }

    function m(a) {
        return(1 - a) * (1 - a) * (1 - a)
    }

    var n = h * j(a) + f * k(a) + d * l(a) + b * m(a), o = i * j(a) + g * k(a) + e * l(a) + c * m(a);
    return{x:n, y:o}
}, Kinetic.Path.getPointOnQuadraticBezier = function (a, b, c, d, e, f, g) {
    function h(a) {
        return a * a
    }

    function i(a) {
        return 2 * a * (1 - a)
    }

    function j(a) {
        return(1 - a) * (1 - a)
    }

    var k = f * h(a) + d * i(a) + b * j(a), l = g * h(a) + e * i(a) + c * j(a);
    return{x:k, y:l}
}, Kinetic.Path.getPointOnEllipticalArc = function (a, b, c, d, e, f) {
    var g = Math.cos(f), h = Math.sin(f), i = {x:c * Math.cos(e), y:d * Math.sin(e)};
    return{x:a + (i.x * g - i.y * h), y:b + (i.x * h + i.y * g)}
}, Kinetic.Path.parsePathData = function (a) {
    if (!a)return[];
    var b = a, c = ["m", "M", "l", "L", "v", "V", "h", "H", "z", "Z", "c", "C", "q", "Q", "t", "T", "s", "S", "a", "A"];
    b = b.replace(new RegExp(" ", "g"), ",");
    for (var d = 0; d < c.length; d++)b = b.replace(new RegExp(c[d], "g"), "|" + c[d]);
    var e = b.split("|"), f = [], g = 0, h = 0;
    for (var d = 1; d < e.length; d++) {
        var i = e[d], j = i.charAt(0);
        i = i.slice(1), i = i.replace(new RegExp(",-", "g"), "-"), i = i.replace(new RegExp("-", "g"), ",-"), i = i.replace(new RegExp("e,-", "g"), "e-");
        var k = i.split(",");
        k.length > 0 && k[0] === "" && k.shift();
        for (var l = 0; l < k.length; l++)k[l] = parseFloat(k[l]);
        while (k.length > 0) {
            if (isNaN(k[0]))break;
            var m = null, n = [], o = g, p = h;
            switch (j) {
                case"l":
                    g += k.shift(), h += k.shift(), m = "L", n.push(g, h);
                    break;
                case"L":
                    g = k.shift(), h = k.shift(), n.push(g, h);
                    break;
                case"m":
                    g += k.shift(), h += k.shift(), m = "M", n.push(g, h), j = "l";
                    break;
                case"M":
                    g = k.shift(), h = k.shift(), m = "M", n.push(g, h), j = "L";
                    break;
                case"h":
                    g += k.shift(), m = "L", n.push(g, h);
                    break;
                case"H":
                    g = k.shift(), m = "L", n.push(g, h);
                    break;
                case"v":
                    h += k.shift(), m = "L", n.push(g, h);
                    break;
                case"V":
                    h = k.shift(), m = "L", n.push(g, h);
                    break;
                case"C":
                    n.push(k.shift(), k.shift(), k.shift(), k.shift()), g = k.shift(), h = k.shift(), n.push(g, h);
                    break;
                case"c":
                    n.push(g + k.shift(), h + k.shift(), g + k.shift(), h + k.shift()), g += k.shift(), h += k.shift(), m = "C", n.push(g, h);
                    break;
                case"S":
                    var q = g, r = h, s = f[f.length - 1];
                    s.command === "C" && (q = g + (g - s.points[2]), r = h + (h - s.points[3])), n.push(q, r, k.shift(), k.shift()), g = k.shift(), h = k.shift(), m = "C", n.push(g, h);
                    break;
                case"s":
                    var q = g, r = h, s = f[f.length - 1];
                    s.command === "C" && (q = g + (g - s.points[2]), r = h + (h - s.points[3])), n.push(q, r, g + k.shift(), h + k.shift()), g += k.shift(), h += k.shift(), m = "C", n.push(g, h);
                    break;
                case"Q":
                    n.push(k.shift(), k.shift()), g = k.shift(), h = k.shift(), n.push(g, h);
                    break;
                case"q":
                    n.push(g + k.shift(), h + k.shift()), g += k.shift(), h += k.shift(), m = "Q", n.push(g, h);
                    break;
                case"T":
                    var q = g, r = h, s = f[f.length - 1];
                    s.command === "Q" && (q = g + (g - s.points[0]), r = h + (h - s.points[1])), g = k.shift(), h = k.shift(), m = "Q", n.push(q, r, g, h);
                    break;
                case"t":
                    var q = g, r = h, s = f[f.length - 1];
                    s.command === "Q" && (q = g + (g - s.points[0]), r = h + (h - s.points[1])), g += k.shift(), h += k.shift(), m = "Q", n.push(q, r, g, h);
                    break;
                case"A":
                    var t = k.shift(), u = k.shift(), v = k.shift(), w = k.shift(), x = k.shift(), y = g, z = h;
                    g = k.shift(), h = k.shift(), m = "A", n = this.convertEndpointToCenterParameterization(y, z, g, h, w, x, t, u, v);
                    break;
                case"a":
                    var t = k.shift(), u = k.shift(), v = k.shift(), w = k.shift(), x = k.shift(), y = g, z = h;
                    g += k.shift(), h += k.shift(), m = "A", n = this.convertEndpointToCenterParameterization(y, z, g, h, w, x, t, u, v)
            }
            f.push({command:m || j, points:n, start:{x:o, y:p}, pathLength:this.calcLength(o, p, m || j, n)})
        }
        (j === "z" || j === "Z") && f.push({command:"z", points:[], start:undefined, pathLength:0})
    }
    return f
}, Kinetic.Path.calcLength = function (a, b, c, d) {
    var e, f, g, h = Kinetic.Path;
    switch (c) {
        case"L":
            return h.getLineLength(a, b, d[0], d[1]);
        case"C":
            e = 0, f = h.getPointOnCubicBezier(0, a, b, d[0], d[1], d[2], d[3], d[4], d[5]);
            for (t = .01; t <= 1; t += .01)g = h.getPointOnCubicBezier(t, a, b, d[0], d[1], d[2], d[3], d[4], d[5]), e += h.getLineLength(f.x, f.y, g.x, g.y), f = g;
            return e;
        case"Q":
            e = 0, f = h.getPointOnQuadraticBezier(0, a, b, d[0], d[1], d[2], d[3]);
            for (t = .01; t <= 1; t += .01)g = h.getPointOnQuadraticBezier(t, a, b, d[0], d[1], d[2], d[3]), e += h.getLineLength(f.x, f.y, g.x, g.y), f = g;
            return e;
        case"A":
            e = 0;
            var i = d[4], j = d[5], k = d[4] + j, l = Math.PI / 180;
            Math.abs(i - k) < l && (l = Math.abs(i - k)), f = h.getPointOnEllipticalArc(d[0], d[1], d[2], d[3], i, 0);
            if (j < 0)for (t = i - l; t > k; t -= l)g = h.getPointOnEllipticalArc(d[0], d[1], d[2], d[3], t, 0), e += h.getLineLength(f.x, f.y, g.x, g.y), f = g; else for (t = i + l; t < k; t += l)g = h.getPointOnEllipticalArc(d[0], d[1], d[2], d[3], t, 0), e += h.getLineLength(f.x, f.y, g.x, g.y), f = g;
            return g = h.getPointOnEllipticalArc(d[0], d[1], d[2], d[3], k, 0), e += h.getLineLength(f.x, f.y, g.x, g.y), e
    }
    return 0
}, Kinetic.Path.convertEndpointToCenterParameterization = function (a, b, c, d, e, f, g, h, i) {
    var j = i * (Math.PI / 180), k = Math.cos(j) * (a - c) / 2 + Math.sin(j) * (b - d) / 2, l = -1 * Math.sin(j) * (a - c) / 2 + Math.cos(j) * (b - d) / 2, m = k * k / (g * g) + l * l / (h * h);
    m > 1 && (g *= Math.sqrt(m), h *= Math.sqrt(m));
    var n = Math.sqrt((g * g * h * h - g * g * l * l - h * h * k * k) / (g * g * l * l + h * h * k * k));
    e == f && (n *= -1), isNaN(n) && (n = 0);
    var o = n * g * l / h, p = n * -h * k / g, q = (a + c) / 2 + Math.cos(j) * o - Math.sin(j) * p, r = (b + d) / 2 + Math.sin(j) * o + Math.cos(j) * p, s = function (a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1])
    }, t = function (a, b) {
        return(a[0] * b[0] + a[1] * b[1]) / (s(a) * s(b))
    }, u = function (a, b) {
        return(a[0] * b[1] < a[1] * b[0] ? -1 : 1) * Math.acos(t(a, b))
    }, v = u([1, 0], [(k - o) / g, (l - p) / h]), w = [(k - o) / g, (l - p) / h], x = [(-1 * k - o) / g, (-1 * l - p) / h], y = u(w, x);
    return t(w, x) <= -1 && (y = Math.PI), t(w, x) >= 1 && (y = 0), f === 0 && y > 0 && (y -= 2 * Math.PI), f == 1 && y < 0 && (y += 2 * Math.PI), [q, r, g, h, v, y, j, f]
}, Kinetic.Node.addGettersSetters(Kinetic.Path, ["data"]), Kinetic.TextPath = Kinetic.Shape.extend({init:function (a) {
    this.setDefaultAttrs({fontFamily:"Calibri", fontSize:12, fontStyle:"normal", detectionType:"path", text:""}), this.dummyCanvas = document.createElement("canvas"), this.shapeType = "TextPath", this.dataArray = [];
    var b = this;
    a.drawFunc = this.drawFunc, this._super(a), this.dataArray = Kinetic.Path.parsePathData(this.attrs.data), this.on("dataChange", function () {
        b.dataArray = Kinetic.Path.parsePathData(this.attrs.data)
    });
    var c = ["text", "textStroke", "textStrokeWidth"];
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        this.on(e + "Change", b._setTextData)
    }
    b._setTextData()
}, drawFunc:function (a) {
    var b = this.charArr;
    a.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily, a.textBaseline = "middle", a.textAlign = "left", a.save();
    var c = this.glyphInfo;
    for (var d = 0; d < c.length; d++) {
        a.save();
        var e = c[d].p0, f = c[d].p1, g = parseFloat(this.attrs.fontSize);
        a.translate(e.x, e.y), a.rotate(c[d].rotation), this.fillText(a, c[d].text), this.strokeText(a, c[d].text), a.restore()
    }
    a.restore()
}, getTextWidth:function () {
    return this.textWidth
}, getTextHeight:function () {
    return this.textHeight
}, _getTextSize:function (a) {
    var b = this.dummyCanvas, c = b.getContext("2d");
    c.save(), c.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily;
    var d = c.measureText(a);
    return c.restore(), {width:d.width, height:parseInt(this.attrs.fontSize, 10)}
}, _setTextData:function () {
    var a = this, b = this._getTextSize(this.attrs.text);
    this.textWidth = b.width, this.textHeight = b.height, this.glyphInfo = [];
    var c = this.attrs.text.split(""), d, e, f, g = -1, h = 0, i = function () {
        h = 0;
        var b = a.dataArray;
        for (var c = g + 1; c < b.length; c++) {
            if (b[c].pathLength > 0)return g = c, b[c];
            b[c].command == "M" && (d = {x:b[c].points[0], y:b[c].points[1]})
        }
        return{}
    }, j = function (b, c) {
        var g = a._getTextSize(b).width, j = 0, k = 0, l = !1;
        e = undefined;
        while (Math.abs(g - j) / g > .01 && k < 25) {
            k++;
            var m = j;
            while (f === undefined)f = i(), f && m + f.pathLength < g && (m += f.pathLength, f = undefined);
            if (f === {} || d === undefined)return undefined;
            var n = !1;
            switch (f.command) {
                case"L":
                    Kinetic.Path.getLineLength(d.x, d.y, f.points[0], f.points[1]) > g ? e = Kinetic.Path.getPointOnLine(g, d.x, d.y, f.points[0], f.points[1], d.x, d.y) : f = undefined;
                    break;
                case"A":
                    var o = f.points[4], p = f.points[5], q = f.points[4] + p;
                    h === 0 ? h = o + 1e-8 : g > j ? h += Math.PI / 180 * p / Math.abs(p) : h -= Math.PI / 360 * p / Math.abs(p), Math.abs(h) > Math.abs(q) && (h = q, n = !0), e = Kinetic.Path.getPointOnEllipticalArc(f.points[0], f.points[1], f.points[2], f.points[3], h, f.points[6]);
                    break;
                case"C":
                    h === 0 ? g > f.pathLength ? h = 1e-8 : h = g / f.pathLength : g > j ? h += (g - j) / f.pathLength : h -= (j - g) / f.pathLength, h > 1 && (h = 1, n = !0), e = Kinetic.Path.getPointOnCubicBezier(h, f.start.x, f.start.y, f.points[0], f.points[1], f.points[2], f.points[3], f.points[4], f.points[5]);
                    break;
                case"Q":
                    h === 0 ? h = g / f.pathLength : g > j ? h += (g - j) / f.pathLength : h -= (j - g) / f.pathLength, h > 1 && (h = 1, n = !0), e = Kinetic.Path.getPointOnQuadraticBezier(h, f.start.x, f.start.y, f.points[0], f.points[1], f.points[2], f.points[3])
            }
            e !== undefined && (j = Kinetic.Path.getLineLength(d.x, d.y, e.x, e.y)), n && (n = !1, f = undefined)
        }
    };
    for (var k = 0; k < c.length; k++) {
        j(c[k]);
        if (d === undefined || e === undefined)break;
        var l = Kinetic.Path.getLineLength(d.x, d.y, e.x, e.y), m = 0, n = Kinetic.Path.getPointOnLine(m + l / 2, d.x, d.y, e.x, e.y), o = Math.atan2(e.y - d.y, e.x - d.x);
        this.glyphInfo.push({transposeX:n.x, transposeY:n.y, text:c[k], rotation:o, p0:d, p1:e}), d = e
    }
}}), Kinetic.Node.addGettersSetters(Kinetic.TextPath, ["fontFamily", "fontSize", "fontStyle", "textFill", "textStroke", "textStrokeWidth", "text"]);