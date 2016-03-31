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

    var transformationMatrix = new Matrix(4, 4);
    var savedMatrices = [];
    var context = {
        save: save,
        restore: restore,
        translate: translate,
        scale: scale,
        rotate: rotate,
        savedMatrices: savedMatrices,
        currentTransform: transformationMatrix
    }

    var save = function () {
        context.savedMatrices.push(context.currentTransform.elements);
    }

    var restore = function () {
        if (context.savedMatrices.length > 0) {
            context.currentTransform.elements = context.savedMatrices.pop().slice();
        } else {
            return;
        }
    }   

    var getFrustumMatrix = function (left, right, bottom, top, zNear, zFar) {
        // console.log("frustum");
        // console.log(glFormat(new Matrix(4, 4).getFrustumMatrix(left, right, bottom, top, zNear, zFar).elements));
        return glFormat(new Matrix(4, 4).getFrustumMatrix(left, right, bottom, top, zNear, zFar).elements);
    }

    var getOrthoMatrix = function (left, right, bottom, top, zNear, zFar) {
        return glFormat(new Matrix(4, 4).getOrthoMatrix(left, right, bottom, top, zNear, zFar).elements);
    }

    var getTranslationMatrix = function (x, y, z) {
        var data = { tx: x, ty: y, tz: z };
        // console.log(glFormat(new Matrix(4, 4).getTranslateMatrix(4, 4, data).elements));
        return new Matrix(4, 4).getTranslateMatrix(4, 4, data);
    }

    var getScaleMatrix = function (x, y, z) {
        var data = { sx: x, sy: y, sz: z };
        // console.log(glFormat(new Matrix(4, 4).getScaleMatrix(4, 4, data).elements));
        return new Matrix(4, 4).getScaleMatrix(4, 4, data);
    }

    var getRotationMatrix = function (angle, x, y, z) {
        var data = { angle: angle, rx: x, ry: y, rz: z };
        // console.log(data);
        // console.log(glFormat(new Matrix(4, 4).getRotationMatrix(4, 4, data).elements));
        return new Matrix(4, 4).getRotationMatrix(4, 4, data);
    }

    var translate = function (x, y, z) {
        context.currentTransform = getTranslationMatrix(x, y, z).mult(context.currentTransform);
    }

    var scale = function (x, y, z) {
        context.currentTransform = getScaleMatrix(x, y, z).mult(context.currentTransform);
    }

    // ** angle converted to radians in matrix.js
    var rotate = function (angle, x, y, z) {
        context.currentTransform = getRotationMatrix(angle, x, y, z).mult(context.currentTransform);
    }


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
        [ 2.0, 0.0, 2.0 ],
        [ 2.0, 0.0, 0.0 ],
        [ 0.0, 2.0, 3.0 ]
    ];
    var indices = [
        [ 0, 1, 2 ]
    ];

    var shape = new Shape(context);

    // ** custom shape
    var shape2 = new Shape(context, { vertices: vertices, indices: indices });

    var shape3 = new Shape(context);

    var shape4 = new Shape(context);    

    shape4.addChild(new Shape(context));
    shape4.addChild(new Shape(context));
    shape4.getChildren()[0].addChild(new Shape(context));

    // Build the objects to display.
    var preObjectsToDraw = [
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


        // **********
        // ** can create buffer matrices on which to perform transforms
        // ** only if the object contains a tag
        // ** (i.e. objects that have "axis" attribute will be rotated via 
        // ** the buffer matrix, otherwise, if "axis" not found, return identity
        // ** matrix to uniformMatrix4fv)
        // **********

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
            rotate: { angle: 60, rx: 1, ry: 1, rz: 1 }
        },

        {
            color: { r: 0.0, g: 0.75, b: 0.75 },
            vertices: shape3.toRawLineArray(shape3.sphere(0.75, 20, 20)),
            mode: gl.LINES,
        },

        // ** anywhere objectToDraw is called, needs to be able to access children
        // ** because more attributes are being added past this point such as buffers
        {
            shape: shape4,
            color: { r: 0.0, g: 0.75, b: 0.75 },
            vertices: shape4.toRawLineArray(shape4.cube()),
            mode: gl.LINES,
            translate: { tx: 1, ty: -0.5, tz: -1 },
            scale: { sx: 1.5, sy: 1.5, sz: 1.5 }
        }

    ];

    var objectsToDraw = [];

    var add = function (object) {
        var child;
        var newObject = {};
        var array = [];
        // ** function for pushing children into array
        // ** need to be able to transform to make relative to origin

        if (object.shape.getChildren().length > 0) {
            for (var i = 0; i < object.shape.getChildren().length; i += 1) {
                child = object.shape.getChildren()[i];
                newObject = {
                    shape: child,
                    color: { r: 0.0, g: 0.75, b: 0.75 },
                    vertices: child.toRawLineArray(child.cube()),
                    mode: gl.LINES,
                    translate: { tx: object.translate.tx + 0.15, ty: object.translate.ty + 0.15, tz: object.translate.tz }
                }
                array.push(newObject);
                array = array.concat(add(newObject));
            }
        }
        return array;
    }

    for (var i = 0, maxi = preObjectsToDraw.length; i < maxi; i += 1) {
        objectsToDraw.push(preObjectsToDraw[i]);
        if (preObjectsToDraw[i].shape) {
            objectsToDraw = objectsToDraw.concat(add(preObjectsToDraw[i]));
            console.log(objectsToDraw);
        }
    }
    


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
    // var globalRotationMatrix = gl.getUniformLocation(shaderProgram, "globalRotationMatrix");
    // var globalScaleMatrix = gl.getUniformLocation(shaderProgram, "globalScaleMatrix");
    // var globalTranslateMatrix = gl.getUniformLocation(shaderProgram, "globalTranslateMatrix");
    var globalOrthoMatrix = gl.getUniformLocation(shaderProgram, "globalOrthoMatrix");
    var globalFrustumMatrix = gl.getUniformLocation(shaderProgram, "globalFrustumMarix");
    // var rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
    // var translateMatrix = gl.getUniformLocation(shaderProgram, "translateMatrix");
    // var scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");

    var globalMatrix = gl.getUniformLocation(shaderProgram, "globalMatrix");
    var matrix = gl.getUniformLocation(shaderProgram, "matrix");

    /*
     * Displays an individual object.
     */
    var drawObject = function (object) {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        // *****
        // Need save and restore functions for the matrices!!!!
        // They keep the identity matrices so that any transforms can
        // be converted back to identity matrices
        // *****

        // ****
        // Add recursive child-drawing code here
        // ****

        save();

        if (object.translate) {
            translate(object.translate.tx, object.translate.ty, object.translate.tz);
        }
        if (object.scale) {
            scale(object.scale.sx, object.scale.sy, object.scale.sz);
        }
        if (object.rotate) {
            rotate(object.rotate.angle, object.rotate.rx, object.rotate.ry, object.rotate.rz);
        }

        gl.uniformMatrix4fv(matrix, gl.FALSE, new Float32Array(glFormat(context.currentTransform.elements)));

        restore();

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

        var transMatrix = new Matrix(4, 4);
        
        transMatrix = getTranslationMatrix(0, 0, 0).mult(transMatrix);
        transMatrix = getScaleMatrix(1, 1, 1).mult(transMatrix);
        transMatrix = getRotationMatrix(currentRotation, 0, 1, 0).mult(transMatrix);

        gl.uniformMatrix4fv(globalMatrix, gl.FALSE, new Float32Array(glFormat(transMatrix.elements)));
        // ** if objects are at the origin, camera is also at the origin, don't put frustum at origin
        // ** need to push objects back by -z
        // ** use a save and restore to translate farther out before applying perspective
        // ** do not implement until coding save() and restore() functions
        // gl.uniformMatrix4fv(globalFrustumMatrix, gl.FALSE, new Float32Array(getFrustumMatrix(
        //     -2 * (canvas.width / canvas.height), // change the 2's to change the projection
        //     2 * (canvas.width / canvas.height),
        //     -2,
        //     2,              
        //     -10, // viewing volume, near plane
        //     10 // viewing volume, far plane, only what's inside viewing volume can be seen
        // )));
        gl.uniformMatrix4fv(globalOrthoMatrix, gl.FALSE, new Float32Array(getOrthoMatrix(
            -2 * (canvas.width / canvas.height), // change the 2's to change the projection
            2 * (canvas.width / canvas.height),
            -2,
            2,              
            -10, // viewing volume, near plane
            10 // viewing volume, far plane, only what's inside viewing volume can be seen
        )));
        // ** (canvas.width / canvas.height) is the aspet ratio
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