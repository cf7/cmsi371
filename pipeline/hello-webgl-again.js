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

    var context = {
        savedMatrices: savedMatrices,
        currentTransform: transformationMatrix
    }

    var cameraStatus = {
        location: new Vector(0, 0, 0),
        lookAt: new Vector(0, 0, -1),
        up: new Vector(0, 1, 0),
        XZAngle: 0.0,
        YZAngle: 0.0,
        phiAngle: 0.0,
        beginRotatingHorizontal: false,
        beginRotatingVertical: false
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


    // ** find a way to include shape's transforms
    // ** in the translate, scale, and rotate functions 
    // ** such that the shape's transforms are changed by the currentTransform
    // ** (and their child shapes' transforms as well)

    var shape = new Shape(gl);
    shape.setColor({ r: 0.0, g: 0.5, b: 0.0 });
    shape.setVertices(shape.cone(20));
    shape.setDrawingStyle("triangles");
    // shape.translateShape(1, 1.5, 1);

    save();
    translate(1, 1.5, 1);
    shape.setTransform(context.currentTransform);
    restore();

    var shape2 = new Shape(gl);
    shape2.setVertices({ vertices: vertices, indices: indices });
    shape2.setDrawingStyle("triangles");
    shape2.setColor({ r: 0.0, g: 0.5, b: 0.5 });

    save();
    translate(0.5, -0.75, 0.5);
    scale(0.5, 0.5, 0.5);
    rotate(60, 1, 1, 1);
    shape2.setTransform(context.currentTransform);
    restore();
  
    var shape3 = new Shape(gl);
    shape3.setColor({ r: 0.0, g: 0.75, b: 0.75 });
    shape3.setVertices(shape3.sphere(0.75, 20, 20));
    shape3.setDrawingStyle("triangles");

    save();
    translate(0, 0, -1);
    shape3.setTransform(context.currentTransform);
    restore();

    var shape4 = new Shape(gl);    
    shape4.setVertices(shape4.cube(0.5));
    shape4.setDrawingStyle("lines");
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

    save();
    translate(1, 0, -1);
    scale(1.5, 1.5, 1.5);
    shape4.setTransform(context.currentTransform);
    restore();

    // ** 4/19 21:00 child shapes

    save();
    translate(0.5, 0.5, 0.5);
    scale(0.75, 0.75, 0.75);
    shape4.getChildren()[0].setTransform(context.currentTransform);
    restore();
    save();
    translate(0, 0, 1.5);
    shape4.getChildren()[0].getChildren()[0].setTransform(context.currentTransform);
    restore();
    // shape4.getChildren()[0].translateShape(0.15, 0.15, 0);
    // shape4.getChildren()[1].translateShape(0.25, 0.25, 0);
    // shape4.getChildren()[0].getChildren()[0].translateShape(0, 1, 0);
    // shape4.getChildren()[0].getChildren()[0].rotateShape(30, 1, 1, 0);
    // shape4.getChildren()[0].getChildren()[0].scaleShape(0.5, 0.5, 0.5);


    var shape5 = new Shape(gl);
    shape5.setColor({ r: 0.0, g: 0.75, b: 0.75 });
    shape5.setVertices(shape5.cylinder(0.25, 0.5, 20));
    shape5.setDrawingStyle("triangles");

    save();
    scale(1.5, 1.5, 1.5);
    translate(-1, 0, 0);
    shape5.setTransform(context.currentTransform);
    restore();

    var shape6 = new Shape(gl);
    shape6.setColor({ r: 0.0, g: 0.75, b: 0.75 });
    shape6.setVertices(shape6.trapezium(0.5));
    shape6.setDrawingStyle("triangles");

    save();
    translate(-1, 0, 1);
    shape6.setTransform(context.currentTransform);
    restore();
    // shape6.translateShape(-1, 0, 1);

    // Build the objects to display.
    var shapes = [];
        
    shapes.push(shape);
    shapes.push(shape2);
    shapes.push(shape3);
    shapes.push(shape4);
    shapes.push(shape5);
    shapes.push(shape6);

    var objectsToDraw = [];

    var draw = function (shapes) {
        for (var i = 0; i < shapes.length; i++) {
            console.log("draw function");
            console.log(shapes[i].getData());
            objectsToDraw.push(shapes[i].getData());
            if (shapes[i].getChildren().length > 0) {
                draw(shapes[i].getChildren());
            }
        }
    }

    draw(shapes);

    var prepObjects = function (objectsToDraw) {
        console.log("inside prepObjects");
        console.log(objectsToDraw.length);
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

        console.log(objectsToDraw);
        return objectsToDraw;
    }

    objectsToDraw = prepObjects(objectsToDraw);

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

        if (object.transform) {
            context.currentTransform = object.transform.mult(context.currentTransform);
        }

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
        // gl.uniformMatrix4fv(globalProjectionMatrix, gl.FALSE, new Float32Array(getFrustumMatrix(
        //     -0.1 * (canvas.width / canvas.height), // change the 2's to change the projection
        //     0.1 * (canvas.width / canvas.height),
        //     -0.1,
        //     0.1,              
        //     0.1, // viewing volume, near plane
        //     100 // viewing volume, far plane, only what's inside viewing volume can be seen
        // )));

        // Ortho rotates camera around cameraFocus
        gl.uniformMatrix4fv(globalProjectionMatrix, gl.FALSE, new Float32Array(getOrthoMatrix(
            -2 * (canvas.width / canvas.height), // change the 2's to change the projection
            2 * (canvas.width / canvas.height),
            -2,
            2,              
            -10, // viewing volume, near plane
            10 // viewing volume, far plane, only what's inside viewing volume can be seen
        )));

        // ** right now setting position relative to the camera
        // ** but shouldn't be
        gl.uniform4fv(lightPosition, [0.0, 0.0, 2.0, 0.5]);
        gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
        gl.uniform3fv(lightAmbient, [0.25, 0.25, 0.25]);
        gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);

        console.log(objectsToDraw);
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

        if ($("#rotation-button")[0].checked) {
            xDragStart = event.clientX;
            yDragStart = event.clientY;
            xRotationStart = rotationAroundX;
            yRotationStart = rotationAroundY;
            $(canvas).mousemove(rotateScene);
        } else if ($("#place-shape-button")[0].checked) {
            var coords = getMousePos(document.getElementById("hello-webgl"), event)
            addShape(coords.x, coords.y, false);
        }
    }).mouseup(function (event) {
        $(canvas).unbind("mousemove");
    });

    var getMousePos = function (canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX-rect.left, // )/(rect.right-rect.left)*canvas.width,
            y: event.clientY-rect.top//)/(rect.bottom-rect.top)*canvas.height
        };
    }

    var addShape = function (x, y, isBuildObject) {

        var shape = new Shape(gl);
        shape.setColor({ r: 0.0, g: 0.75, b: 0.75 });

        
        if ($("#sphere-button")[0].checked) {
            console.log("inside sphere button checked");
            shape.setVertices(shape.sphere(0.75, 20, 20));
        }
        if ($("#cylinder-button")[0].checked) {
            console.log("inside cylinder button checked");
            shape.setVertices(shape.cylinder(0.25, 0.5, 20));
        }
        if ($("#trapezium-button")[0].checked) {
            console.log("inside trapezium button checked");
            shape.setVertices(shape.trapezium(0.5));
        }

        shape.setDrawingStyle("triangles");

        save();
        translate(x, y, 0);
        scale(0.5, 0.5, 0.5);
        shape.setTransform(context.currentTransform);
        restore();

        shape.buildObject = isBuildObject;
        

        objectsToDraw = objectsToDraw.concat(prepObjects([shape.getData()]));

        drawScene();

        return shape;
    }

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
    // j: 74
    // k: 75
    // enter: 13

    // ** for some reason, XZAngle jumps to 1,1 on first rotation clockwise
    // ** also, rotations stay on YZ plane relative to canvas and not camera's axes

    // ** right now, angles are not reset because events are passed discretely
    // ** need to start where angles left off to maintain radial movement
    // ** however, this also means that if YZAngle rotates differently than XZAngle
    // ** then when going back XZAngle will bounce all the way back to it,
    // ** might be huge difference between angles, causing camera to snap to different point
   
    // ** Note: Translate doesn't work in Ortho Projection
    // because objects will just move relative to the camera
    // need to be in frustum

    var findBuildObject = function () {
        var index = 0;
        for (var i = 0; i < objectsToDraw.length; i++) {
            if (objectsToDraw[i].buildObject) {
                index = i;
            }
        }
        return index;
    }

    var nextShape = function () {
        var i = findBuildObject();
        objectsToDraw[i].buildObject = false;
        addShape(0, 0, true);
        index = findBuildObject();
    }

    console.log($("#builder-mode-button")[0].checked);


    var index = 0;
    var speed = 0.25;
    var angleSpeed = 10;
    var currentScale = 1.0;
    // ** what happens when builder mode is turned off?
    $("#builder-mode-button").on('click', nextShape);

    // ** fix the lag, will sway between values, will keep moving in one direction
    // ** instead of switching to other
    $("#navigation").keydown(function (event) {
        if ($("#builder-mode-button")[0].checked) {
            if (event.keyCode === 87) { // w
                save();
                translate(0, 0, -speed);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }
            if (event.keyCode === 83) { // s
                save();
                translate(0, 0, speed);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 65) { // a
                save();
                translate(-speed, 0, 0);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 68) { // d
                save();
                translate(speed, 0, 0);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 81) { // q
                save();
                translate(0, speed, 0);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 69) { // e
                save();
                translate(0, -speed, 0);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 37) { // left
                save();
                rotate(angleSpeed, 0, 0, 1);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 39) { // right
                save();
                rotate(-angleSpeed, 0, 0, 1);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }


            if (event.keyCode === 38) { // up
                save();
                rotate(-angleSpeed, 1, 0, 0);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }


            if (event.keyCode === 40) { // down
                save();
                rotate(angleSpeed, 1, 0, 0);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 74) { // j
                currentScale -= speed;
                save();
                scale(currentScale, currentScale, currentScale);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 75) { // k
                currentScale += speed;
                save();
                scale(currentScale, currentScale, currentScale);
                objectsToDraw[index].transform = objectsToDraw[index].transform.mult(context.currentTransform);
                restore();
                drawScene();
            }

            if (event.keyCode === 13) {
                nextShape();
            }
        }

        $("#navigation").val("");
    });
     
    // else {
    //     $("#navigation").keydown(function (event) {
    //         console.log("inside");
    //         console.log(event);
    //         var translateSpeed = 0.3;
    //         var rotationSpeed = Math.PI/10;
    //         var directionalVector = cameraStatus.lookAt.subtract(cameraStatus.location).unit();
    //         var lateralDirectional = directionalVector.cross(cameraStatus.up);
    //         var rotationVector = new Vector (directionalVector.x(), directionalVector.y(), directionalVector.z());

    //         // ** hardcoding adjustment for rotation when camera starts
    //         // ** out facing (0, 0, -1), otherwise, camera rotation will
    //         // ** start at 0 or Math.PI angle every time and cause camera to snap
    //         if (cameraStatus.XZAngle === 0 && !cameraStatus.beginRotating) {
    //             cameraStatus.XZAngle = 3 * Math.PI / 2;
    //             cameraStatus.beginRotatingHorizontal = true;
    //         }
    //         if (cameraStatus.YZAngle === 0 && !cameraStatus.beginRotating) {
    //             cameraStatus.YZAngle = Math.PI;
    //             cameraStatus.beginRotatingVertical = true;
    //         }
    //         // if it is a keydown event, then the actual keyCode is used
    //         // if it is a keypress event, then 32 is added to each key
    //         if (event.keyCode === 87) { // w
    //             // need to subtract the y from the Q vector because it's everything
    //             // else's y's that are being moved! not the camera's
    //             // can't multiply vectors!
    //             // vector.multiply(s) takes in a scalar
    //             cameraStatus.location = cameraStatus.location.add(directionalVector.multiply(translateSpeed));
    //             cameraStatus.lookAt = cameraStatus.lookAt.add(directionalVector);
    //             drawScene();
    //         }
    //         if (event.keyCode === 83) { // s
    //             cameraStatus.location = cameraStatus.location.subtract(directionalVector.multiply(translateSpeed));
    //             cameraStatus.lookAt = cameraStatus.lookAt.add(directionalVector);
    //             drawScene();
    //         }
    //         if (event.keyCode === 65) { // a
    //             cameraStatus.location = cameraStatus.location.subtract(lateralDirectional);
    //             cameraStatus.lookAt = cameraStatus.lookAt.subtract(lateralDirectional);
    //             drawScene();
    //         }
    //         if (event.keyCode === 68) { // d
    //             cameraStatus.location = cameraStatus.location.add(lateralDirectional);
    //             cameraStatus.lookAt = cameraStatus.lookAt.add(lateralDirectional);
    //             drawScene();
    //         }

    //         // when rotating Q, keep it's position radial
    //         // to the camera's location
    //         if (event.keyCode === 37 || event.keyCode === 39) {
    //             if (event.keyCode === 37) { // left
    //                 cameraStatus.XZAngle -= rotationSpeed;
    //             }
    //             if (event.keyCode === 39) { // right
    //                 cameraStatus.XZAngle += rotationSpeed;
    //             }
    //             // console.log("cameraStatus.XZAngle before: " + cameraStatus.XZAngle * (180/Math.PI));
    //             // console.log("cameraStatus.XZAngle before: " + cameraStatus.XZAngle * (180/Math.PI));
    //             rotationVector = rotationVector.add(new Vector(Math.cos(cameraStatus.XZAngle), 0, Math.sin(cameraStatus.XZAngle)));
    //             cameraStatus.lookAt = cameraStatus.location.add(rotationVector);
    //             drawScene();
    //         }
    //         // ** YZ rotation vector stays in YZ plane even when
    //         // ** not facing direction that is parallel with it
    //         if (event.keyCode === 38 || event.keyCode === 40) {
    //             if (event.keyCode === 38) { // up
    //                 cameraStatus.YZAngle -= rotationSpeed;
    //             }
    //             if (event.keyCode === 40) { // down
    //                 cameraStatus.YZAngle += rotationSpeed;
    //             }
    //             // console.log("YZAngle before: " + cameraStatus.YZAngle * (180/Math.PI));
    //             // console.log("cameraStatus.YZAngle after: " + cameraStatus.YZAngle * (180/Math.PI));
    //             var coordVector = new Vector(directionalVector.x(), directionalVector.y() + Math.sin(cameraStatus.YZAngle), directionalVector.z() + Math.cos(cameraStatus.YZAngle));
    //             cameraStatus.lookAt = cameraStatus.location.add(coordVector);
    //             drawScene();
    //         }

    //         $("#navigation").val("");
    //     });
    // }

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