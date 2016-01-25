$(function () {
    window.SpriteLibrary = window.SpriteLibrary || {};

    SpriteLibrary.tree = function (specifications) {
        ctx = specifications.context;

        var tree = {
            trunk: {
                position: { x: 500, y: 500},
                dimensions: { width: 50, height: 300}
            },
            branches: {
                dimensions: { width: 50, height: 75 },
                thickness: 0.5,
                angles: (Math.PI/9),
                layers: 7,
                leaves: {
                    position: { x: 500, y: 250 },
                    radius: 20,
                    startAngle: 0,
                    endAngle: 4 * Math.PI/3,
                    counterClockwise: true,
                    leafColor: "green",
                    hasLeaves: false
                },
            },
            barkColor: "rgb(90, 55, 45)",
        }

        var leaf = function (leaves) {
            ctx.save();
            ctx.translate(leaves.position.x, leaves.position.y);
            ctx.rotate(Math.PI/2);
            ctx.fillStyle = leaves.leafColor;
            ctx.beginPath();
            ctx.arc(0, 0, leaves.radius, leaves.startAngle, 
                leaves.endAngle, leaves.counterClockwise);
            ctx.fill();
            ctx.restore();
        }

        var rightBranch = function (x, y, width, height, branchThickness, angle, layers, leaves) {
            if (layers > 0) {
                var newX = 0;
                var newY = -height + 10;
                var newWidth = width * branchThickness;
                var newHeight = height;
                ctx.save();
                ctx.translate(x, y); 
                ctx.rotate(-angle);
                layers--;
                leftBranch(newX, newY, newWidth, newHeight, branchThickness, angle, layers, leaves);
                rightBranch(newX, newY, newWidth, newHeight, branchThickness, angle, layers, leaves);
                ctx.fillRect(newX, newY, newWidth, newHeight);
                ctx.restore();
            } else {
                return;
            }
        }

        var leftBranch = function (x, y, width, height, branchThickness, angle, layers, leaves) {
            if (leaves.hasLeaves) {
                if (layers < 3) {
                    leaves.position.x = x;
                    leaves.position.y = y;
                    leaf(leaves);
                }
            }
            if (layers > 0) {
                var newX = width * branchThickness;
                var newY = -height;
                var newWidth = width * branchThickness;
                var newHeight = height;
                ctx.save();
                ctx.translate(x, y); 
                ctx.rotate(angle);
                layers--;
                leftBranch(newX, newY, newWidth, newHeight, branchThickness, angle, layers, leaves);
                rightBranch(newX, newY, newWidth, newHeight, branchThickness, angle, layers, leaves);
                ctx.fillRect(newX, newY, newWidth, newHeight);
                ctx.restore();
            } else {
                return;
            }
        }

        var branches = function (branches) {
            if (branches.layers > 3) {
                branches.leaves.hasLeaves = true;
            }
            rightBranch(0, 10, branches.dimensions.width, branches.dimensions.height, 
                branches.thickness, branches.angles, branches.layers, branches.leaves);
            leftBranch(0, 0, branches.dimensions.width, branches.dimensions.height, 
                branches.thickness, branches.angles, branches.layers, branches.leaves);
        }

        var trunk = function (trunk) {
            ctx.fillRect(0, 0, trunk.dimensions.width, trunk.dimensions.height);
        }

        var growTree = function (tree) {
            ctx.save();
            ctx.translate(tree.trunk.position.x, tree.trunk.position.y);
            ctx.fillStyle = tree.barkColor;
            trunk(tree.trunk);
            branches(tree.branches);
            ctx.restore();
        }

        growTree(tree);


        

    }
});