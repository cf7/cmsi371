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

    // Reasoning
    // *******
    // The way the tweenProcess function in keyframe-tweener.js is set up,
    // it tweens every number property that exists in an object, no matter how nested.
    // Because of this, it is important to be able to not tween certain properties.
    // Although simply passing untweenable properties into another object and then
    // passing that object into the fairy drawing function would work, the changes to
    // the properties that occurr in fairy.js would not be preserved in iterations
    // over the same startKeyframe in keyframe-tweener.js (because a "new" object
    // is pasesed in every time).
    // Therefore, there is a way to continually pass in the same object while
    // still being able to designate which properties should not be tweened.
    // The four functions below accomplish this by handling properties that are
    // tagged (beging with) the string "nt" which stands for "no tweening"
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

        var rememberedKeys = rememberKeys(properties, []);
        unTag(properties);

        window.SpriteLibrary.fairy({
                    context: properties.context,
                    //setting: backGround,
                    fairyData: properties.data,
                    fairyWings: properties.data.fairyWings
                });

        reTag(properties, rememberedKeys);
    }

    var drawTree = function (properties) {
        var rememberedKeys = rememberKeys(properties, []);
        unTag(properties);

        console.log(properties);
        window.SpriteLibrary.tree({
            context: properties.context,
            //setting: backGround,
            treeData: properties.data //{
            //         trunk: {
            //             position: { x: 700, y: 400},
            //             dimensions: { width: 50, height: 300 }
            //         },
            //         branches: {
            //             dimensions: { width: 50, height: 75 },
            //             nextThickness: 0.5,
            //             angles: (Math.PI/9),
            //             layers: 3,
            //             leaves: {
            //                 position: { x: 500, y: 250 },
            //                 radius: 20,
            //                 startAngle: 0,
            //                 endAngle: 4 * Math.PI/3,
            //                 counterClockwise: true,
            //                 leafColor: "green",
            //                 hasLeaves: false,
            //                 count: 2,
            //                 shakeIncrement: true
            //             },
            //         },
            //         barkColor: "rgb(90, 55, 45)",
            // },
        });
        
        reTag(properties, rememberedKeys);
    };

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

    // properties that are not to be tweened are tagged with
    // "nt" at the beginning of their key names.
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
                // {
                //     frame: 0,
                //     tx: 0,
                //     ty: 0,
                //     sx: 1,
                //     sy: 1,
                //     // rotate: 30,
                //     ease: KeyframeTweener.slowStart,
                //     center: { x: 200, y: 400 },
                //     ntinnerRadius: 10,
                //     ntbeforeRadius: 10,
                //     ntouterRadius: 50,
                //     innerColor: "white",
                //     outerColor: "rgb(137, 255, 249)",
                //     glowIncrement: true,
                //     up: true,
                //     fairyWings: {
                //         ntstartPoint: { x: 0, y: 0 },
                //         ntcontrolPoint1: { x: outerRadius, 
                //             y: -outerRadius - 40 },
                //         ntcontrolPoint2: { x: outerRadius + 30, 
                //             y: -outerRadius},
                //         ntendPoint: { x: outerRadius - 10, 
                //             y: 0 },
                //         direction: {forward: true, left: false, right: false },
                //         color: "rgba(200, 200, 200, 0.5)",
                //         wingsInward: true,
                //         ntbeforeX: outerRadius + 10,
                //         flutterSpeed: 4
                //     }
                //     // ** add properties that call functions on themselves
                //     // ** this is probably where non-monotonic tweening
                //     // ** functions would go
                // },

                // {
                //     frame: 100,
                //     tx: 300,
                //     ty: -300,
                //     sx: 1,
                //     sy: 1,
                //     // rotate: -30,
                //     // ease: KeyframeTweener.linear,
                //     center: { x: 200, y: 400 },
                //     ntinnerRadius: 20,
                //     ntbeforeRadius: 20,
                //     ntouterRadius: 50,
                //     innerColor: "white",
                //     outerColor: "rgb(137, 255, 249)",
                //     glowIncrement: true,
                //     up: true,
                //     fairyWings: {
                //         ntstartPoint: { x: 0, y: 0 },
                //         ntcontrolPoint1: { x: outerRadius, 
                //             y: -outerRadius - 40 },
                //         ntcontrolPoint2: { x: outerRadius + 30, 
                //             y: -outerRadius},
                //         ntendPoint: { x: outerRadius - 10, 
                //             y: 0 },
                //         direction: {forward: true, left: false, right: false },
                //         color: "rgba(200, 200, 200, 0.5)",
                //         wingsInward: true,
                //         ntbeforeX: outerRadius + 10,
                //         flutterSpeed: 10
                //     }
                // },

                // {
                //     frame: 150,
                //     tx: 100,
                //     ty: -100,
                //     sx: 1,
                //     sy: 1,
                //     // rotate: -30,
                //     ease: KeyframeTweener.linear,
                //     center: { x: 200, y: 400 },
                //     ntinnerRadius: 20,
                //     ntbeforeRadius: 20,
                //     outerRadius: 50,
                //     innerColor: "white",
                //     outerColor: "rgb(137, 255, 249)",
                //     glowIncrement: true,
                //     up: true,
                //     fairyWings: {
                //         ntstartPoint: { x: 0, y: 0 },
                //         ntcontrolPoint1: { x: outerRadius, 
                //             y: -outerRadius - 40 },
                //         ntcontrolPoint2: { x: outerRadius + 30, 
                //             y: -outerRadius},
                //         ntendPoint: { x: outerRadius - 10, 
                //             y: 0 },
                //         direction: {forward: true, left: false, right: false },
                //         color: "rgba(200, 200, 200, 0.5)",
                //         wingsInward: true,
                //         beforeX: outerRadius + 10,
                //         flutterSpeed: 10
                //     }
                // },

                // {
                //     frame: 200,
                //     tx: 150,
                //     ty: -150,
                //     sx: 1,
                //     sy: 1,
                //     // rotate: -30,
                //     ease: KeyframeTweener.linear,
                //     center: { x: 200, y: 400 },
                //     ntinnerRadius: 20,
                //     ntbeforeRadius: 20,
                //     outerRadius: 50,
                //     innerColor: "white",
                //     outerColor: "rgb(137, 255, 249)",
                //     glowIncrement: true,
                //     up: true,
                //     fairyWings: {
                //         ntstartPoint: { x: 0, y: 0 },
                //         ntcontrolPoint1: { x: outerRadius, 
                //             y: -outerRadius - 40 },
                //         ntcontrolPoint2: { x: outerRadius + 30, 
                //             y: -outerRadius},
                //         ntendPoint: { x: outerRadius - 10, 
                //             y: 0 },
                //         direction: {forward: true, left: false, right: false },
                //         color: "rgba(200, 200, 200, 0.5)",
                //         wingsInward: true,
                //         beforeX: outerRadius + 10,
                //         flutterSpeed: 7
                //     }
                // }
            ]
        },

        {
            draw: drawTree,
            keyframes: [
                {
                    frame: 0,
                    tx: 100,
                    ty: 0,
                    ease: KeyframeTweener.linear,
                    trunk: {
                        position: { x: 700, y: 400},
                        dimensions: { width: 50, height: 300 }
                    },
                    branches: {
                        dimensions: { width: 50, height: 75 },
                        nextThickness: 0.5,
                        angles: (Math.PI/9),
                        layers: 3,
                        ntleaves: {
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

                {
                    frame: 200,
                    tx: 100,
                    ty: 0,
                    ease: KeyframeTweener.linear,
                    trunk: {
                        position: { x: 700, y: 400},
                        dimensions: { width: 50, height: 300 }
                    },
                    branches: {
                        dimensions: { width: 50, height: 75 },
                        nextThickness: 0.5,
                        angles: (Math.PI/10),
                        layers: 7,
                        ntleaves: {
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
                }

        //         // {
        //         //     frame: 500,
        //         //     tx: -100,
        //         //     ty: 0,
        //         // }
            ]
        },

        

        // {
        //     draw: square,
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