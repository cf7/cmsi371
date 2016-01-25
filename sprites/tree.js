$(function () {
    window.SpriteLibrary = window.SpriteLibrary || {};

    SpriteLibrary.tree = function (specifications) {
        ctx = specifications.context;

        var tree = {
            trunk: {
                position: { x: 500, y: 500},
                dimensions: { width: 50, height: 200}
            },
            branches: {
                dimensions: { width: 50, height: 100 },
                thickness: 0.5,
                angles: (Math.PI/9),
                layers: 10
            },
            barkColor: "rgb(90, 55, 45)",
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

        var branches = function (startWidth, startHeight, thickness, angle, iterations, leafColor) {
            rightBranch(0, 10, startWidth, startHeight, thickness, angle, iterations);
            leftBranch(0, 0, startWidth, startHeight, thickness, angle, iterations);
        }

        var trunk = function (startWidth, startHeight) {
            ctx.fillRect(0, 0, startWidth, startHeight);
        }

        var growTree = function (tree) {
            ctx.save();
            ctx.translate(tree.trunk.position.x, tree.trunk.position.y);
            ctx.fillStyle = tree.barkColor;
            trunk(tree.trunk.dimensions.width, tree.trunk.dimensions.height);
            branches(tree.branches.dimensions.width, tree.branches.dimensions.height, 
                tree.branches.thickness, tree.branches.angles, 
                tree.branches.layers, tree.leafColor);
            ctx.restore();
        }

        growTree(tree);

       
    }
});