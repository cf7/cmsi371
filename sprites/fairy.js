(function () {
    var canvas = $("#canvas").get(0);
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
        startPoint: { x: fairy1Data.center.x, y: fairy1Data.center.y },
        controlPoint1: { x: fairy1Data.center.x + fairy1Data.outerRadius - 20, 
            y: fairy1Data.center.y - fairy1Data.outerRadius - 30 },
        controlPoint2: { x: fairy1Data.center.x + fairy1Data.outerRadius + 30, 
            y: fairy1Data.center.y - fairy1Data.outerRadius},
        endPoint: { x: fairy1Data.center.x + fairy1Data.outerRadius, 
            y: fairy1Data.center.y }
    };

    var wings = function (fairyWings) {
        ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
        ctx.beginPath();
        ctx.moveTo(fairyWings.startPoint.x, fairyWings.startPoint.y);
        ctx.lineTo(fairyWings.controlPoint1.x, fairyWings.controlPoint1.y);
        ctx.lineTo(fairyWings.controlPoint2.x, fairyWings.controlPoint2.y);
        ctx.lineTo(fairyWings.endPoint.x, fairyWings.endPoint.y);
        ctx.stroke();

        ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fairyWings.startPoint.x, fairyWings.startPoint.y);
        ctx.bezierCurveTo(
            fairyWings.controlPoint1.x, fairyWings.controlPoint1.y, 
            fairyWings.controlPoint2.x, fairyWings.controlPoint2.y,
            fairyWings.endPoint.x, fairyWings.endPoint.y);
        ctx.stroke();
    }

    var bodyAt = function (fairyData, fairyWings, glowScale) {
        var centerX = fairyData.center.x;
        var centerY = fairyData.center.y;
        var innerRadius = fairyData.innerRadius;
        var outerRadius = fairyData.outerRadius;
        var color = fairyData.color;

        wings(fairy1Wings);

        var radialGradient = ctx.createRadialGradient(
            centerX, centerY, innerRadius, centerX, centerY, outerRadius - glowScale);

        radialGradient.addColorStop(0, color);
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
    //     if (index < 1 || index >= 20) {
    //         increasing = !increasing;
    //     }
    //     if (increasing) {
    //         index += 3;
    //     } else {
    //         index -= 3;
    //     }
    //     bodyAt(fairy1Data, index);
    //     setTimeout(glow, 100);
    // }
    // glow();
}());