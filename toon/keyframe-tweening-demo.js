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

        window.SpriteLibrary.tree({
            context: properties.context,
            //setting: backGround,
            treeData: properties.data
        });
        
        reTag(properties, rememberedKeys);
    };

    var drawWater = function (properties) {
        var rememberedKeys = rememberKeys(properties, []);
        unTag(properties);

        window.SpriteLibrary.water({
            context: properties.context,
            //setting: backGround,
            waterData: properties.data
        });

        reTag(properties, rememberedKeys);
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

    // properties that are not to be tweened are tagged with
    // "nt" at the beginning of their key names.
    // The "nt" must be added to the same property across all keyframes
    // of the sprite to avoid an error.
    var sprites = [
        // ** can also use automation to build the keyframes
        // ** tweening: the calculation of intermediate steps and execution
        // ** of those intermediate frames (interpolation basically)
        // ** tweening properties should be able to be interpolated from their
        // ** present value to a future value, and have a function that determines
        // ** how those values are interpolated (quadratically, linearly, . . . etc.)
        //** engine should be able to tween n number of properties in each keyframe
        // ** tweenable properties should be in the keyframe objects in the keyframes array
        // ** can have functions that the tweener consults to receive data about
        // ** the current state of the sprite
        // ** idea is that animator can look at keyframes and see the state of the sprite
        // ** at any given keyframe, the computer takes care of what happens in between
        {
            draw: drawTree,
            keyframes: [
                {
                    frame: 0,
                    tx: 800,
                    ty: 400,
                    ease: KeyframeTweener.linear,
                    trunk: {
                        dimensions: { width: 50, height: 300 }
                    },
                    branches: {
                        dimensions: { width: 50, height: 75 },
                        nextThickness: 0.5,
                        angles: (Math.PI/9),
                        layers: 3,
                        ntleaves: {
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
                    tx: 800,
                    ty: 400,
                    ease: KeyframeTweener.linear,
                    trunk: {
                        dimensions: { width: 50, height: 300 }
                    },
                    branches: {
                        dimensions: { width: 50, height: 75 },
                        nextThickness: 0.5,
                        angles: (Math.PI/10),
                        layers: 7,
                        ntleaves: {
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
            ]
        },

        {
            draw: drawWater,
            keyframes: [
                {
                    frame: 0,
                    tx: 300,
                    ty: 700,
                    ease: KeyframeTweener.linear,
                    radius: 30,
                    ntstartAngle: 0,
                    ntendAngle: Math.PI*2,
                    counterClockwise: true,
                    color: "rgba(0, 130, 255, 0.9)",
                    numberWaves: 30
                },

                {
                    frame: 200,
                    tx: 300,
                    ty: 700,
                    ease: KeyframeTweener.linear,
                    radius: 300,
                    ntstartAngle: 0,
                    ntendAngle: Math.PI*2,
                    counterClockwise: true,
                    color: "rgba(0, 130, 255, 0.9)",
                    numberWaves: 30
                },
            ]
        },

        {
            draw: drawFairy,
            keyframes: [
                {
                    frame: 0,
                    tx: 400,
                    ty: 400,
                    sx: 1,
                    sy: 1,
                    // rotate: 30,
                    ease: KeyframeTweener.linear,
                    ntinnerRadius: 10,
                    ntbeforeRadius: 10,
                    ntouterRadius: 50,
                    innerColor: "white",
                    outerColor: "rgb(137, 255, 249)",
                    glowIncrement: true,
                    up: true,
                    direction: {forward: true, left: false, right: false },
                    wingsInward: true,
                    ntbeforeX: outerRadius + 10,
                    howOpen: 0,
                    flutterSpeed: 4
                    // ** add properties that call functions on themselves
                    // ** this is probably where non-monotonic tweening
                    // ** functions would go
                },

                {
                    frame: 200,
                    tx: 400,
                    ty: 400,
                    sx: 1,
                    sy: 1,
                    // rotate: -30,
                    // ease: KeyframeTweener.linear,
                    ntinnerRadius: 20,
                    ntbeforeRadius: 20,
                    ntouterRadius: 50,
                    innerColor: "white",
                    outerColor: "rgb(137, 255, 249)",
                    glowIncrement: true,
                    up: true,
                    direction: {forward: true, left: false, right: false },
                    wingsInward: true,
                    ntbeforeX: outerRadius + 10,
                    howOpen: 0,
                    flutterSpeed: 10
                },
            ]
        },
    ];

    var addFairyKeyFrame = function (frame) {
        return {
            frame: frame,
            tx: 600, //+ (Math.random()*(300)*Math.pow(-1, Math.round(Math.random()*2))),
            ty: 400, //+ (Math.random()*(300)*Math.pow(-1, Math.round(Math.random()*2))),
            sx: 1,
            sy: 1,
            // rotate: -30,
            // ease: KeyframeTweener.linear,
            ntinnerRadius: 20,
            ntbeforeRadius: 20,
            ntouterRadius: 50,
            innerColor: "white",
            outerColor: "rgb(137, 255, 249)",
            glowIncrement: true,
            up: true,
            direction: {forward: true, left: false, right: false },
            wingsInward: true,
            howOpen: 0,
            ntbeforeX: outerRadius + 10,
            flutterSpeed: 10
        };
    };

    var modifyProperty = function (data, propertyName, newValue) {
        data[propertyName] = newValue;
        return data;
    }

    var flutterAndGlow = function (frame, open) {
        var fairyKeyframes = sprites[2].keyframes;
        var currentFrame = 0;
        //for (var index = 0; index < duration; index++) {
        fairyKeyframes.push(modifyProperty(addFairyKeyFrame(frame), "howOpen", open));
        //}
    }
    var frameDelta = 5;
    var currentFrame = 0;
    var open = 20;
    var duration = sprites[2].keyframes[1].frame - sprites[2].keyframes[0].frame;
    for (var index = 0; index < (duration/frameDelta); index++) {
        console.log("open: " + open);
        console.log("frame: " + currentFrame);
        flutterAndGlow(currentFrame, open);
        currentFrame += frameDelta;
        open *= -1;
    }
    //var fairies = function (number, sprites) {
    // var fairyKeyframes = sprites[2].keyframes;
    // var currentFrame = 0;
    // var frameDelta = 10;
    // for (var index = 0; index < 7; index++) {
    //     fairyKeyframes.push(addFairyKeyFrame(0));
    //     fairyKeyframes.push(addFairyKeyFrame(100));
    //     fairyKeyframes.push(addFairyKeyFrame(200));
    // }
   // };

    // var fairyKeyframes = sprites[0].keyframes;
    // var currentFrame = sprites[0].keyframes[sprites[0].keyframes.length - 1].frame;
    // var frameDelta = 10;
    // for (var x = 15; x < 600; x += 31) {
    //     fairyKeyframes.push({
    //         frame: currentFrame,
    //         tx: 300 + (x % 2 ? -100 : 100),
    //         ty: 0,
    //         sx: 1,
    //         sy: 1,
    //         // rotate: -30,
    //         // ease: KeyframeTweener.linear,
    //         center: { x: 200, y: 400 },
    //         ntinnerRadius: 20,
    //         ntbeforeRadius: 20,
    //         ntouterRadius: 50,
    //         innerColor: "white",
    //         outerColor: "rgb(137, 255, 249)",
    //         glowIncrement: true,
    //         up: true,
    //         fairyWings: {
    //             ntstartPoint: { x: 0, y: 0 },
    //             ntcontrolPoint1: { x: outerRadius, 
    //                 y: -outerRadius - 40 },
    //             ntcontrolPoint2: { x: outerRadius + 30, 
    //                 y: -outerRadius},
    //             ntendPoint: { x: outerRadius - 10, 
    //                 y: 0 },
    //             direction: {forward: true, left: false, right: false },
    //             color: "rgba(200, 200, 200, 0.5)",
    //             wingsInward: true,
    //             ntbeforeX: outerRadius + 10,
    //             flutterSpeed: 10
    //         }
    //     });
    //     currentFrame += frameDelta;
    // }

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