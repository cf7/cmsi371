/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas");

    // --------------------------------------------
    // ** Animation variables!!! **
    // Feel free to modify these to see what happens in the animation!

    var startFrame = 0;
    var endFrame = 250;
    var numberOfFairies = 3;
    var numberOfTrees = 3;
    var treeBranchAngleIncrement = Math.PI/20;

    // --------------------------------------------


    // First, a selection of "drawing functions" from which we
    // can choose.  Their common trait: they all accept a single
    // renderingContext argument.
    // var square = function (renderingContext) {
    //     renderingContext.fillStyle = "blue";
    //     renderingContext.fillRect(-20, -20, 40, 40);
    // };

    // var circle = function (properties) {    
    //     var renderingContext = properties.context;
    //     renderingContext.strokeStyle = "red";
    //     renderingContext.beginPath();
    //     renderingContext.arc(properties.x, 0, 50, 0, properties.angle);
    //     renderingContext.stroke();
    // };


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
        {
            draw: drawTree,
            keyframes: [
                // {
                //     frame: startFrame,
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
                //     frame: endFrame,
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
                {
                    frame: startFrame,
                    tx: 300,
                    ty: 700,
                    ease: KeyframeTweener.linear,
                    radius: 30,
                    ntstartAngle: 0,
                    ntendAngle: Math.PI*2,
                    counterClockwise: true,
                    color: "rgba(0, 130, 255, 0.9)",
                    numberWaves: 30,
                    edge: "edge"
                },

                {
                    frame: endFrame,
                    tx: 300,
                    ty: 700,
                    ease: KeyframeTweener.linear,
                    radius: 300,
                    ntstartAngle: 0,
                    ntendAngle: Math.PI*2,
                    counterClockwise: true,
                    color: "rgba(0, 130, 255, 0.9)",
                    numberWaves: 50,
                    edge: "edge"
                },
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


    // ** keyframe-tweener now only looks for keyframes with edge properties
    // ** to mark as endpoints, when in-between keyframes are generated
    // ** (for the internal movements), then the tweener processes them in
    // ** relation to the two edge keyframes

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
    };

    var randomEaseFunction = function () {
        var easeFunctions = []
        var keys = Object.keys(window.KeyframeTweener);
        for (property of keys) {
            easeFunctions.push(window.KeyframeTweener[property]);
        }
        var length = easeFunctions.length;
        return easeFunctions[Math.floor(Math.random() * length)];
    };


    var fairyTweeningFunctions = function () {
        var startsWithFairy = function (string) {
            return string.match(/^fairy/) === null ? false : true;
        };
        var defaultEaseFunction = window.KeyframeTweener.linear;
        var easeFunctions = []
        var keys = Object.keys(window.KeyframeTweener);
        for (property of keys) {
            if (startsWithFairy(property)) {
                easeFunctions.push(window.KeyframeTweener[property]);
            }
        }
        var length = easeFunctions.length;
        return easeFunctions[Math.floor(Math.random() * length)] || defaultEaseFunction;
    };

    var addRandomFairyKeyframe = function (frame) {
        return {
            frame: frame,
            tx: 400 + (Math.random()*(300)*Math.pow(-1, Math.round(Math.random()*2))),
            ty: 400 + (Math.random()*(300)*Math.pow(-1, Math.round(Math.random()*2))),
            sx: 1,
            sy: 1,
            // rotate: 0 + Math.floor(Math.random()*(30)*Math.pow(-1, Math.round(Math.random()*2))),
            ease: KeyframeTweener.linear,
            ntinnerRadius: 15,
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
    };

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
    };

    var addFairy = function (firstFrame, lastFrame, properties) {
        var fairyKeyframes = sprites[2].keyframes;
        var frames = { firstFrame: firstFrame, lastFrame: lastFrame };

        var newFirstFrame = addRandomFairyKeyframe(firstFrame);
        newFirstFrame = modifyProperty(newFirstFrame, "ease", fairyTweeningFunctions());

        fairyKeyframes.push(newFirstFrame);
        flutterAndGlow(frames, properties.flutterSpeed, properties.howOpen, 
                        properties.glowSpeed, properties.howGlowy);
        fairyKeyframes.push(addRandomFairyKeyframe(lastFrame));
    };

    var addFairies = function (number) {
        for (var index = 0; index < number; index++) {
            var properties = {
                flutterSpeed: 5,
                howOpen: 20,
                glowSpeed: 15,
                howGlowy: 10
            };
            addFairy(startFrame, endFrame, properties);
        }
    };
    
    addFairies(numberOfFairies);


    var addStaticTreeKeyframe = function (frame) {
        return  {
            frame: frame,
            tx: 800,
            ty: 300,
            sx: 0.75,
            sy: 0.75,
            ease: KeyframeTweener.linear,
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

    var addRandomTreeKeyframe = function (frame) {
        var xVariability = (Math.random()*(400)*Math.pow(-1, Math.round(Math.random()*2)));
        xVariability = Math.round(xVariability);
        return  {
            frame: frame,
            tx: 500 + xVariability,
            ty: 300,
            sx: 0.75,
            sy: 0.75,
            ease: KeyframeTweener.linear,
            trunk: {
                dimensions: { width: 50, height: 300 }
            },
            branches: {
                dimensions: { width: 50, height: 75 },
                nextThickness: 0.5,
                angles: (Math.PI/10),
                layers: 2,
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
        var negOrPos = Math.pow(-1, Math.round(Math.random()*2));
        var angleVariability = Math.random()*(treeBranchAngleIncrement);
        var frames = { firstFrame: firstFrame, lastFrame: lastFrame };
        var newFirstFrame = addRandomTreeKeyframe(firstFrame);
        var newLastFrame = modifyProperty(addStaticTreeKeyframe(lastFrame),
                    "layers", newFirstFrame.branches.layers + 2 + Math.round(Math.random() * 3));
        newLastFrame = modifyProperty(newLastFrame, "angles", 
                    newFirstFrame.branches.angles + angleVariability);
        newLastFrame = modifyProperty(newLastFrame, "tx", newFirstFrame.tx);

        treeKeyframes.push(newFirstFrame);
        // rustleLeaves(frames, properties.leafRadius, properties.howOpen, properties.rustleSpeed);
        treeKeyframes.push(newLastFrame);
    };

    var addTrees = function (number) {
        for (var index = 0; index < number; index++) {
            var properties = {
                leafRadius: 20,
                howOpen: 10,
                rustleSpeed: 10,
            };
            addTree(startFrame, endFrame, properties);
        }
    };

    addTrees(numberOfTrees);

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
