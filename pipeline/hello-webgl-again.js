/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    // lighting: 4/7, 4/12, 4/14

    // interactivity: 4/21

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

    var cameraStatus = {
        location: new Vector(0, 0, 0),
        lookAt: new Vector(0, 0, -1),
        up: new Vector(0, 1, 0)
    };

    var clearTransform = function () {
        context.currentTransform = new Matrix(4, 4);
    }

    var save = function () {
        context.savedMatrices.push(context.currentTransform.elements);
    }

    var restore = function () {
        if (context.savedMatrices.length > 0) {
            context.currentTransform.elements = context.savedMatrices.pop().slice();
        }
        return;
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

    var getCameraMatrix = function () {
        console.log(cameraStatus);
        return new Matrix(4, 4).getCameraMatrix(cameraStatus.location, cameraStatus.lookAt, cameraStatus.up);
    }

    var cameraTransform = function () {
        context.currentTransform = getCameraMatrix().mult(context.currentTransform);
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
    shape3.setDrawingStyle("triangles");

    var shape4 = new Shape(gl);    
    shape4.setVertices(shape4.cube(0.5));
    shape4.translateShape(1, -0.5, -1);
    shape4.scaleShape(1.5, 1.5, 1.5);
    shape4.setDrawingStyle("triangles");
    shape4.addChild(new Shape(gl));
    shape4.addChild(new Shape(gl));
    shape4.getChildren()[0].addChild(new Shape(gl));
    var setAllTriangles = function (shapes) {
        for (child of shapes) {
        child.setDrawingStyle("triangles");
            if (child.getChildren().length > 0) {
                setAllTriangles(child.getChildren());
            }
        }
    }
    setAllTriangles(shape4.getChildren());

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
    shape6.setDrawingStyle("triangles");
    shape6.translateShape(-1, 0, 1);

    // Build the objects to display.
    var preObjectsToDraw = [];
        
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

         // Same trick with specular colors.
        if (!objectsToDraw[i].specularColors) {
            // Future refactor: helper function to convert a single value or
            // array into an array of copies of itself.
            objectsToDraw[i].specularColors = [];
            for (var j = 0, maxj = objectsToDraw[i].vertices.length / 3; j < maxj; j += 1) {
                objectsToDraw[i].specularColors = objectsToDraw[i].specularColors.concat(
                    objectsToDraw[i].specularColor.r,
                    objectsToDraw[i].specularColor.g,
                    objectsToDraw[i].specularColor.b
                );
            }
        }

        objectsToDraw[i].specularBuffer = GLSLUtilities.initVertexBuffer(gl, objectsToDraw[i].specularColors);

        objectsToDraw[i].normalBuffer = GLSLUtilities.initVertexBuffer(gl,
                objectsToDraw[i].normals);
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
    // diffuse without specular
    // var vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    // gl.enableVertexAttribArray(vertexColor);
    var vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    var vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    var normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    var lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    var lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    var lightAmbient = gl.getUniformLocation(shaderProgram, "lightAmbient");
    var lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    var shininess = gl.getUniformLocation(shaderProgram, "shininess");


    var globalProjectionMatrix = gl.getUniformLocation(shaderProgram, "globalProjectionMatrix");
    var globalMatrix = gl.getUniformLocation(shaderProgram, "globalMatrix");
    var camera = gl.getUniformLocation(shaderProgram, "camera");
    var modelView = gl.getUniformLocation(shaderProgram, "modelView");

    /*
     * Displays an individual object.
     */
    var drawObject = function (object) {
        // Set the varying colors.
        // diffuse without specular
        // gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        // gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

        gl.uniform1f(shininess, object.shininess);

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
        // have code to translate, scale, and rotate the camera

        gl.uniformMatrix4fv(modelView, gl.FALSE, new Float32Array(glFormat(context.currentTransform.elements)));

        restore();

        // Set the varying normal vectors
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(object.mode, 0, object.vertices.length / 3);
    };

    /*
     * Displays the scene.
     */
 
    var translateX = 0;
    var translateZ = 0;
    var rotationAroundX = 0.0;
    var rotationAroundY = 0.0;
    var drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        save();

        cameraTransform();
        rotate(rotationAroundX, 1, 0, 0);
        rotate(rotationAroundY, 0, 1, 0);
        gl.uniformMatrix4fv(camera, gl.FALSE, new Float32Array(glFormat(context.currentTransform.elements)));

        restore();

        // ** only activate one of the projection matrices at a time

        // Frustum rotates camera but not around cameraFocus
        // ** (canvas.width / canvas.height) is the aspet ratio
        gl.uniformMatrix4fv(globalProjectionMatrix, gl.FALSE, new Float32Array(getFrustumMatrix(
            -0.1 * (canvas.width / canvas.height), // change the 2's to change the projection
            0.1 * (canvas.width / canvas.height),
            -0.1,
            0.1,              
            0.1, // viewing volume, near plane
            100 // viewing volume, far plane, only what's inside viewing volume can be seen
        )));

        // Ortho rotates camera around cameraFocus
        // gl.uniformMatrix4fv(globalProjectionMatrix, gl.FALSE, new Float32Array(getOrthoMatrix(
        //     -2 * (canvas.width / canvas.height), // change the 2's to change the projection
        //     2 * (canvas.width / canvas.height),
        //     -2,
        //     2,              
        //     -10, // viewing volume, near plane
        //     10 // viewing volume, far plane, only what's inside viewing volume can be seen
        // )));

        gl.uniform4fv(lightPosition, [0.0, 0.0, 2.0, 0.5]);
        gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
        gl.uniform3fv(lightAmbient, [0.2, 0.2, 0.2]);
        gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);
        // to turn off specular, set light to all 0.0's

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
    // var animationActive = false;
    // var currentRotation = 0.0;
    // var previousTimestamp = null;

    // var advanceScene = function (timestamp) {
    //     // Check if the user has turned things off.
    //     if (!animationActive) {
    //         return;
    //     }

    //     // Initialize the timestamp.
    //     if (!previousTimestamp) {
    //         previousTimestamp = timestamp;
    //         window.requestAnimationFrame(advanceScene);
    //         return;
    //     }

    //     // Check if it's time to advance.
    //     var progress = timestamp - previousTimestamp;
    //     if (progress < 30) {
    //         // Do nothing if it's too soon.
    //         window.requestAnimationFrame(advanceScene);
    //         return;
    //     }

    //     // All clear.
    //     currentRotation += 0.033 * progress;
    //     drawScene();
    //     if (currentRotation >= 360.0) {
    //         currentRotation -= 360.0;
    //     }

    //     // Request the next frame.
    //     previousTimestamp = timestamp;
    //     window.requestAnimationFrame(advanceScene);
    // };

    /**
        valid interaction features for 1st part:
        -changing the light levels
        -user triggered events
        -time-lapse simulations, use advanceScene code from sample code
        -
        mandatory interaction feature for 2nd part:
        -first-person navigation

    */

    /*
     * Performs rotation calculations.
     */
    var rotateScene = function (event) {
        rotationAroundX = xRotationStart - yDragStart + event.clientY;
        // cameraStatus.lookAt.elements[0] = rotationAroundX;
        rotationAroundY = yRotationStart - xDragStart + event.clientX;
        // cameraStatus.lookAt.elements[1] = rotationAroundY;
        drawScene();
    };

    var xDragStart;
    var yDragStart;
    var xRotationStart;
    var yRotationStart;
    $(canvas).mousedown(function (event) {
        xDragStart = event.clientX;
        yDragStart = event.clientY;
        xRotationStart = rotationAroundX;
        yRotationStart = rotationAroundY;
        $(canvas).mousemove(rotateScene);
    }).mouseup(function (event) {
        $(canvas).unbind("mousemove");
    });

    // up: 38
    // down: 40
    // left: 37
    // right: 39
    // W: 87
    // A: 65
    // S: 83
    // D: 68
    // Q: 81
    // E: 69

    // ** Note: Translate doesn't work in Ortho Projection
    // because objects will just move relative to the camera
    // need to be in frustum
    $("#navigation").keydown(function (event) {
        console.log("inside");
        console.log(event);
        var translateSpeed = 0.3;
        var rotationSpeed = 3;
        // if it is a keydown event, then the actual keyCode is used
        // if it is a keypress event, then 32 is added to each key
        if (event.keyCode === 87) {
            // need to subtract the y from the Q vector because it's everything
            // else's y's that are being moved! not the camera's
            // can't multiply vectors!
            // vector.multiply(s) takes in a scalar
            cameraStatus.location = cameraStatus.location.add(cameraStatus.lookAt.subtract(cameraStatus.location).unit().multiply(translateSpeed));
            drawScene();
        }
        if (event.keyCode === 83) {
            cameraStatus.location = cameraStatus.location.subtract(cameraStatus.lookAt.subtract(cameraStatus.location).unit().multiply(translateSpeed));
            drawScene();
        }
        if (event.keyCode === 65) {
            translateX += translateSpeed;
            drawScene();
        }
        if (event.keyCode === 68) {
            translateX -= translateSpeed;
            drawScene();
        }

        // when rotating Q, keep it's position radial
        // to the camera's location
        if (event.keyCode === 37) {
            rotationAroundY -= rotationSpeed;
            drawScene();
        }
        if (event.keyCode === 39) {
            rotationAroundY += rotationSpeed;
            drawScene();
        }
        if (event.keyCode === 38) {
            rotationAroundX -= rotationSpeed;
            drawScene();
        }
        if (event.keyCode === 40) {
            rotationAroundX += rotationSpeed;
            drawScene();
        }

        $("#navigation").val("");
    });

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    // $(canvas).click(function () {
    //     animationActive = !animationActive;
    //     if (animationActive) {
    //         previousTimestamp = null;
    //         window.requestAnimationFrame(advanceScene);
    //     }
    // });

}(document.getElementById("hello-webgl")));