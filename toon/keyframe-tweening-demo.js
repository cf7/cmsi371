/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas");

    // First, a selection of "drawing functions" from which we
    // can choose.  Their common trait: they all accept a single
    // renderingContext argument.
    var square = function (renderingContext, data) {
        renderingContext.fillStyle = "blue";
        renderingContext.fillRect(-20, -20, 40, 40);
    };

    var circle = function (renderingContext, data) {
        renderingContext.strokeStyle = "red";
        renderingContext.beginPath();
        renderingContext.arc(0, 0, 50, 0, Math.PI * 2);
        renderingContext.stroke();
    };

    // ** engine should pass an entire obejct into drawing function
    // ** supply defaults!
    // ** add tweening functions for each proportie or range of properties
    // ** add background
    var drawFairy = function (renderingContext, data) {
        window.SpriteLibrary.fairy({
                    context: renderingContext,
                    //setting: backGround,
                    fairyData: data
                });
    }

    var fairyTweener = function (data) {

        if (data.innerRadius < data.outerRadius/2 && data.glowIncrement) {
            data.innerRadius++;
        }
        if (data.innerRadius >= data.outerRadius/2 && data.glowIncrement) {
            data.glowIncrement = !data.glowIncrement;
        }
        if (data.innerRadius > data.outerRadius/4 && !data.glowIncrement) {
            data.innerRadius--;
        }
        if (data.innerRadius < data.outerRadius/4 && !data.glowIncrement) {
            data.glowIncrement = !data.glowIncrement;
        }

        return data;
    }

    var drawTree = function (renderingContext, data) {
        window.SpriteLibrary.tree({
            context: renderingContext,
            //setting: backGround,
            treeData: data
        });
    }

    var treeTweener = function (data) {
        console.log("inside");
        if (data.branches.leaves.endAngle < 4*Math.PI/3 - Math.PI/15) {
            data.shakeIncrement = true;
        }
        if (data.shakeIncrement) {
            data.branches.leaves.endAngle = data.branches.leaves.endAngle += Math.PI/20;
        }
        if (data.branches.leaves.endAngle > 4*Math.PI/3 + Math.PI/15) {
            data.shakeIncrement = false;
        }
        if (!data.shakeIncrement) {
            data.branches.leaves.endAngle = data.branches.leaves.endAngle -= Math.PI/20;
        }
        return data;
    }

    // Then, we have "easing functions" that determine how
    // intermediate frames are computed.

    // Now, to actually define the animated sprites.  Each sprite
    // has a drawing function and an array of keyframes.
    var sprites = [

    // ** can also use automation to build the keyframes
        {
            //** engine should be able to tween n number of properties in each keyframe
            draw: square,
            data: { },
            tweener: function () { },
            keyframes: [
                {
                    frame: 0,
                    tx: 20,
                    ty: 20,
                    ease: KeyframeTweener.linear
                    // ** add properties that call functions on themselves
                    // ** this is probably where non-monotonic tweening
                    // ** functions would go
                },

                {
                    frame: 30,
                    tx: 100,
                    ty: 50,
                    ease: KeyframeTweener.quadEaseInOut
                },

                // The last keyframe does not need an easing function.
                {
                    frame: 80,
                    tx: 80,
                    ty: 500,
                    rotate: 60 // Keyframe.rotate uses degrees.
                }
            ]
        },

        {
            draw: circle,
            data: { },
            tweener: function () { },
            keyframes: [
                {
                    frame: 50,
                    tx: 300,
                    ty: 600,
                    sx: 0.5,
                    sy: 0.5,
                    ease: KeyframeTweener.quadEaseOut
                },

                {
                    frame: 100,
                    tx: 300,
                    ty: 0,
                    sx: 3,
                    sy: 0.25,
                    ease: KeyframeTweener.quadEaseOut
                },

                {
                    frame: 150,
                    tx: 300,
                    ty: 600,
                    sx: 0.5,
                    sy: 0.5
                }
            ]
        },

        {
            draw: drawFairy,
            data: {
                    center: { x: 200, y: 400 },
                    innerRadius: 10,
                    outerRadius: 50,
                    innerColor: "white",
                    outerColor: "rgb(137, 255, 249)",
                    glowIncrement: true
            },
            tweener: fairyTweener,
            keyframes: [
                {
                    frame: 0,
                    tx: -100,
                    ty: -100,
                    ease: KeyframeTweener.linear
                },

                {
                    frame: 50,
                    tx: 0,
                    ty: 0,
                    ease: KeyframeTweener.linear
                },

                {
                    frame: 150,
                    tx: 400,
                    ty: 50,
                }
            ]
        },

        {
            draw: drawTree,
            data: {
                    trunk: {
                        position: { x: 700, y: 400},
                        dimensions: { width: 50, height: 300 }
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
                            count: 2,
                            shakeIncrement: true
                        },
                    },
                    barkColor: "rgb(90, 55, 45)"
            },
            tweener: treeTweener,
            keyframes: [
                {
                    frame: 0,
                    tx: -100,
                    ty: 0,
                    ease: KeyframeTweener.linear
                },

                {
                    frame: 50,
                    tx: 100,
                    ty: 0,
                    ease: KeyframeTweener.linear
                },

                {
                    frame: 200,
                    tx: 0,
                    ty: 0,
                }
            ]
        }
    ];

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());