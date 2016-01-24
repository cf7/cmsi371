(function () {
    var canvas = $("#canvas").get(0);
    var ctx = canvas.getContext("2d");
    var backgroundColor = "rgb(100, 175, 200)";
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    var fairy1Data = {
        center: {x: 400, y: 300},
        innerRadius: 15,
        outerRadius: 100,
        color: "white"
    };

    // color for wings: "rgba(200, 200, 200, 0.5)";
    var wings = function (x, y) {

    }

    var bodyAt = function (fairyData, glowScale) {
        var centerX = fairyData.center.x;
        var centerY = fairyData.center.y;
        var innerRadius = fairyData.innerRadius;
        var outerRadius = fairyData.outerRadius;
        var color = fairyData.color;

        wings(centerX, centerY);

        var radialGradient = ctx.createRadialGradient(
            centerX, centerY, innerRadius, centerX, centerY, outerRadius - glowScale);

        radialGradient.addColorStop(0, color);
        radialGradient.addColorStop(1, backgroundColor);

        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2, true);
        ctx.fill();
    };

    var randomColor = function () {
        return "rgb(" + Math.round(Math.random() * 256).toString() 
                + "," + Math.round(Math.random() * 256).toString()
                + "," + Math.round(Math.random() * 256).toString() + ")";
    }

    var circleAt = function (x, y) {
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI*2, true);
        ctx.fill();
    }

    var rightTriangleAt = function (x, y) {
        if (canvas.getContext) {
            ctx.fillStyle = randomColor();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 30, y);
            ctx.lineTo(x + 30, y - 30);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    rightTriangleAt(150, 50);
    circleAt(200, 200);
    bodyAt(fairy1Data, 1);
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