$(function () {

    window.SpriteLibrary = window.SpriteLibrary || {};

    var ctx = { };
    var fairyData = { };

    SpriteLibrary.fairy = function (specifications) {
        ctx = specifications.context;
    
        fairyData = specifications.fairyData;

        // var fairyData = {
        //     center: {x: 400, y: 300},
        //     innerRadius: 10,
        //     outerRadius: 50,
        //     color: "white"
        // };

        var fairyWings = {
            startPoint: { x: 0, y: 0 },
            controlPoint1: { x: fairyData.outerRadius, 
                y: -fairyData.outerRadius - 40 },
            controlPoint2: { x: fairyData.outerRadius + 30, 
                y: -fairyData.outerRadius},
            endPoint: { x: fairyData.outerRadius, 
                y: 0 },
            color: "rgba(200, 200, 200, 0.5)"
        };

        var drawWing = function (wing) {
            ctx.strokeStyle = wing.color;
            ctx.beginPath();
            ctx.moveTo(wing.startPoint.x, wing.startPoint.y);
            ctx.lineTo(wing.controlPoint1.x, wing.controlPoint1.y);
            ctx.lineTo(wing.controlPoint2.x, wing.controlPoint2.y);
            ctx.lineTo(wing.endPoint.x, wing.endPoint.y);
            ctx.stroke();

            ctx.fillStyle = wing.color;
            ctx.beginPath();
            ctx.moveTo(wing.startPoint.x, wing.startPoint.y);
            ctx.bezierCurveTo(
                wing.controlPoint1.x, wing.controlPoint1.y, 
                wing.controlPoint2.x, wing.controlPoint2.y,
                wing.endPoint.x, wing.endPoint.y);
            ctx.fill();
        };

        var wings = function (wing) {
            drawWing(wing);
            ctx.save();
            ctx.scale(-1, 1);
            drawWing(wing);
            ctx.restore();
            ctx.save();
            ctx.scale(1, -1);
            drawWing(wing);
            ctx.restore();
            ctx.save();
            ctx.scale(-1, -1);
            drawWing(wing);
            ctx.restore();
        }

        var bodyAt = function (fairyData, fairyWings, glowIncrement) {
            ctx.save();
            ctx.translate(fairyData.center.x, fairyData.center.y);

            var innerRadius = fairyData.innerRadius;
            var outerRadius = fairyData.outerRadius;
            var color1 = fairyData.color1;
            var color2 = fairyData.color2;

            // have fairyWings object get outerRadius data that is not hard coded
            // to be able to add increments for the animation
            wings(fairyWings);

            var radialGradient = ctx.createRadialGradient(
                0, 0, innerRadius, 0, 0, outerRadius - glowIncrement);

            radialGradient.addColorStop(0, color1);
            radialGradient.addColorStop(1, color2);
            // radialGradient.addColorStop(1, backgroundColor);

            ctx.fillStyle = radialGradient;
            ctx.beginPath();
            ctx.arc(0, 0, outerRadius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };

        // var randomColor = function () {
        //     return "rgb(" + Math.round(Math.random() * 256).toString() 
        //             + "," + Math.round(Math.random() * 256).toString()
        //             + "," + Math.round(Math.random() * 256).toString() + ")";
        // }

        bodyAt(fairyData, fairyWings, 1);
        // var index = 1;
        // var increasing = true;
        // function glow () {
        //     if (index < 1 || ((fairyData.outerRadius - index) - 20 <= fairyData.innerRadius)) {
        //         increasing = !increasing;
        //     }
        //     if (increasing) {
        //         index += 3;
        //     } else {
        //         index -= 3;
        //     }
        //     bodyAt(fairyData, fairyWings, index);
        //     setTimeout(glow, 100);
        // }
        // glow();
    }
});