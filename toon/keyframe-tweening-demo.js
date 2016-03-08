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
                // {
                //     frame: 0,
                //     tx: 800,
                //     ty: 400,
                //     ease: KeyframeTweener.linear,
                //     trunk: {
                //         dimensions: { width: 50, height: 300 }
                //     },
                //     branches: {
                //         dimensions: { width: 50, height: 75 },
                //         nextThickness: 0.5,
                //         angles: (Math.PI/9),
                //         layers: 3,
                //         leaves: {
                //             position: { x: 0, y: 0 },
                //             radius: 20,
                //             startAngle: 0,
                //             endAngle: 4 * Math.PI/3,
                //             counterClockwise: true,
                //             leafColor: "green",
                //             count: 2,
                //         },
                //     },
                //     barkColor: "rgb(90, 55, 45)",
                //     edge: "edge"
                // },

                // {
                //     frame: 200,
                //     tx: 800,
                //     ty: 400,
                //     ease: KeyframeTweener.linear,
                //     trunk: {
                //         dimensions: { width: 50, height: 300 }
                //     },
                //     branches: {
                //         dimensions: { width: 50, height: 75 },
                //         nextThickness: 0.5,
                //         angles: (Math.PI/10),
                //         layers: 7,
                //         leaves: {
                //             position: { x: 0, y: 0 },
                //             radius: 20,
                //             startAngle: 0,
                //             endAngle: 4 * Math.PI/3,
                //             counterClockwise: true,
                //             leafColor: "green",
                //             count: 2,
                //         },
                //     },
                //     barkColor: "rgb(90, 55, 45)",
                //     edge: "edge"
                // },
            ]
        },

        {
            draw: drawWater,
            keyframes: [
                // {
                //     frame: 0,
                //     tx: 300,
                //     ty: 700,
                //     ease: KeyframeTweener.linear,
                //     radius: 30,
                //     ntstartAngle: 0,
                //     ntendAngle: Math.PI*2,
                //     counterClockwise: true,
                //     color: "rgba(0, 130, 255, 0.9)",
                //     numberWaves: 30
                // },

                // {
                //     frame: 200,
                //     tx: 300,
                //     ty: 700,
                //     ease: KeyframeTweener.linear,
                //     radius: 300,
                //     ntstartAngle: 0,
                //     ntendAngle: Math.PI*2,
                //     counterClockwise: true,
                //     color: "rgba(0, 130, 255, 0.9)",
                //     numberWaves: 30
                // },
            ]
        },

        {
            draw: drawFairy,
            keyframes: [
                // {
                //     frame: 0,
                //     tx: 400,
                //     ty: 400,
                //     sx: 1,
                //     sy: 1,
                //     // rotate: 30,
                //     //ease: KeyframeTweener.linear,
                //     ntinnerRadius: 20,
                //     ntbeforeRadius: 20,
                //     ntouterRadius: 50,
                //     innerColor: "white",
                //     outerColor: "rgb(137, 255, 249)",
                //     glowIncrement: true,
                //     up: true,
                //     direction: {forward: true, left: false, right: false },
                //     wingsInward: true,
                //     ntbeforeX: outerRadius + 10,
                //     howOpen: 0,
                //     flutterSpeed: 4,
                //     howGlowy: 10,
                //     glowSpeed: 0,
                //     edge: "edge"
                //     // ** add properties that call functions on themselves
                //     // ** this is probably where non-monotonic tweening
                //     // ** functions would go
                // },

                // {
                //     frame: 200,
                //     tx: 400,
                //     ty: 400,
                //     sx: 1,
                //     sy: 1,
                //     // rotate: -30,
                //     // ease: KeyframeTweener.linear,
                //     ntinnerRadius: 20,
                //     ntbeforeRadius: 20,
                //     ntouterRadius: 50,
                //     innerColor: "white",
                //     outerColor: "rgb(137, 255, 249)",
                //     glowIncrement: true,
                //     up: true,
                //     direction: {forward: true, left: false, right: false },
                //     wingsInward: true,
                //     ntbeforeX: outerRadius + 10,
                //     howOpen: 0,
                //     flutterSpeed: 10,
                //     howGlowy: 10,
                //     glowSpeed: 0,
                //     edge: "edge"
                // },
            ]
        }
    ];

    // ** does not matter what order the keyframes are in!!!
    // ** keyframe-tweener only checks whether properties changed

    // ** keyframe-tweener now only looks for keyframes with edge properties
    // ** to mark as endpoints, when in-between keyframes are generated
    // ** (for the internal movements), then the tweener processes them in
    // ** relation to the two edge keyframes

    var addRandomFairyKeyframe = function (frame) {
        return {
            frame: frame,
            tx: 400 + (Math.random()*(300)*Math.pow(-1, Math.round(Math.random()*2))),
            ty: 400 + (Math.random()*(300)*Math.pow(-1, Math.round(Math.random()*2))),
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
            flutterSpeed: 10,
            howGlowy: 0,
            glowSpeed: 0,
            edge: "edge"
        };
    };

    var addFlutterAndGlowKeyframe = function (frame) {
        return {
            frame: frame,
            innerRadius: 20,
            howOpen: 0,
            flutterSpeed: 10,
            howGlowy: 10,
            glowSpeed: 0
        };
    }

    var modifyProperty = function (data, propertyName, newValue) {
        var keys = Object.keys(data);
        for (property of keys) {
            if (typeof data[property] === "object") {
                modifyProperty(data[property], propertyName, newValue);
            } else if (property === propertyName) {
                data[property] = newValue;
            }
        }
        return data;
    }

    var flutterAndGlow = function (frames, flutterSpeed, howOpen, glowSpeed, howGlowy) {
        var fairyKeyframes = sprites[2].keyframes;
        var frameDelta = flutterSpeed;
        var currentFrame = 0;
        var duration = frames.lastFrame - frames.firstFrame;
        var newRadius = fairyKeyframes[0].ntinnerRadius;
        var originalHowOpen = howOpen;
        newRadius = newRadius + howGlowy;

        for (var index = 0; index < (duration/frameDelta); index++) {
            var newFrame = modifyProperty(modifyProperty(addFlutterAndGlowKeyframe(currentFrame), 
                            "howOpen", howOpen), 
                            "innerRadius", newRadius);
            fairyKeyframes.push(newFrame);
            currentFrame += frameDelta;
            howOpen *= -1;
            howGlowy *= -1;
            newRadius = newRadius + howGlowy;
        }
    }

    var addFairy = function (firstFrame, lastFrame, properties) {
        var fairyKeyframes = sprites[2].keyframes;
        var frames = { firstFrame: firstFrame, lastFrame: lastFrame };

        fairyKeyframes.push(addRandomFairyKeyframe(firstFrame));
        flutterAndGlow(frames, properties.flutterSpeed, properties.howOpen, 
                        properties.glowSpeed, properties.howGlowy);
        fairyKeyframes.push(addRandomFairyKeyframe(lastFrame));
    }

    var addFairies = function (number) {
        for (var index = 0; index < number; index++) {
            var properties = {
                flutterSpeed: 5,
                howOpen: 20,
                glowSpeed: 15,
                howGlowy: 10
            };
            addFairy(0, 200, properties);
        }
    }
    
    //addFairies(3);


    var addStaticTreeKeyframe = function (frame) {
        return  {
            frame: frame,
            tx: 800,
            ty: 400,
            // ease: KeyframeTweener.linear,
            trunk: {
                dimensions: { width: 50, height: 300 }
            },
            branches: {
                dimensions: { width: 50, height: 75 },
                nextThickness: 0.5,
                angles: (Math.PI/10),
                layers: 7,
                leaves: {
                    position: { x: 0, y: 0 },
                    radius: 20,
                    startAngle: 0,
                    endAngle: 4 * Math.PI/3,
                    counterClockwise: true,
                    leafColor: "green",
                    count: 2,
                },
            },
            barkColor: "rgb(90, 55, 45)",
            edge: "edge"
        }
    };


    var rustleLeaves = function (frames, leafRadius, howOpen, rustleSpeed) {
        var treeKeyframes = sprites[0].keyframes;
        var frameDelta = rustleSpeed;
        var currentFrame = frames.firstFrame;
        var duration = frames.lastFrame - frames.firstFrame;
        for (var index = 0; index < (duration/frameDelta); index++) {
            var newRadius =  leafRadius + Math.round((Math.random() * howOpen));
            var newFrame = addStaticTreeKeyframe(currentFrame);
            newFrame = modifyProperty(newFrame, "radius", newRadius);
            treeKeyframes.push(newFrame);
            currentFrame += frameDelta;
        }
    };

    var addTree = function (firstFrame, lastFrame, properties) {
        var treeKeyframes = sprites[0].keyframes;
        var frames = { firstFrame: firstFrame, lastFrame: lastFrame };

        treeKeyframes.push(addStaticTreeKeyframe(firstFrame));
        rustleLeaves(frames, properties.leafRadius, properties.howOpen, properties.rustleSpeed);
        treeKeyframes.push(addStaticTreeKeyframe(lastFrame));
    };

    var properties = {
        leafRadius: 20,
        howOpen: 10,
        rustleSpeed: 10,
    };

    addTree(0, 250, properties);

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