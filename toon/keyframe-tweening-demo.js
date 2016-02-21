/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas");

    // First, a selection of "drawing functions" from which we
    // can choose.  Their common trait: they all accept a single
    // renderingContext argument.
    var square = function (renderingContext) {
        renderingContext.fillStyle = "blue";
        renderingContext.fillRect(-20, -20, 40, 40);
    };

    var circle = function (properties) {    
        var renderingContext = properties.context;
        renderingContext.strokeStyle = "red";
        renderingContext.beginPath();
        renderingContext.arc(properties.x, 0, 50, 0, properties.angle);
        renderingContext.stroke();
    };

    var startsWithNT = function (string) {
        return string.match(/^nt/) === null ? false : true;
    };

    var rename = function (data, key, newKey, value) {
        data[newKey] = value;
        delete data[key];
        return data;
    };

    var rememberKeys = function (data, keyStack) {
        var keys = Object.keys(data);
        for (property of keys) {
            keyStack.push(property);
            if (typeof data[property] === "object") {
                rememberKeys(data[property], keyStack);
            }
        }
        return keyStack;
    };

    var unTag = function (data) {
        var keys = Object.keys(data);
        for (property of keys) {
            if (startsWithNT(property)) {
                rename(data, property, property.replace("nt", ""), data[property]);
            }
            if (typeof data[property] === "object") {
                unTag(data[property]);
            }
        }
        return data;
    };

    var reTag = function (data, rememberedKeys) {
        var keys = Object.keys(data);
        for (property of keys) {
            for (var index = 0; index < rememberedKeys.length; index++) {
                if (startsWithNT(rememberedKeys[index])) {
                    if (rememberedKeys[index].replace("nt", "") === property) {
                        rename(data, property, rememberedKeys[index], data[property]);
                    }
                }
            }
            if (typeof data[property] === "object") {
                reTag(data[property], rememberedKeys);
            }
        }
        return data;
    };

    // ** engine should pass an entire obejct into drawing function
    // ** supply defaults!
    // ** add tweening functions for each property or range of properties
    // ** add background
    var drawFairy = function (properties) {
        // Method 1
        // ********
        // For now, passing in all of the tweened data, but the sprite
        // only takes in the tweened data that it wants.
        // So even though other values were tweened, it doesn't have
        // to take them all in.
        // ********

        // Method 2
        // ********
        // creating proxy object with properties that will remain
        // constant (untweened), at last minute, will replace the tweened
        // values in the properties object to keep those values constant
        // doing it this way because passing in this proxyData directly
        // into the SpriteLibrary.fairy function will keep all values constant
        // block the properties object from being modified. When changes are 
        // made to the fairyData or fairyWings objects in fairy.js, those changes
        // are preserved in the next iteration in keyframe-tweener.js via
        // the properties object.

        var proxyData = {
            fairyData: {
                    center: { x: 200, y: 400 },
                    innerRadius: 10, // properties.data.innerRadius,
                    beforeRadius: 10, // properties.data.beforeRadius,
                    outerRadius: 50,
                    innerColor: "white",
                    outerColor: "rgb(137, 255, 249)",
                    glowIncrement: true,
                    up: true
                },
                fairyWings: {
                    startPoint: { x: 0, y: 0 },
                    controlPoint1: { x: outerRadius, 
                        y: -outerRadius - 40 },
                    controlPoint2: { x: outerRadius + 30, 
                        y: -outerRadius},
                    endPoint: { x: outerRadius - 10, 
                        y: 0 },
                    direction: {forward: true, left: false, right: false },
                    color: "rgba(200, 200, 200, 0.5)",
                    wingsInward: true,
                    beforeX: outerRadius + 10,
                    flutterSpeed: 4 // properties.data.fairyWings.flutterSpeed
                }
        };

        // things to remain constant
        // properties.data.center = proxyData.fairyData.center;
        // properties.data.outerRadius = proxyData.fairyData.outerRadius;
        // properties.data.fairyWings.startPoint = proxyData.fairyWings.startPoint;
        // properties.data.fairyWings.controlPoint1 = proxyData.fairyWings.controlPoint1;
        // properties.data.fairyWings.controlPoint2 = proxyData.fairyWings.controlPoint2;
        // properties.data.fairyWings.endPoint = proxyData.fairyWings.endPoint;

        var rememberedKeys = rememberKeys(properties, []);
        unTag(properties);

        var innerRadius = 10;
        var outerRadius = 50;
        window.SpriteLibrary.fairy({
                    context: properties.context,
                    //setting: backGround,
                    fairyData: properties.data, //{
                    //     center: { x: 200, y: 400 },
                    //     innerRadius: 10, // properties.data.innerRadius,
                    //     beforeRadius: 10, // properties.data.beforeRadius,
                    //     outerRadius: 50,
                    //     innerColor: "white",
                    //     outerColor: "rgb(137, 255, 249)",
                    //     // glowIncrement: true,
                    //     up: true
                    // },
                    fairyWings: properties.data.fairyWings //{
                    //     startPoint: { x: 0, y: 0 },
                    //     controlPoint1: { x: outerRadius, 
                    //         y: -outerRadius - 40 },
                    //     controlPoint2: { x: outerRadius + 30, 
                    //         y: -outerRadius},
                    //     endPoint: { x: outerRadius - 10, 
                    //         y: 0 },
                    //     direction: {forward: true, left: false, right: false },
                    //     color: "rgba(200, 200, 200, 0.5)",
                    //     wingsInward: true,
                    //     beforeX: outerRadius + 10,
                    //     flutterSpeed: 4 // properties.data.fairyWings.flutterSpeed
                    // }
                });

        reTag(properties, rememberedKeys);
    }

    var drawTree = function (renderingContext) {
        window.SpriteLibrary.tree({
            context: renderingContext,
            //setting: backGround,
            treeData: {
                    trunk: {
                        position: { x: 700, y: 400},
                        dimensions: { width: 50, height: 300 }
                    },
                    branches: {
                        dimensions: { width: 50, height: 75 },
                        nextThickness: 0.5,
                        angles: (Math.PI/9),
                        layers: 3,
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
                    barkColor: "rgb(90, 55, 45)",
                    frame: 0
            },
        });
    }

    var treeTweener = function (data) {
        console.log("inside");
        // if (data.branches.leaves.endAngle < 4*Math.PI/3 - Math.PI/15) {
        //     data.shakeIncrement = true;
        // }
        // if (data.shakeIncrement) {
        //     data.branches.leaves.endAngle = data.branches.leaves.endAngle += Math.PI/20;
        // }
        // if (data.branches.leaves.endAngle > 4*Math.PI/3 + Math.PI/15) {
        //     data.shakeIncrement = false;
        // }
        // if (!data.shakeIncrement) {
        //     data.branches.leaves.endAngle = data.branches.leaves.endAngle -= Math.PI/20;
        // }

        if (data.frame % 100 === 0) {
            console.log("inside");
            data.branches.layers = data.branches.layers + 1;
        }
        return data;
    }

    // Then, we have "easing functions" that determine how
    // intermediate frames are computed.

    // Now, to actually define the animated sprites.  Each sprite
    // has a drawing function and an array of keyframes.
    var innerRadius = 10;
    var outerRadius = 50;
    var sprites = [
        // ** can also use automation to build the keyframes
        // ** tweening: the calculation of intermediate steps and execution
        // ** of those intermediate frames (interpolation basically)
        // ** tweening properties should be able to be interpolated from their
        // ** present value to a future value, and have a function that determines
        // ** how those values are interpolated (quadratically, linearly, . . . etc.)
        {
            //** engine should be able to tween n number of properties in each keyframe
            // ** tweenable properties should be in the keyframe objects in the keyframes array
            // ** can have functions that the tweener consults to receive data about
            // ** the current state of the sprite
            // ** idea is that animator can look at keyframes and see the state of the sprite
            // ** at any given keyframe, the computer takes care of what happens in between
            draw: drawFairy,
            keyframes: [
                {
                    frame: 0,
                    tx: 0,
                    ty: 0,
                    sx: 1,
                    sy: 1,
                    // rotate: 30,
                    ease: KeyframeTweener.linear,
                    center: { x: 200, y: 400 },
                    ntinnerRadius: 10,
                    ntbeforeRadius: 10,
                    outerRadius: 50,
                    innerColor: "white",
                    outerColor: "rgb(137, 255, 249)",
                    glowIncrement: true,
                    up: true,
                    fairyWings: {
                        ntstartPoint: { x: 0, y: 0 },
                        ntcontrolPoint1: { x: outerRadius, 
                            y: -outerRadius - 40 },
                        ntcontrolPoint2: { x: outerRadius + 30, 
                            y: -outerRadius},
                        ntendPoint: { x: outerRadius - 10, 
                            y: 0 },
                        direction: {forward: true, left: false, right: false },
                        color: "rgba(200, 200, 200, 0.5)",
                        wingsInward: true,
                        beforeX: outerRadius + 10,
                        flutterSpeed: 4
                    }
                    // ** add properties that call functions on themselves
                    // ** this is probably where non-monotonic tweening
                    // ** functions would go
                },

                {
                    frame: 150,
                    tx: 0,
                    ty: 0,
                    sx: 1,
                    sy: 1,
                    // rotate: -30,
                    ease: KeyframeTweener.linear,
                    center: { x: 200, y: 400 },
                    ntinnerRadius: 20,
                    ntbeforeRadius: 20,
                    outerRadius: 50,
                    innerColor: "white",
                    outerColor: "rgb(137, 255, 249)",
                    glowIncrement: true,
                    up: true,
                    fairyWings: {
                        ntstartPoint: { x: 0, y: 0 },
                        ntcontrolPoint1: { x: outerRadius, 
                            y: -outerRadius - 40 },
                        ntcontrolPoint2: { x: outerRadius + 30, 
                            y: -outerRadius},
                        ntendPoint: { x: outerRadius - 10, 
                            y: 0 },
                        direction: {forward: true, left: false, right: false },
                        color: "rgba(200, 200, 200, 0.5)",
                        wingsInward: true,
                        beforeX: outerRadius + 10,
                        flutterSpeed: 4
                    }
                },

                // {
                //     frame: 150,
                //     tx: 400,
                //     ty: 50,
                //     sx: 1,
                //     sy: 1,
                //     // rotate: 30,
                //     ease: KeyframeTweener.linear,
                //     center: { x: 200, y: 400 },
                //     innerRadius: 30,
                //     beforeRadius: 30,
                //     outerRadius: 50,
                //     innerColor: "white",
                //     outerColor: "rgb(137, 255, 249)",
                //     glowIncrement: true,
                //     up: true,
                //     fairyWings: {
                //         startPoint: { x: 0, y: 0 },
                //         controlPoint1: { x: outerRadius, 
                //             y: -outerRadius - 40 },
                //         controlPoint2: { x: outerRadius + 30, 
                //             y: -outerRadius},
                //         endPoint: { x: outerRadius - 10, 
                //             y: 0 },
                //         direction: {forward: true, left: false, right: false },
                //         color: "rgba(200, 200, 200, 0.5)",
                //         wingsInward: true,
                //         beforeX: outerRadius + 10,
                //         flutterSpeed: 4
                //     }

                // },

                // {
                //     frame: 200,
                //     tx: 400,
                //     ty: 50,
                //     sx: 1,
                //     sy: 1,
                //     // rotate: -30,
                //     center: { x: 200, y: 400 },
                //     innerRadius: 30,
                //     beforeRadius: 30,
                //     outerRadius: 50,
                //     innerColor: "white",
                //     outerColor: "rgb(137, 255, 249)",
                //     glowIncrement: true,
                //     up: true,
                //     fairyWings: {
                //         startPoint: { x: 0, y: 0 },
                //         controlPoint1: { x: outerRadius, 
                //             y: -outerRadius - 40 },
                //         controlPoint2: { x: outerRadius + 30, 
                //             y: -outerRadius},
                //         endPoint: { x: outerRadius - 10, 
                //             y: 0 },
                //         direction: {forward: true, left: false, right: false },
                //         color: "rgba(200, 200, 200, 0.5)",
                //         wingsInward: true,
                //         beforeX: outerRadius + 10,
                //         flutterSpeed: 4
                //     }
                // }
            ]
        },

        // {
        //     draw: drawTree,
        //     keyframes: [
        //         {
        //             frame: 0,
        //             tx: 100,
        //             ty: 0,
        //             ease: KeyframeTweener.linear
        //         },

        //         {
        //             frame: 200,
        //             tx: 100,
        //             ty: 0,
        //             ease: KeyframeTweener.linear
        //         },

        //         {
        //             frame: 500,
        //             tx: -100,
        //             ty: 0,
        //         }
        //     ]
        // },

        // {
        //     draw: square,
        //     data: { contextframe: 0 },
        //     tweener: function (data) { return data; },
        //     keyframes: [
        //         {
        //             frame: 0,
        //             tx: 20,
        //             ty: 20,
        //             ease: KeyframeTweener.linear
        //         },

        //         {
        //             frame: 30,
        //             tx: 100,
        //             ty: 50,
        //             ease: KeyframeTweener.quadEaseInOut
        //         },

        //         // The last keyframe does not need an easing function.
        //         {
        //             frame: 80,
        //             tx: 80,
        //             ty: 500,
        //             rotate: 60 // Keyframe.rotate uses degrees.
        //         }
        //     ]
        // },

        // {
        //     draw: circle,
        //     keyframes: [
        //         {
        //             frame: 50,
        //             tx: 300,
        //             ty: 600,
        //             sx: 0.5,
        //             sy: 0.5,
        //             angle: Math.PI * 2,
        //             x: 0,
        //             ease: KeyframeTweener.quadEaseOut
        //         },

        //         {
        //             frame: 100,
        //             tx: 300,
        //             ty: 0,
        //             sx: 3,
        //             sy: 0.25,
        //             angle: Math.PI / 2,
        //             x: 50,
        //             ease: KeyframeTweener.quadEaseOut
        //         },

        //         {
        //             frame: 150,
        //             tx: 300,
        //             ty: 600,
        //             sx: 0.5,
        //             sy: 0.5,
        //             angle: Math.PI * 3,
        //             x: 0
        //         }
        //     ]
        // }
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