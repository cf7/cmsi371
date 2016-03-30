/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    var glFormat = function (matrix) {
        return [
            matrix[0][0],
            matrix[1][0],
            matrix[2][0],
            matrix[3][0],

            matrix[0][1],
            matrix[1][1],
            matrix[2][1],
            matrix[3][1],

            matrix[0][2],
            matrix[1][2],
            matrix[2][2],
            matrix[3][2],

            matrix[0][3],
            matrix[1][3],
            matrix[2][3],
            matrix[3][3]
        ];
    }

    var getTranslationMatrix = function (x, y, z) {
        var data = { tx: x, ty: y, tz: z };
        return glFormat(new Matrix(4, 4).getTranslateMatrix(4, 4, data).elements);
    }

    var getScaleMatrix = function (x, y, z) {
        var data = { sx: x, sy: y, sz: z };
        return glFormat(new Matrix(4, 4).getScaleMatrix(4, 4, data).elements);
    }

    /*
     * This code does not really belong here: it should live
     * in a separate library of matrix and transformation
     * functions.  It is here only to show you how matrices
     * can be used with GLSL.
     *
     * Based on the original glRotate reference:
     *     http://www.opengl.org/sdk/docs/man/xhtml/glRotate.xml
     */
    var getRotationMatrix = function (angle, x, y, z) {
        // In production code, this function should be associated
        // with a matrix object with associated functions.
        var axisLength = Math.sqrt((x * x) + (y * y) + (z * z));
        var s = Math.sin(angle * Math.PI / 180.0);
        var c = Math.cos(angle * Math.PI / 180.0);
        var oneMinusC = 1.0 - c;

        // Normalize the axis vector of rotation.
        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        // Now we can calculate the other terms.
        // "2" for "squared."
        var x2 = x * x;
        var y2 = y * y;
        var z2 = z * z;
        var xy = x * y;
        var yz = y * z;
        var xz = x * z;
        var xs = x * s;
        var ys = y * s;
        var zs = z * s;

        // GL expects its matrices in column major order.
        return [
            (x2 * oneMinusC) + c,
            (xy * oneMinusC) + zs,
            (xz * oneMinusC) - ys,
            0.0,

            (xy * oneMinusC) - zs,
            (y2 * oneMinusC) + c,
            (yz * oneMinusC) + xs,
            0.0,

            (xz * oneMinusC) + ys,
            (yz * oneMinusC) - xs,
            (z2 * oneMinusC) + c,
            0.0,

            0.0,
            0.0,
            0.0,
            1.0
        ];
    };

    // Grab the WebGL rendering context.
    var gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);


    // ** add preprocessing code here

    var vertices = [
        [ 0.0, 0.0, 1.0 ],
        [ 1.0, 0.0, 0.0 ],
        [ 0.0, 1.0, 0.0 ]
    ];
    var indices = [
        [ 0, 1, 2 ]
    ];
    var shape = new Shape();
    var shape2 = new Shape(vertices, indices);
    var shape3 = new Shape();

    // Build the objects to display.
    var objectsToDraw = [
        {
            vertices: [].concat(
                [ 0.0, 0.0, 0.0 ],
                [ 0.5, 0.0, -0.75 ],
                [ 0.0, 0.5, 0.0 ]
            ),
            colors: [].concat(
                [ 1.0, 0.0, 0.0 ],
                [ 0.0, 1.0, 0.0 ],
                [ 0.0, 0.0, 1.0 ]
            ),
            mode: gl.TRIANGLES            
        },

        {
            color: { r: 0.0, g: 1.0, b: 0 },
            vertices: [].concat(
                [ 0.25, 0.0, -0.5 ],
                [ 0.75, 0.0, -0.5 ],
                [ 0.25, 0.5, -0.5 ]
            ),
            mode: gl.TRIANGLES
        },

        {
            color: { r: 0.0, g: 0.0, b: 1.0 },
            vertices: [].concat(
                [ -0.25, 0.0, 0.5 ],
                [ 0.5, 0.0, 0.5 ],
                [ -0.25, 0.5, 0.5 ]
            ),
            mode: gl.TRIANGLES
        },

        {
            color: { r: 0.0, g: 0.0, b: 1.0 },
            vertices: [].concat(
                [ -1.0, -1.0, 0.75 ],
                [ -1.0, -0.1, -1.0 ],
                [ -0.1, -0.1, -1.0 ],
                [ -0.1, -1.0, 0.75 ]
            ),
            mode: gl.LINE_LOOP
        },

        // ** change shapes and drawing orders here

        // ** rotation axis found in drawScene function

        // {
        //     color: { r: 0.0, g: 0.5, b: 0.0 },
        //     vertices: shape.toRawTriangleArray(shape.cone(20)),
        //     mode: gl.TRIANGLES
        // },

        {
            color: { r: 0.0, g: 0.5, b: 0.5 },
            vertices: shape2.toRawTriangleArray({ vertices: shape2.vertices, indices: shape2.indices }),
            mode: gl.TRIANGLES,
            translate: { tx: 0.5, ty: -0.75, tz: 0.5 },
            scale: { sx: 0.5, sy: 0.5, sz: 0.5 },
            rotate: { angle: 60, x: 0, y: 1, z: 0 }
        },

        {
            color: { r: 0.0, g: 0.5, b: 0.25 },
            vertices: shape3.toRawLineArray(shape3.sphere(0.75, 20, 20)),
            mode: gl.LINES
        }

    ];

    // Pass the vertices to WebGL.
    for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
        objectsToDraw[i].buffer = GLSLUtilities.initVertexBuffer(gl,
                objectsToDraw[i].vertices);

        if (!objectsToDraw[i].colors) {
            // If we have a single color, we expand that into an array
            // of the same color over and over.
            objectsToDraw[i].colors = [];
            for (var j = 0, maxj = objectsToDraw[i].vertices.length / 3;
                    j < maxj; j += 1) {
                objectsToDraw[i].colors = objectsToDraw[i].colors.concat(
                    objectsToDraw[i].color.r,
                    objectsToDraw[i].color.g,
                    objectsToDraw[i].color.b
                );
            }
        }
        objectsToDraw[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                objectsToDraw[i].colors);
    }

    // Initialize the shaders.
    var abort = false;
    var shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    var vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    var vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);

    // ** retrieves the location of these variables from the html GL code
    var rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
    var translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");
    var scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");

    /*
     * Displays an individual object.
     */
    var drawObject = function (object) {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        // ** modifies the matrices in these variables in the html gl code
        // ** modifications are reflected instantly
        // ** add code to check for translate, scale, rotate per object,
        // ** otherwise, identity matrix
        // ** remember to pass Matrix object elements, not just the Matrix object
        // ** remember GL format
        gl.uniformMatrix4fv(translationMatrix, gl.FALSE, new Float32Array(object.translate ?
            getTranslationMatrix(object.translate.tx, object.translate.ty, object.translate.tz) :  
            glFormat(new Matrix(4, 4).elements)
            ));
        gl.uniformMatrix4fv(scaleMatrix, gl.FALSE, new Float32Array(object.scale ?
            getScaleMatrix(object.scale.sx, object.scale.sy, object.scale.sz) :
            glFormat(new Matrix(4, 4).elements)
            ));
        // gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, new Float32Array(object.rotate ?
        //     getRotationMatrix(object.rotate.angle, object.rotate.x, object.rotate.y, object.rotate.z) :
        //     glFormat(new Matrix(4, 4).elements)
        //     ));

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);
    };

    /*
     * Displays the scene.
     */
    var drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up the rotation matrix.
        gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, new Float32Array(getRotationMatrix(currentRotation, 1, 1, 0)));

        // Display the objects.
        for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            drawObject(objectsToDraw[i]);
        }

        // All done.
        gl.flush();
    };

    /*
     * Animates the scene.
     */
    var animationActive = false;
    var currentRotation = 0.0;
    var previousTimestamp = null;

    var advanceScene = function (timestamp) {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }

        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // Check if it's time to advance.
        var progress = timestamp - previousTimestamp;
        if (progress < 30) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // All clear.
        currentRotation += 0.033 * progress;
        drawScene();
        if (currentRotation >= 360.0) {
            currentRotation -= 360.0;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(function () {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

}(document.getElementById("hello-webgl")));