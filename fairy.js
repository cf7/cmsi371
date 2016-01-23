(function () {
    var canvas = $("#canvas").get(0);

    // color for wings: "rgba(200, 200, 200, 0.5)";
    
    var randomColor = function () {
        return "rgb(" + Math.round(Math.random() * 256).toString() 
                + "," + Math.round(Math.random() * 256).toString()
                + "," + Math.round(Math.random() * 256).toString() + ")";
    }

    var draw = function () {
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect (10, 10, 55, 50);

            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect (30, 30, 55, 50);
        }
    }

    var circleAt = function (x, y) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI*2, true);
        ctx.fill();
    }

    var rightTriangleAt = function (x, y) {
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
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

    draw();
    rightTriangleAt(150, 50);
    circleAt(200, 200);
})();