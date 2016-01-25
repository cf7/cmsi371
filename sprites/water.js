$(function () {
    window.SpriteLibrary = window.SpriteLibrary || {};

    SpriteLibrary.water = function (specifications) {
        ctx = specifications.context;

        var water = {
            startPoint: { x: 350, y: 350 },
            radius: 300,
            startAngle: 0,
            endAngle: Math.PI*2,
            counterClockwise: true,
            color: "rgba(0, 130, 255, 0.7)",
            waves: {
                position: { x: 0, y: 0 },
                color: "rgb(60, 200, 255)",
                numberWaves: 20
            },
        };

        var wave = function (waves) {
            waves.position.x = (Math.random()*(water.radius*0.6)*Math.pow(-1, Math.round(Math.random()*2)));
            waves.position.y = (Math.random()*(water.radius*0.25)*Math.pow(-1, Math.round(Math.random()*2)));
            ctx.strokeStyle = waves.color;
            ctx.beginPath();
            ctx.moveTo(waves.position.x, waves.position.y);
            ctx.bezierCurveTo(waves.position.x + 10, waves.position.y + 10,
                waves.position.x + 40, waves.position.y - 30,
                waves.position.x + 60, waves.position.y);
            ctx.stroke();
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
                wave(water.waves);
            }
            ctx.restore();
        }

        pour(water);

    }
});