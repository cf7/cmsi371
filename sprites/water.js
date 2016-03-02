$(function () {

    window.SpriteLibrary = window.SpriteLibrary || {};

    var ctx = { };
    var backGround = { };
    var waterData = { };

    SpriteLibrary.water = function (specifications) {
        ctx = specifications.context;
        backGround = specifications.setting;
        waterData = specifications.waterData;
        
        var waves = {
            startPoint: { x: 0, y: 0 },
            controlPoint1: { x: 0, y: 0 },
            controlPoint2: { x: 0, y: 10 },
            endPoint: { x: 15, y: 10 },
            color: "rgb(60, 200, 255)",
            numberWaves: waterData.numberWaves
        }

        var clear = function () {
            backGround();
        }

        var wave = function (waves, scaleX, scaleY) {
            ctx.save();
            ctx.translate(waves.startPoint.x, waves.startPoint.y);
            ctx.scale(scaleX, scaleY);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                waves.controlPoint1.x, waves.controlPoint1.y, 
                waves.controlPoint2.x, waves.controlPoint2.y, 
                waves.endPoint.x, waves.endPoint.y);
            ctx.stroke();
            ctx.restore();
        }

        var drawingSetup = function (water, waves) {
            ctx.save();
            waves.startPoint.x = (Math.random()*(water.radius*0.6)*Math.pow(-1, Math.round(Math.random()*2)));
            waves.startPoint.y = (Math.random()*(water.radius*0.25 + 10)*Math.pow(-1, Math.round(Math.random()*2)));
            ctx.strokeStyle = waves.color;
            wave(waves, 1, 1);
            wave(waves, -1, 1);
            ctx.restore();
        }

        var pour = function (water, waves) {
            // clear();
            ctx.save();
            ctx.fillStyle = water.color;
            ctx.scale(1, 0.5);
            ctx.beginPath();
            ctx.arc(0, 0, water.radius, water.startAngle, water.endAngle, water.counterClockwise);
            ctx.fill();
            ctx.restore();

            ctx.save();
            for (var index = 0; index < waves.numberWaves; index++) {
                drawingSetup(water, waves);
            }
            ctx.restore();
        }

        pour(waterData, waves);
    }
});