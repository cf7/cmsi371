$(function () {

    /**
    * Tree data from the html file should be passed in
    * as an object with the following attributes . . . 
    *   {   context: ctx,
            setting: backGround,
            treeData: {
                trunk: {
                    position: { x: 700, y: 400},
                    dimensions: { width: 50, height: 300}
                },
                branches: {
                    dimensions: { width: 50, height: 75 },
                    nextThickness: 0.5,
                    angles: (Math.PI/9),
                    layers: 7,
                    leaves: {
                        position: { x: 500, y: 250 },
                        radius: 20,
                        startAngle: 0,
                        endAngle: 4 * Math.PI/3,
                        counterClockwise: true,
                        leafColor: "green",
                        hasLeaves: false,
                        count: 2
                    },
                },
                barkColor: "rgb(90, 55, 45)"
            }
        }
    */

    window.SpriteLibrary = window.SpriteLibrary || {};

    var ctx = { };
    var backGround = { };
    var treeData = { };

    SpriteLibrary.tree = function (specifications) {
        ctx = specifications.context;
        backGround = specifications.setting;
        treeData = specifications.treeData;

        var clear = function () {
            backGround();
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
            if (leaves.count > 1) {
                leaves.count = 1;
                ctx.save();
                ctx.scale(-1, 1);
                leaves.position.y = leaves.position.y + 7;
                leaf(leaves);
                ctx.restore();
            } else if (leaves.count == 1) {
                leaves.count = 2;
                return;
            }
        }

        var rightBranch = function (x, y, width, height, nextThickness, angle, layers, leaves) {
            ctx.save();
            if (leaves.hasLeaves) {
                if (layers < 3) {
                    leaves.position.x = x;
                    leaves.position.y = y;
                    leaf(leaves);
                }
            }
            ctx.restore();
            if (layers > 0) {
                var newX = 0;
                var newY = -height + 10;
                var newWidth = width * nextThickness;
                var newHeight = height;
                ctx.save();
                ctx.translate(x, y); 
                ctx.rotate(-angle);
                layers--;
                leftBranch(newX, newY, newWidth, newHeight, nextThickness, angle, layers, leaves);
                rightBranch(newX, newY, newWidth, newHeight, nextThickness, angle, layers, leaves);
                ctx.fillRect(newX, newY, newWidth, newHeight);
                ctx.restore();
            } else {
                return;
            }
        }

        var leftBranch = function (x, y, width, height, nextThickness, angle, layers, leaves) {
            ctx.save();
            if (leaves.hasLeaves) {
                if (layers < 4) {
                    leaves.position.x = x;
                    leaves.position.y = y;
                    leaf(leaves);
                }
            }
            ctx.restore();
            if (layers > 0) {
                var newX = width * nextThickness;
                var newY = -height;
                var newWidth = width * nextThickness;
                var newHeight = height;
                ctx.save();
                ctx.translate(x, y); 
                ctx.rotate(angle);
                layers--;
                leftBranch(newX, newY, newWidth, newHeight, nextThickness, angle, layers, leaves);
                rightBranch(newX, newY, newWidth, newHeight, nextThickness, angle, layers, leaves);
                ctx.fillRect(newX, newY, newWidth, newHeight);
                ctx.restore();
            } else {
                return;
            }
        }

        var branches = function (branches) {
            ctx.save();
            if (branches.layers > 3) {
                branches.leaves.hasLeaves = true;
            }
            rightBranch(0, 10, branches.dimensions.width, branches.dimensions.height, 
                branches.nextThickness, branches.angles, branches.layers, branches.leaves);
            leftBranch(0, 0, branches.dimensions.width, branches.dimensions.height, 
                branches.nextThickness, branches.angles, branches.layers, branches.leaves);
            ctx.restore();
        }

        var trunk = function (trunk) {
            ctx.save();
            ctx.fillRect(0, 0, trunk.dimensions.width, trunk.dimensions.height);
            ctx.restore();
        }

        var growTree = function (tree) {
            clear();
            ctx.save();
            ctx.translate(tree.trunk.position.x, tree.trunk.position.y);
            ctx.fillStyle = tree.barkColor;
            trunk(tree.trunk);
            branches(tree.branches);
            ctx.restore();
        }

        growTree(treeData);
    }
});