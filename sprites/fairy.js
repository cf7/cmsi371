$(function () {
    
    window.SpriteLibrary = window.SpriteLibrary || {};

    var ctx = { };
    var backGround = { };
    var fairyData = { };

    SpriteLibrary.fairy = function (specifications) {
        ctx = specifications.context;
        backGround = specifications.setting;
        fairyData = specifications.fairyData;
        fairyWings = specifications.fairyWings;
        // var fairyWings = {
        //     startPoint: { x: 0, y: 0 },
        //     controlPoint1: { x: fairyData.outerRadius, 
        //         y: -fairyData.outerRadius - 40 },
        //     controlPoint2: { x: fairyData.outerRadius + 30, 
        //         y: -fairyData.outerRadius},
        //     endPoint: { x: fairyData.outerRadius - 10, 
        //         y: 0 },
        //     direction: fairyData.direction,
        //     color: "rgba(200, 200, 200, 0.5)"
        // };

        var clear = function () {
            backGround();
        }

        var wingsInward = function (fairyWings) {
            fairyWings.controlPoint1.x = fairyWings.controlPoint1.x - 2;
            fairyWings.controlPoint2.x = fairyWings.controlPoint2.x - 2;
            fairyWings.endPoint.x = fairyWings.endPoint.x - 2;
        }

        var wingsOutward = function (fairyWings) {
            fairyWings.controlPoint1.x = fairyWings.controlPoint1.x + 2;
            fairyWings.controlPoint2.x = fairyWings.controlPoint2.x + 2;
            fairyWings.endPoint.x = fairyWings.endPoint.x + 2;
        }

        var showControlPoints = function (curve) {
            ctx.save();
            ctx.strokeStyle = curve.color;
            ctx.beginPath();
            ctx.moveTo(curve.startPoint.x, curve.startPoint.y);
            ctx.lineTo(curve.controlPoint1.x, curve.controlPoint1.y);
            ctx.lineTo(curve.controlPoint2.x, curve.controlPoint2.y);
            ctx.lineTo(curve.endPoint.x, curve.endPoint.y);
            ctx.stroke();
            ctx.restore();
        }

        var drawWing = function (wing) {
            // showControlPoints(wing);
            ctx.save();
            ctx.fillStyle = wing.color;
            ctx.beginPath();
            ctx.moveTo(wing.startPoint.x, wing.startPoint.y);
            ctx.bezierCurveTo(
                wing.controlPoint1.x, wing.controlPoint1.y, 
                wing.controlPoint2.x, wing.controlPoint2.y,
                wing.endPoint.x, wing.endPoint.y);
            ctx.fill();
            ctx.restore();
        };

        var drawingSetup = function (wing, scaleX, scaleY, translateX, translateY) {
            ctx.save();
            ctx.translate(translateX, translateY);
            ctx.scale(scaleX, scaleY);
            drawWing(wing);
            ctx.restore();
        }

        var wings = function (wing) {
            if (wing.direction.forward) {
                drawingSetup(wing, 1.5, 1.5, 0, 0);
                drawingSetup(wing, -1.5, 1.5, 0, 0);
                drawingSetup(wing, 1.25, -1.25, 0, 0);
                drawingSetup(wing, -1.25, -1.25, 0, 0);
            }

            if (wing.direction.right) {
                drawingSetup(wing, 1.5, 1.5, 0, 0);
                drawingSetup(wing, 1.25, -1, 0, 0);
                drawingSetup(wing, 1.5, 1.5, -5, 0);
                drawingSetup(wing, 1.25, -1, -5, 5);
            }

            if (wing.direction.left) {
                drawingSetup(wing, -1.5, 1.5, 0, 0);
                drawingSetup(wing, -1.25, -1, 0, 0);
                drawingSetup(wing, -1.5, 1.5, 5, 0);
                drawingSetup(wing, -1.25, -1, 5, 5);
            }
        }

        var bodyAt = function (fairyData, fairyWings) {
            // clear();
            ctx.save();
            ctx.translate(fairyData.center.x, fairyData.center.y);

            var innerRadius = fairyData.innerRadius;
            var outerRadius = fairyData.outerRadius;
            var innerColor = fairyData.innerColor;
            var outerColor = fairyData.outerColor;
            var glowIncrement = fairyData.glowIncrement;
            console.log(fairyWings.wingsInward);
            if (fairyWings.controlPoint1.x < 10) {
                fairyWings.wingsInward = false;
            } else if (fairyWings.controlPoint1.x >= fairyWings.beforeX) {
                fairyWings.wingsInward = true;
            }
            if (fairyWings.wingsInward) {
                wingsInward(fairyWings);
            } else if (!fairyWings.wingsInward) {
                wingsOutward(fairyWings);
            }
            wings(fairyWings);

            var radialGradient = ctx.createRadialGradient(
                0, 0, innerRadius, 0, 0, outerRadius - glowIncrement);

            radialGradient.addColorStop(0, innerColor);
            radialGradient.addColorStop(1, outerColor);

            ctx.fillStyle = radialGradient;
            ctx.beginPath();
            ctx.arc(0, 0, outerRadius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };

        bodyAt(fairyData, fairyWings);
    }
});