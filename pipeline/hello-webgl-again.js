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
        // console.log("data: " + data.rz);
        // console.log(glFormat(new Matrix(4, 4).getRotationMatrix(4, 4, data).elements));
        if (!x && !y && !z) {
            return new Matrix(4, 4);
        } else {
            return new Matrix(4, 4).getRotationMatrix(4, 4, data);
        }
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


    var context = {
        save: save,
        restore: restore,
        translate: translate,
        scale: scale,
        rotate: rotate,
        savedMatrices: savedMatrices,
        currentTransform: transformationMatrix
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




    // ** Shape objects default to spheres

    var vertices = [
        [ 2.0, 0.0, 2.0 ],
        [ 2.0, 0.0, 0.0 ],
        [ 0.0, 2.0, 3.0 ]
    ];
    var indices = [
        [ 0, 1, 2 ]
    ];

    var shape = new Shape(gl);
    shape.setColor({ r: 0.0, g: 0.5, b: 0.0 });
    shape.setVertices(shape.cone(20));
    shape.setDrawingStyle("triangles");
    shape.translateShape(1, 1.5, 1);

    var shape2 = new Shape(gl);
    shape2.setVertices({ vertices: vertices, indices: indices });
    shape2.setDrawingStyle("triangles");
    shape2.setColor({ r: 0.0, g: 0.5, b: 0.5 });
    shape2.translateShape(0.5, -0.75);
    shape2.scaleShape(0.5, 0.5, 0.5);
    shape2.rotateShape(60, 1, 1, 1);
  
    var shape3 = new Shape(gl);
    shape3.setColor({ r: 0.0, g: 0.75, b: 0.75 });
    shape3.setVertices(shape3.sphere(0.75, 20, 20));
    shape3.setDrawingStyle("lines");


    var shape4 = new Shape(gl);    
    shape4.setVertices(shape4.cube(0.5));
    shape4.translateShape(1, -0.5, -1);
    shape4.scaleShape(1.5, 1.5, 1.5);

    shape4.addChild(new Shape(gl));
    shape4.addChild(new Shape(gl));
    shape4.getChildren()[0].addChild(new Shape(gl));

    shape4.getChildren()[0].translateShape(0.15, 0.15, 0);
    shape4.getChildren()[1].translateShape(0.25, 0.25, 0);
    shape4.getChildren()[0].getChildren()[0].translateShape(0, 1, 0);
    shape4.getChildren()[0].getChildren()[0].rotateShape(30, 1, 1, 0);
    shape4.getChildren()[0].getChildren()[0].scaleShape(0.5, 0.5, 0.5);


    var shape5 = new Shape(gl);
    shape5.setColor({ r: 0.0, g: 0.75, b: 0.75 });
    shape5.setVertices(shape5.cylinder(0.25, 0.5, 20));
    shape5.setDrawingStyle("triangles");
    shape5.scaleShape(1.5, 1.5, 1.5);
    shape5.translateShape(-1, 0, 0);

    var shape6 = new Shape(gl);
    shape6.setColor({ r: 0.0, g: 0.75, b: 0.75 });
    shape6.setVertices(shape6.trapezium(0.5));
    shape6.setDrawingStyle("lines");
    shape6.translateShape(-1, 0, 1);

    // Build the objects to display.
    var preObjectsToDraw = [
        // {
        //     vertices: [].concat(
        //         [ 0.0, 0.0, 0.0 ],
        //         [ 0.5, 0.0, -0.75 ],
        //         [ 0.0, 0.5, 0.0 ]
        //     ),
        //     colors: [].concat(
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 0.0, 1.0 ]
        //     ),
        //     mode: gl.TRIANGLES            
        // },

        // {
        //     color: { r: 0.0, g: 1.0, b: 0 },
        //     vertices: [].concat(
        //         [ 0.25, 0.0, -0.5 ],
        //         [ 0.75, 0.0, -0.5 ],
        //         [ 0.25, 0.5, -0.5 ]
        //     ),
        //     mode: gl.TRIANGLES
        // },

        // {
        //     color: { r: 0.0, g: 0.0, b: 1.0 },
        //     vertices: [].concat(
        //         [ -0.25, 0.0, 0.5 ],
        //         [ 0.5, 0.0, 0.5 ],
        //         [ -0.25, 0.5, 0.5 ]
        //     ),
        //     mode: gl.TRIANGLES
        // },

        // {
        //     color: { r: 0.0, g: 0.0, b: 1.0 },
        //     vertices: [].concat(
        //         [ -1.0, -1.0, 0.75 ],
        //         [ -1.0, -0.1, -1.0 ],
        //         [ -0.1, -0.1, -1.0 ],
        //         [ -0.1, -1.0, 0.75 ]
        //     ),
        //     mode: gl.LINE_LOOP
        // },
    ];
        
    preObjectsToDraw.push(shape.getData());
    preObjectsToDraw.push(shape2.getData());
    preObjectsToDraw.push(shape3.getData());
    preObjectsToDraw.push(shape4.getData());
    preObjectsToDraw.push(shape5.getData());
    preObjectsToDraw.push(shape6.getData());

    var objectsToDraw = [];

    var add = function (object) {
        var child;
        var newObject = {};
        var array = [];

        if (object.shape.getChildren().length > 0) {
            for (var i = 0; i < object.shape.getChildren().length; i += 1) {
                child = object.shape.getChildren()[i];
                array.push(child.getData());
                array = array.concat(add(child.getData()));
            }
        }
        return array;
    }

    for (var i = 0, maxi = preObjectsToDraw.length; i < maxi; i += 1) {
        objectsToDraw.push(preObjectsToDraw[i]);
        if (preObjectsToDraw[i].shape) {
            objectsToDraw = objectsToDraw.concat(add(preObjectsToDraw[i]));
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

   
    var globalProjectionMatrix = gl.getUniformLocation(shaderProgram, "globalProjectionMatrix");
    var globalMatrix = gl.getUniformLocation(shaderProgram, "globalMatrix");
    var camera = gl.getUniformLocation(shaderProgram, "camera");
    var modelView = gl.getUniformLocation(shaderProgram, "modelView");

    /*
     * Displays an individual object.
     */
    var drawObject = function (object) {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

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

        gl.uniformMatrix4fv(modelView, gl.FALSE, new Float32Array(glFormat(context.currentTransform.elements)));

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

        save();

        translate(0, 0, 0);
        scale(1, 1, 1);
        rotate(currentRotation, 1, 1, 0);
        
        gl.uniformMatrix4fv(globalMatrix, gl.FALSE, new Float32Array(glFormat(context.currentTransform.elements)));

        var location = { x: 0, y: 0, z: 0};
        var lookAt = { x: -1, y: 0, z: -1};
        var cameraMatrix = new Matrix(4, 4).getCameraMatrix(location, lookAt).elements;
        console.log(cameraMatrix);
        gl.uniformMatrix4fv(camera, gl.FALSE, new Float32Array(glFormat(cameraMatrix)));
        // if getting invalid size error, might need a glFormat()

        // ** only activate one of the projection matrices at a time

        // gl.uniformMatrix4fv(globalProjectionMatrix, gl.FALSE, new Float32Array(getFrustumMatrix(
        //     -2 * (canvas.width / canvas.height), // change the 2's to change the projection
        //     2 * (canvas.width / canvas.height),
        //     -2,
        //     2,              
        //     0.5, // viewing volume, near plane
        //     10 // viewing volume, far plane, only what's inside viewing volume can be seen
        // )));
        gl.uniformMatrix4fv(globalProjectionMatrix, gl.FALSE, new Float32Array(getOrthoMatrix(
            -2 * (canvas.width / canvas.height), // change the 2's to change the projection
            2 * (canvas.width / canvas.height),
            -2,
            2,              
            -10, // viewing volume, near plane
            10 // viewing volume, far plane, only what's inside viewing volume can be seen
        )));

        restore();

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