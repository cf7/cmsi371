$(function () {
    window.SpriteLibrary = window.SpriteLibrary || {};

    SpriteLibrary.tree = function (specifications) {
        ctx = specifications.context;

        var tree = {
            position: { x: 500, y: 500},
            dimensions: { width: 50, height: 100},
            layers: 5,
            branchThickness: 0.5,
            barkColor: "rgb(90, 55, 45)",
            branchAngles: (Math.PI/6),
            leafColor: "green"
        }

        var rightBranch = function (x, y, width, height, branchThickness, angle, iterations) {
            if (iterations > 0) {
                var newX = 0;
                var newY = -height + 10;
                var newWidth = width * branchThickness;
                var newHeight = height;
                ctx.save();
                ctx.translate(x, y); 
                ctx.rotate(-angle);
                iterations--;
                leftBranch(newX, newY, newWidth, newHeight, branchThickness, angle, iterations);
                rightBranch(newX, newY, newWidth, newHeight, branchThickness, angle, iterations);
                ctx.fillRect(newX, newY, newWidth, newHeight);
                ctx.restore();
            } else {
                return;
            }
        }

        var leftBranch = function (x, y, width, height, branchThickness, angle, iterations) {
            if (iterations > 0) {
                var newX = width * branchThickness;
                var newY = -height;
                var newWidth = width * branchThickness;
                var newHeight = height;
                ctx.save();
                ctx.translate(x, y); 
                ctx.rotate(angle);
                iterations--;
                leftBranch(newX, newY, newWidth, newHeight, branchThickness, angle, iterations);
                rightBranch(newX, newY, newWidth, newHeight, branchThickness, angle, iterations);
                ctx.fillRect(newX, newY, newWidth, newHeight);
                ctx.restore();
            } else {
                return;
            }

        }

        var startX = tree.position.x;
        var startY = tree.position.y;
        var startWidth = tree.dimensions.width;
        var startHeight = tree.dimensions.height;
        var branchThickness = tree.branchThickness;
        var angle = tree.branchAngles;
        var iterations = tree.layers;

        ctx.save();
        ctx.translate(startX, startY);

        ctx.fillStyle = tree.barkColor;
        ctx.fillRect(0, 0, startWidth, startHeight);
        ctx.fillRect(0, startHeight, startWidth, startHeight + 100);
        rightBranch(0, 10, startWidth, startHeight, branchThickness, angle, iterations);
        leftBranch(0, 0, startWidth, startHeight, branchThickness, angle, iterations);

        ctx.restore();
    }
});