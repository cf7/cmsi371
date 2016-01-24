(function () {
    var canvas = $("#canvas").get(0);
    var ctx = canvas.getContext("2d");
    var backgroundColor = "rgb(100, 175, 200)";
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // color for wings: "rgba(200, 200, 200, 0.5)";
    var wings = function (x, y) {

    }

    var bodyAt = function (x, y, glowScale) {
        var centerX = x;
        var centerY = y;
        var outerRadius = 100;
        var innerRadius = 15;

        wings(centerX, centerY);

        var radialGradient = ctx.createRadialGradient(
            centerX, centerY, innerRadius, centerX, centerY, outerRadius - glowScale);
        radialGradient.addColorStop(0, "white");
        radialGradient.addColorStop(1, backgroundColor);
        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, Math.PI * 2, true);
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
    var index = 0;
    var increasing = true;
    function glow () {
        if (index < 0 || index >= 20) {
            increasing = !increasing;
        }
        if (increasing) {
            index += 3;
        } else {
            index -= 3;
        }
        bodyAt(400, 300, index);
        setTimeout(glow, 100);
    }
    glow();
}());