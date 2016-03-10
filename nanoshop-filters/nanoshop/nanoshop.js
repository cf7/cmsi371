/*
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing.
 */
var Nanoshop = {
    /*
     * A basic "darkener."
     */
    darkener: function (x, y, r, g, b, a) {
        return [ r / 2, g / 2, b / 2, a ];
    },

    // ** brightener from in class
    brightener: function (x, y, r, g, b, a) {
        return [ r * 2, g * 2, b * 2, a ];
    },

    // ** add two more filter functions
    blueFinder: function (x, y, r, g, b, a) {
        if (b > 150) {
            return [ r, g * 3, b * 10, a ];
        } else {
            return [ r, g, b, a ];
        }
    },

    fairyDust: function (x, y, r, g, b, a) {
        var random = Math.round(Math.random() * 21);
        var randGreen = Math.round(Math.random() * 3);
        var randBlue = Math.round(Math.random() * 4);
        if (x % random === 0 && y % random === 0) {
            return [ r, g * 2, b * 3, a ];
        } else {
            return [ r, g, b, a ];
        }
    },

    waves: function (x, y, r, g, b, a) {
        var circle = x*x + y*y;
        var randGreen = Math.round(Math.random() * 3);
        var randBlue = Math.round(Math.random() * 4);
        var newPixel = [ r, g, b, a ];
        for (var index = 0; index < 10000; index += 100) {
            if (index <= Math.sqrt(circle) && Math.sqrt(circle) <= index + 50) {
                if (g === 255 || b === 255) {
                    newPixel = [ r, g, b, a ];
                } else {
                    newPixel = [ r, g * randGreen, b * randBlue, a ];
                }
            }
        }
        return newPixel;
    },

    /*
     * Applies the given filter to the given ImageData object,
     * then modifies its pixels according to the given filter.
     *
     * A filter is a function (x, y, r, g, b, a) that returns another
     * pixel as a 4-element array representing an RGBA value.
     */
    applyFilter: function (imageData, filter) {
        // For every pixel, replace with something determined by the filter.
        var pixelArray = imageData.data;

        for (var i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
            var pixelIndex = i / 4;

            var pixel = filter(
                pixelIndex % imageData.width, Math.floor(pixelIndex / imageData.height),
                pixelArray[i], pixelArray[i + 1], pixelArray[i + 2], pixelArray[i + 3]
            );

            for (var j = 0; j < 4; j += 1) {
                pixelArray[i + j] = pixel[j];
            }
        }

        return imageData;
    }
};
