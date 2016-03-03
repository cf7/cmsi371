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

    // ** courtesy of stackoverflow
    var keysEqual = function (object1, object2) {
        var keys1String = Object.keys(object1).sort();
        var keys2String = Object.keys(object2).sort();
        return JSON.stringify(keys1String) === JSON.stringify(keys2String);
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

        // ** add code to reset currentFrame to 0
        // ** for animation looping
        
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

            // Clear the canvas.
            renderingContext.clearRect(0, 0, width, height);

            // For every sprite, go to the current pair of keyframes.
            // Then, draw the sprite based on the current frame.
            for (var i = 0, maxI = sprites.length; i < maxI; i += 1) {
                for (var j = 0, maxJ = sprites[i].keyframes.length - 1; j < maxJ; j += 1) {
                    // We look for keyframe pairs such that the current
                    // frame is between their frame numbers.
                    
                    var nextKeyframe = sprites[i].keyframes[j + 1];

                    if ((sprites[i].keyframes[j].frame <= currentFrame) &&
                            (currentFrame <= nextKeyframe.frame)) {
                        // Point to the start and end keyframes.
                        var startKeyframe = sprites[i].keyframes[j];
                        var endKeyframe = nextKeyframe;

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
                        
                        tweenProcess(startKeyframe, endKeyframe, currentTweenFrame, duration, ease);

                        var properties = {
                            context: renderingContext,
                            data: startKeyframe
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
            if (!startsWithNT(property) && property != "frame" && typeof startKeyframe[property] != "function") {
                if (typeof startKeyframe[property] === "object") {
                    tweenProcess(startKeyframe[property], endKeyframe[property], currentTweenFrame, duration, ease);
                } else if (typeof startKeyframe[property] === "number") {
                    var start = startKeyframe[property] || 0;
                    var distance = (endKeyframe[property] || 1) - start;
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
        snap: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return Math.pow(distance * percentComplete, 3) + start;
        },

        // ** add tweening function
        slowStart: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return (distance * Math.pow(percentComplete, 3)) + start;
        },

        initialize: initializeAnimation
    };
}());
