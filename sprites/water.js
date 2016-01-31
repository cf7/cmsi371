$(function () {
    window.SpriteLibrary = window.SpriteLibrary || {};

    SpriteLibrary.water = function (specifications) {
        ctx = specifications.context;
        water = specifications.water;
        

        var wave = function (x, y, scaleX, scaleY) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scaleX, scaleY);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(0, 0, 0, 10, 15, 10);
            ctx.stroke();
            ctx.restore();
        }

        var drawingSetup = function (waves) {
            waves.position.x = (Math.random()*(water.radius*0.6)*Math.pow(-1, Math.round(Math.random()*2)));
            waves.position.y = (Math.random()*(water.radius*0.25 + 10)*Math.pow(-1, Math.round(Math.random()*2)));
            ctx.strokeStyle = waves.color;
            wave(waves.position.x, waves.position.y, 1, 1);
            wave(waves.position.x, waves.position.y, -1, 1);
        }

        var pour = function (water) {
            ctx.save();
            ctx.fillStyle = water.color;
            ctx.translate(water.startPoint.x, water.startPoint.y);
            ctx.scale(1, 0.5);
            ctx.beginPath();
            ctx.arc(0, 0, water.radius, water.startAngle, water.endAngle, water.counterClockwise);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.translate(water.startPoint.x, water.startPoint.y);
            for (var index = 0; index < water.waves.numberWaves; index++) {
                drawingSetup(water.waves);
            }
            ctx.restore();
        }

        pour(water);

    }
});