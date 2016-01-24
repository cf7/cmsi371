$(function () {

    window.SpriteLibrary = window.SpriteLibrary || {};

    SpriteLibrary.fairy = function (specifications) {
        ctx = specifications.context;
    
        var fairyData = specifications.fairyData;

        // var fairyData = {
        //     center: {x: 400, y: 300},
        //     innerRadius: 10,
        //     outerRadius: 50,
        //     color: "white"
        // };

        var fairyWings = {
            leftWing: {
                top: {
                    startPoint: { x: fairyData.center.x, y: fairyData.center.y - 20},
                    controlPoint1: { x: fairyData.center.x + fairyData.outerRadius, 
                        y: fairyData.center.y - fairyData.outerRadius - 40 },
                    controlPoint2: { x: fairyData.center.x + fairyData.outerRadius + 30, 
                        y: fairyData.center.y - fairyData.outerRadius},
                    endPoint: { x: fairyData.center.x + fairyData.outerRadius, 
                        y: fairyData.center.y}
                },
                bottom: {
                    startPoint: { x: fairyData.center.x, y: fairyData.center.y},
                    controlPoint1: { x: fairyData.center.x + fairyData.outerRadius, 
                        y: fairyData.center.y + fairyData.outerRadius + 40 },
                    controlPoint2: { x: fairyData.center.x + fairyData.outerRadius + 30, 
                        y: fairyData.center.y + fairyData.outerRadius},
                    endPoint: { x: fairyData.center.x + fairyData.outerRadius, 
                        y: fairyData.center.y}
                }
            },
            rightWing: {
                 top: {
                    startPoint: { x: fairyData.center.x, y: fairyData.center.y - 20},
                    controlPoint1: { x: fairyData.center.x - fairyData.outerRadius, 
                        y: fairyData.center.y - fairyData.outerRadius - 40 },
                    controlPoint2: { x: fairyData.center.x - fairyData.outerRadius - 30, 
                        y: fairyData.center.y - fairyData.outerRadius},
                    endPoint: { x: fairyData.center.x - fairyData.outerRadius, 
                        y: fairyData.center.y}
                },
                bottom: {
                    startPoint: { x: fairyData.center.x, y: fairyData.center.y },
                    controlPoint1: { x: fairyData.center.x - fairyData.outerRadius, 
                        y: fairyData.center.y + fairyData.outerRadius + 40 },
                    controlPoint2: { x: fairyData.center.x - fairyData.outerRadius - 30, 
                        y: fairyData.center.y + fairyData.outerRadius},
                    endPoint: { x: fairyData.center.x - fairyData.outerRadius, 
                        y: fairyData.center.y}
                }
            }
        };

        var drawWing = function (wing) {
            ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
            ctx.beginPath();
            ctx.moveTo(wing.startPoint.x, wing.startPoint.y);
            ctx.lineTo(wing.controlPoint1.x, wing.controlPoint1.y);
            ctx.lineTo(wing.controlPoint2.x, wing.controlPoint2.y);
            ctx.lineTo(wing.endPoint.x, wing.endPoint.y);
            ctx.stroke();

            ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(wing.startPoint.x, wing.startPoint.y);
            ctx.bezierCurveTo(
                wing.controlPoint1.x, wing.controlPoint1.y, 
                wing.controlPoint2.x, wing.controlPoint2.y,
                wing.endPoint.x, wing.endPoint.y);
            ctx.fill();
        };

        var wings = function (leftWing, rightWing) {
            drawWing(leftWing.top);
            drawWing(leftWing.bottom);
            drawWing(rightWing.top);
            drawWing(rightWing.bottom);
        }

        var bodyAt = function (fairyData, fairyWings, glowIncrement) {
            var centerX = fairyData.center.x;
            var centerY = fairyData.center.y;
            var innerRadius = fairyData.innerRadius;
            var outerRadius = fairyData.outerRadius;
            var color = fairyData.color;

            // have fairyWings object get outerRadius data that is not hard coded
            // to be able to add increments for the animation
            wings(fairyWings.leftWing, fairyWings.rightWing);

            var radialGradient = ctx.createRadialGradient(
                centerX, centerY, innerRadius, centerX, centerY, outerRadius - glowIncrement);

            radialGradient.addColorStop(0, color);
            radialGradient.addColorStop(1, "rgb(137, 255, 249)");
            // radialGradient.addColorStop(1, backgroundColor);

            ctx.fillStyle = radialGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2, true);
            ctx.fill();
        };

        // var randomColor = function () {
        //     return "rgb(" + Math.round(Math.random() * 256).toString() 
        //             + "," + Math.round(Math.random() * 256).toString()
        //             + "," + Math.round(Math.random() * 256).toString() + ")";
        // }

        bodyAt(fairyData, fairyWings, 1);
        // var index = 1;
        // var increasing = true;
        // function glow () {
        //     if (index < 1 || ((fairyData.outerRadius - index) - 20 <= fairyData.innerRadius)) {
        //         increasing = !increasing;
        //     }
        //     if (increasing) {
        //         index += 3;
        //     } else {
        //         index -= 3;
        //     }
        //     bodyAt(fairyData, fairyWings, index);
        //     setTimeout(glow, 100);
        // }
        // glow();
    }
});