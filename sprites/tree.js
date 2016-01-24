$(function () {
    window.SpriteLibrary = window.SpriteLibrary || {};

    SpriteLibrary.tree = function (specifications) {
        ctx = specifications.context;

        var leftBranch = function (x, y, width, height, iterations) {
            if (iterations > 0) {
                var newX = width/2;
                var newY = -height;
                var newWidth = width/2;
                var newHeight = height;
                ctx.save();
                ctx.translate(x, y); 
                ctx.rotate(Math.PI/6);
                iterations--;
                leftBranch(newX, newY, newWidth, newHeight, iterations);
                ctx.fillRect(newX, newY, newWidth, newHeight);
                ctx.restore();
            } else {
                return;
            }

        }

        var startX = 450;
        var startY = 450;
        var startWidth = 50;
        var startHeight = 100;
        var iterations = 3;

        ctx.save();
        ctx.translate(450, 450);

        ctx.fillStyle = "rgb(90, 55, 45)";
        ctx.fillRect(0, 0, startWidth, startHeight);

        leftBranch(0, 0, startWidth, startHeight, iterations);

        ctx.restore();

    }
});