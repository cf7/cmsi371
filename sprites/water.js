$(function () {

    /**
    * Water data from the html file should be passed in
    * as an object with the following attributes . . . 
    *   {   context: ctx,
            setting: backGround,
            water: {
                startPoint: { x: 350, y: 700 },
                radius: 300,
                startAngle: 0,
                endAngle: Math.PI*2,
                counterClockwise: true,
                color: "rgba(0, 130, 255, 0.9)",
                waves: {
                    position: { x: 0, y: 0 },
                    color: "rgb(60, 200, 255)",
                    numberWaves: 30
                }
            }
        }
    */

    window.SpriteLibrary = window.SpriteLibrary || {};

    var ctx = { };
    var water = { };

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