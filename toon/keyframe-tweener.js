/*
 * A simple keyframe-tweening animation module for 2D
 * canvas elements.
 */
(function () {
    // The big one: animation initialization.  The settings parameter
    // is expected to be a JavaScript object with the following
    // properties:
    //
    // - renderingContext: the 2D canvas rendering context to use
    // - width: the width of the canvas element
    // - height: the height of the canvas element
    // - sprites: the array of sprites to animate
    // - frameRate: number of frames per second (default 24)
    //
    // In turn, each sprite is a JavaScript object with the following
    // properties:
    //
    // - draw: the function that draws the sprite
    // - keyframes: the array of keyframes that the sprite should follow
    //
    // Finally, each keyframe is a JavaScript object with the following
    // properties.  Unlike the other objects, defaults are provided in
    // case a property is not present:
    //
    // - frame: the global animation frame number in which this keyframe
    //          is to appear
    // - ease: the easing function to use (default is KeyframeTweener.linear)
    // - tx, ty: the location of the sprite (default is 0, 0)
    // - sx, sy: the scale factor of the sprite (default is 1, 1)
    // - rotate: the rotation angle of the sprite (default is 0)

    var maxFrame = function (sprites) {
        var maxFrame = 0;
        for (var row = 0; row < sprites.length; row++) {
            for (var col = 0; col < sprites[row].keyframes.length; col++) {
                if (sprites[row].keyframes[col].frame > maxFrame) {
                    maxFrame = sprites[row].keyframes[col].frame;
                }
            }
        }
        return maxFrame;
    };

    var initializeAnimation = function (settings) {
        // We need to keep track of the current frame.
        var currentFrame = 0;

        // Avoid having to go through settings to get to the
        // rendering context and sprites.
        var renderingContext = settings.renderingContext;
        var width = settings.width;
        var height = settings.height;
        var sprites = settings.sprites;

        var previousTimestamp = null;
        
        var nextFrame = function (timestamp) {
            // Bail-out #1: We just started.
            if (!previousTimestamp) {
                previousTimestamp = timestamp;
                window.requestAnimationFrame(nextFrame);
                return;
            }

            // Bail-out #2: Too soon.
            if (timestamp - previousTimestamp < (1000 / (settings.frameRate || 24))) {
                window.requestAnimationFrame(nextFrame);
                return;
            }

            if (currentFrame >= maxFrame(sprites)) {
                currentFrame = 0;
            }

            // Clear the canvas.
            renderingContext.clearRect(0, 0, width, height);

            // For every sprite, go to the current pair of keyframes.
            // Then, draw the sprite based on the current frame.
            for (var i = 0, maxI = sprites.length; i < maxI; i += 1) {
                for (var j = 0, maxJ = sprites[i].keyframes.length - 1; j < maxJ; j += 1) {
                    // We look for keyframe pairs such that the current
                    // frame is between their frame numbers.
                    
                    var originalStartKeyframe = sprites[i].keyframes[j];
                    var originalEndKeyframe = sprites[i].keyframes[j + 1];

                    var whileIndex1 = j;
                    var whileIndex2 = j + 1;
                    var startEdgeKeyframe = originalStartKeyframe;
                    var nextEdgeKeyframe = originalEndKeyframe;
                    while (whileIndex1 >= 0 && !startEdgeKeyframe.hasOwnProperty("edge")) {
                        whileIndex1--;
                        startEdgeKeyframe = sprites[i].keyframes[whileIndex1];
                    }
                    while (whileIndex2 < maxJ && !nextEdgeKeyframe.hasOwnProperty("edge")) {
                        whileIndex2++;
                        nextEdgeKeyframe = sprites[i].keyframes[whileIndex2];
                    }

                    if ((originalStartKeyframe.frame <= currentFrame) &&
                            (currentFrame <= originalEndKeyframe.frame)) {
                        // Point to the start and end keyframes.
                        var startKeyframe = startEdgeKeyframe;
                        var endKeyframe = nextEdgeKeyframe;

                        // Save the rendering context state.
                        renderingContext.save();

                        // Set up our start and distance values, using defaults
                        // if necessary.
                        var ease = startKeyframe.ease || KeyframeTweener.linear;

                        var txStart = startKeyframe.tx || 0;
                        var txDistance = (endKeyframe.tx || 0) - txStart;

                        var tyStart = startKeyframe.ty || 0;
                        var tyDistance = (endKeyframe.ty || 0) - tyStart;

                        var sxStart = startKeyframe.sx || 1;
                        var sxDistance = (endKeyframe.sx || 1) - sxStart;

                        var syStart = startKeyframe.sy || 1;
                        var syDistance = (endKeyframe.sy || 1) - syStart;

                        var rotateStart = (startKeyframe.rotate || 0) * Math.PI / 180;
                        var rotateDistance = (endKeyframe.rotate || 0) * Math.PI / 180 - rotateStart;

                        var currentTweenFrame = currentFrame - startKeyframe.frame;
                        var duration = endKeyframe.frame - startKeyframe.frame + 1;

                        // Build our transform according to where we should be.
                        renderingContext.translate(
                            ease(currentTweenFrame, txStart, txDistance, duration),
                            ease(currentTweenFrame, tyStart, tyDistance, duration)
                        );
                        renderingContext.rotate(
                            ease(currentTweenFrame, rotateStart, rotateDistance, duration)
                        );
                        renderingContext.scale(
                            ease(currentTweenFrame, sxStart, sxDistance, duration),
                            ease(currentTweenFrame, syStart, syDistance, duration)
                        );
                        
                        var linearEase = KeyframeTweener.linear;
                        currentTweenFrame = currentFrame - originalStartKeyframe.frame;
                        duration = originalEndKeyframe.frame - originalStartKeyframe.frame + 1;
                        tweenProcess(originalStartKeyframe, originalEndKeyframe, 
                                    currentTweenFrame, duration, linearEase);

                        var properties = {
                            context: renderingContext,
                            data: originalStartKeyframe
                        };

                        // Draw the sprite.
                        sprites[i].draw(properties);

                        // Clean up.
                        renderingContext.restore();
                    }
                }
            }

            // Move to the next frame.
            currentFrame += 1;
            previousTimestamp = timestamp;
            window.requestAnimationFrame(nextFrame);
        };

        window.requestAnimationFrame(nextFrame);
    };
    
    var startsWithNT = function (string) {
        return string.match(/^nt/) === null ? false : true;
    };

    var tweenProcess = function (startKeyframe, endKeyframe, currentTweenFrame, duration, ease) {
        var keys = Object.keys(startKeyframe);
        for (property of keys) {
            if (!startsWithNT(property) && property !== "frame" && typeof startKeyframe[property] !== "function") {
                if (typeof startKeyframe[property] === "object") {
                    tweenProcess(startKeyframe[property], endKeyframe[property], currentTweenFrame, duration, ease);
                } else if (typeof startKeyframe[property] === "number") {
                    var start = startKeyframe[property] || 0;
                    var distance = (endKeyframe[property] || 1) - start;
                    // ** floating point multiplication by 0 
                    // ** in ease function makes the values converge to 1 
                    // ** because of the 0.0000000000000002 effect
                    if (endKeyframe[property] === startKeyframe[property]) {
                        distance = 0;
                    }
                    startKeyframe[property] = ease(currentTweenFrame, start, distance, duration);

                }
            }
        }
    }

    window.KeyframeTweener = {
        // The module comes with a library of common easing functions.
        linear: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return distance * percentComplete + start;
        },

        quadEaseIn: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return distance * percentComplete * percentComplete + start;
        },

        quadEaseOut: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return -distance * percentComplete * (percentComplete - 2) + start;
        },

        // ** divides duration by 2 so that percentComplete will pass 1
        // ** range of percentComplete is now between 0 and 2
        // ** also need to divide distance by 2 so it doesn't go too far
        // ** when percentComplete < 1, it will calculate using quadEaseIn
        // ** when percentComplete > 1, it will calculate using quadEaseOut
        // ** in the quadEaseOut section, need to subtract percentComplete by 1
        // ** in certain calculations because percentComplete will have passed 1
        // ** by this time
        quadEaseInAndOut: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / (duration / 2);
            return (percentComplete < 1) ?
                    (distance / 2) * percentComplete * percentComplete + start :
                    (-distance / 2) * ((percentComplete - 1) * (percentComplete - 3) - 1) + start;
        },

        // ** baseline sine tweening function from class
        sine: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            var theta = Math.PI * 2 * percentComplete;
            return start + (distance * percentComplete) + (distance * Math.sin(theta));
        },

        // Take the end points and do the in-between point
        // return the value of where that object would be at
        // the given moment
        // almost always should have a percentComplete
        // How far along will the function be at this time?
        // identify "landmarks" in the function to deduce a pattern
        // apply percentComplete to that pattern (like parametric functions,
        // percentComplete is the t variable)
        // ** add tweening function
        // 
        //          percentComplete
        // start |------|----------------| start + distance

        // distance is the x value
        // percentComplete is the t value
        // fairyComposite: function (currentTime, start, distance, duration) {
        //     var percentComplete = currentTime / (duration/4);
        //     if (percentComplete < 1) {
        //         // console.log("inside 1st: " + percentComplete);
        //         return start + (-(distance/4) * percentComplete * (percentComplete - 2));
        //     } else if (1 < percentComplete && percentComplete < 2) {
        //         // console.log("inside 2nd: " + percentComplete);
        //         return start + ((distance/4) * percentComplete);
        //     } else if (2 < percentComplete && percentComplete < 3) {
        //         // console.log("inside 3rd: " + percentComplete);
        //         return start + ((distance/4) * percentComplete * (percentComplete - 1));
        //     } else if (percentComplete < 4) {
        //         // console.log("inside 4th: " + percentComplete);
        //         return start + ((distance/4) * (percentComplete + 3));
        //     }
        // },

        // c = endframe - startframe = distance
        // t/d = percentComplete
        // d = duration
        // b = start

        // c * (t/d) + b
        // ** add tweening function
        // fairyWave: function (currentTime, start, distance, duration) {
        //     var percentComplete = currentTime / duration;
        //     return start + (distance * Math.pow(percentComplete - 1, 3));
        // },

        initialize: initializeAnimation
    };
}());
