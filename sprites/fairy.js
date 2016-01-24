(function () {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var backgroundColor = "rgb(100, 175, 200)";
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    var fairy1Data = {
        center: {x: 400, y: 300},
        innerRadius: 10,
        outerRadius: 50,
        color: "white"
    };

    var fairy1Wings = {
        leftWing: {
            top: {
                startPoint: { x: fairy1Data.center.x, y: fairy1Data.center.y },
                controlPoint1: { x: fairy1Data.center.x + fairy1Data.outerRadius, 
                    y: fairy1Data.center.y - fairy1Data.outerRadius - 40 },
                controlPoint2: { x: fairy1Data.center.x + fairy1Data.outerRadius + 30, 
                    y: fairy1Data.center.y - fairy1Data.outerRadius},
                endPoint: { x: fairy1Data.center.x + fairy1Data.outerRadius, 
                    y: fairy1Data.center.y}
            },
            bottom: {
                startPoint: { x: fairy1Data.center.x, y: fairy1Data.center.y },
                controlPoint1: { x: fairy1Data.center.x + fairy1Data.outerRadius, 
                    y: fairy1Data.center.y + fairy1Data.outerRadius + 40 },
                controlPoint2: { x: fairy1Data.center.x + fairy1Data.outerRadius + 30, 
                    y: fairy1Data.center.y + fairy1Data.outerRadius},
                endPoint: { x: fairy1Data.center.x + fairy1Data.outerRadius, 
                    y: fairy1Data.center.y}
            }
        },
        rightWing: {

        }
    };

    var drawWing = function (wing) {
        ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
        ctx.beginPath();
        ctx.moveTo(wing.startPoint.x, wing.startPoint.y);
        ctx.lineTo(wing.controlPoint1.x, wing.controlPoint1.y);
        ctx.lineTo(wing.controlPoint2.x, wing.controlPoint2.y);
        ctx.lineTo(wing.endPoint.x, wing.endPoint.y);
        ctx.stroke();

        ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(wing.startPoint.x, wing.startPoint.y);
        ctx.bezierCurveTo(
            wing.controlPoint1.x, wing.controlPoint1.y, 
            wing.controlPoint2.x, wing.controlPoint2.y,
            wing.endPoint.x, wing.endPoint.y);
        ctx.fill();
    };

    var wings = function (leftWing, rightWing) {
        drawWing(leftWing.top);
        drawWing(leftWing.bottom);
    }

    var bodyAt = function (fairyData, fairyWings, glowIncrement) {
        var centerX = fairyData.center.x;
        var centerY = fairyData.center.y;
        var innerRadius = fairyData.innerRadius;
        var outerRadius = fairyData.outerRadius;
        var color = fairyData.color;

        wings(fairyWings.leftWing, fairyWings.rightWing);

        var radialGradient = ctx.createRadialGradient(
            centerX, centerY, innerRadius, centerX, centerY, outerRadius - glowIncrement);

        radialGradient.addColorStop(0, color);
        radialGradient.addColorStop(0.8, "rgb(137, 255, 249)");
        radialGradient.addColorStop(1, backgroundColor);

        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2, true);
        ctx.fill();
    };

    // var randomColor = function () {
    //     return "rgb(" + Math.round(Math.random() * 256).toString() 
    //             + "," + Math.round(Math.random() * 256).toString()
    //             + "," + Math.round(Math.random() * 256).toString() + ")";
    // }

    // var circleAt = function (x, y) {
    //     ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
    //     ctx.beginPath();
    //     ctx.arc(x, y, 30, 0, Math.PI*2, true);
    //     ctx.fill();
    // }

    // var rightTriangleAt = function (x, y) {
    //     if (canvas.getContext) {
    //         ctx.fillStyle = randomColor();
    //         ctx.beginPath();
    //         ctx.moveTo(x, y);
    //         ctx.lineTo(x + 30, y);
    //         ctx.lineTo(x + 30, y - 30);
    //         ctx.closePath();
    //         ctx.fill();
    //         ctx.stroke();
    //     }
    // }

    // rightTriangleAt(150, 50);
    // circleAt(200, 200);
    bodyAt(fairy1Data, fairy1Wings, 1);
    // var index = 1;
    // var increasing = true;
    // function glow () {
    //     if (index < 1 || ((fairy1Data.outerRadius - index) - 20 <= fairy1Data.innerRadius)) {
    //         increasing = !increasing;
    //     }
    //     if (increasing) {
    //         index += 3;
    //     } else {
    //         index -= 3;
    //     }
    //     bodyAt(fairy1Data, fairy1Wings, index);
    //     setTimeout(glow, 100);
    // }
    // glow();
}());