$(function () {
    
    window.SpriteLibrary = window.SpriteLibrary || {};

    var ctx = { };
    var backGround = { };
    var fairyData = { };

    SpriteLibrary.fairy = function (specifications) {
        ctx = specifications.context;
        backGround = specifications.setting;
        fairyData = specifications.fairyData;

        var fairyWings = {
            startPoint: { x: 0, y: 0 },
            controlPoint1: { x: fairyData.outerRadius, 
                y: -fairyData.outerRadius - 40 },
            controlPoint2: { x: fairyData.outerRadius + 30, 
                y: -fairyData.outerRadius},
            endPoint: { x: fairyData.outerRadius - 10, 
                y: 0 },
            direction: fairyData.direction || {forward: true, left: false, right: false },
            color: "rgba(200, 200, 200, 0.5)",
            howOpen: fairyData.howOpen,
            flutterSpeed: fairyData.flutterSpeed,
        };

        var clear = function () {
            backGround();
        }

        var wingsInward = function (fairyWings) {
            var speed = fairyWings.flutterSpeed;
            fairyWings.controlPoint1.x = fairyWings.controlPoint1.x - speed;
            fairyWings.controlPoint2.x = fairyWings.controlPoint2.x - speed;
            fairyWings.endPoint.x = fairyWings.endPoint.x - speed;
        }

        var wingsOutward = function (fairyWings) {
            var speed = fairyWings.flutterSpeed;
            fairyWings.controlPoint1.x = fairyWings.controlPoint1.x + speed;
            fairyWings.controlPoint2.x = fairyWings.controlPoint2.x + speed;
            fairyWings.endPoint.x = fairyWings.endPoint.x + speed;
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
            
            var innerRadius = fairyData.innerRadius || 20;
            var outerRadius = fairyData.outerRadius || 50;
            var innerColor = fairyData.innerColor || "white";
            var outerColor = fairyData.outerColor || "rgb(137, 255, 249)";

            fairyWings.controlPoint1.x = fairyWings.controlPoint1.x + fairyWings.howOpen;
            fairyWings.controlPoint2.x = fairyWings.controlPoint2.x + fairyWings.howOpen;
            fairyWings.endPoint.x = fairyWings.endPoint.x + fairyWings.howOpen;
            wings(fairyWings);

            var radialGradient = ctx.createRadialGradient(
                0, 0, innerRadius, 0, 0, outerRadius);

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