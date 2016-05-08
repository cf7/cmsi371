/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    var transformationMatrix = new Matrix(4, 4);
    var savedMatrices = [];

    var context = {
        savedMatrices: savedMatrices,
        currentTransform: transformationMatrix
    }

    var cameraStatus = {
        location: new Vector(0.5, 1, 1),
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
        return new Matrix(4, 4).getFrustumMatrix(left, right, bottom, top, zNear, zFar);
    }

    var getOrthoMatrix = function (left, right, bottom, top, zNear, zFar) {
        return new Matrix(4, 4).getOrthoMatrix(left, right, bottom, top, zNear, zFar);
    }

    var getCameraMatrix = function () {
        return new Matrix(4, 4).getCameraMatrix(cameraStatus.location, cameraStatus.lookAt, cameraStatus.up);
    }

    var cameraTransform = function () {
        context.currentTransform = getCameraMatrix().mult(context.currentTransform);
    }

    var translate = function (x, y, z) {
        var data = { tx: x, ty: y, tz: z };
        context.currentTransform = new Matrix(4, 4).getTranslateMatrix(4, 4, data).mult(context.currentTransform);
    }

    var scale = function (x, y, z) {
        var data = { sx: x, sy: y, sz: z };
        context.currentTransform = new Matrix(4, 4).getScaleMatrix(4, 4, data).mult(context.currentTransform);
    }

    // ** angle converted to radians in matrix.js
    var rotate = function (angle, x, y, z) {
        var data = { angle: angle, rx: x, ry: y, rz: z };
        if (!x && !y && !z) {
            context.currentTransform = new Matrix(4, 4).mult(context.currentTransform);
        } else {
            context.currentTransform = new Matrix(4, 4).getRotationMatrix(4, 4, data).mult(context.currentTransform);
        }
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

    shape4.getChildren()[0].setDrawingStyle("triangles");
    shape4.getChildren()[1].setDrawingStyle("triangles");
    shape4.getChildren()[0].getChildren()[0].setVertices(shape4.cube(0.25));

    save();
    translate(2, 0, -2);
    scale(1.5, 1.5, 1.5);
    shape4.setTransform(context.currentTransform);
    restore();

    save();
    translate(0.5, 0.5, 0.5);
    scale(0.75, 0.75, 0.75);
    shape4.getChildren()[0].setTransform(context.currentTransform);
    restore();
    // ** bug: this also scales down any translations that follow
    // ** this child will only be translated at 0.75 times that of the parent's speed
    // ** (didn't have time to fix)

    save();
    translate(0, 0, 1.5);
    scale(0.5, 0.5, 0.5);
    shape4.getChildren()[0].getChildren()[0].setTransform(context.currentTransform);
    restore();


    var shape5 = new Shape(gl);
    shape5.setColor({ r: 0.0, g: 0.75, b: 0.75 });
    shape5.setVertices(shape5.cylinder(0.25, 0.5, 20));
    shape5.setDrawingStyle("triangles");
    shape5.setSpecularColor({ r: 0.0, g: 0.0, b: 0.0 });

    save();
    scale(1.5, 1.5, 1.5);
    translate(-2, 0, 0);
    shape5.setTransform(context.currentTransform);
    restore();

    var shape6 = new Shape(gl);
    shape6.setColor({ r: 0.0, g: 0.75, b: 0.75 });
    shape6.setVertices(shape6.trapezium(0.5));
    shape6.setDrawingStyle("triangles");

    save();
    translate(-2, 0, 2);
    shape6.setTransform(context.currentTransform);
    restore();

    // Build the objects to display.
    var objectsToDraw = [];

    objectsToDraw.push(shape2);
    objectsToDraw.push(shape3);
    objectsToDraw.push(shape4);
    objectsToDraw.push(shape5);
    objectsToDraw.push(shape6);

    var prepObjects = function (objectsToDraw) {
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

            if (objectsToDraw[i].children.length > 0) {
                prepObjects(objectsToDraw[i].children);
            }

        }

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
    var cameraLocation = gl.getUniformLocation(shaderProgram, "cameraLocation");
    var modelView = gl.getUniformLocation(shaderProgram, "modelView");

    /*
     * Displays an individual object.
     */
    var drawObject = function (object) {
        // Set the varying colors.

        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

        gl.uniform1f(shininess, object.shininess);

        save();

        if (object.transform) {
            context.currentTransform = object.transform.mult(context.currentTransform);
        }

        gl.uniformMatrix4fv(modelView, gl.FALSE, context.currentTransform.glFormat());

        restore();

        // Set the varying normal vectors
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(object.mode, 0, object.vertices.length / 3);

        if (object.children.length > 0) {
            for (var i = 0; i < object.children.length; i++) {
                drawObject(object.children[i]);
            }
        }
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
        gl.uniformMatrix4fv(camera, gl.FALSE, context.currentTransform.glFormat());

        var locationVertex = cameraStatus.location;
        gl.uniform3fv(cameraLocation, [ locationVertex.x(), locationVertex.y(), locationVertex.z() ]);

        restore();

        if ($("#first-person-button")[0].checked) {
            gl.uniformMatrix4fv(globalProjectionMatrix, gl.FALSE, getFrustumMatrix(
                -0.1 * (canvas.width / canvas.height),
                0.1 * (canvas.width / canvas.height),
                -0.1,
                0.1,              
                0.1,
                100
            ).glFormat());
        } else if ($("#third-person-button")[0].checked) {
            // Ortho rotates camera around cameraFocus
            gl.uniformMatrix4fv(globalProjectionMatrix, gl.FALSE, getOrthoMatrix(
                -2 * (canvas.width / canvas.height),
                2 * (canvas.width / canvas.height),
                -2,
                2,              
                -10,
                100
            ).glFormat());
        }

        gl.uniform4fv(lightPosition, [0.0, 0.0, 2.0, 0.5]);
        gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
        gl.uniform3fv(lightAmbient, [0.25, 0.25, 0.25]);
        gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);

        // Display the objects.
        for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            drawObject(objectsToDraw[i]);
        }

        // All done.
        gl.flush();
    };

    /*
     * Performs rotation calculations.
     */
    var rotateScene = function (event) {
        rotationAroundX = xRotationStart - yDragStart + event.clientY;
        rotationAroundY = yRotationStart - xDragStart + event.clientX;
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
        }
    }).mouseup(function (event) {
        $(canvas).unbind("mousemove");
        focus();
    });


    var addShape = function (x, y, isBuildObject) {
        var shape = new Shape(gl);
        shape.setColor({ r: 0.0, g: 0.75, b: 0.75 });

        if ($("#sphere-button")[0].checked) {
            shape.setVertices(shape.sphere(0.75, 20, 20));
        }
        if ($("#cylinder-button")[0].checked) {
            shape.setVertices(shape.cylinder(0.25, 0.5, 20));
        }
        if ($("#trapezium-button")[0].checked) {
            shape.setVertices(shape.trapezium(0.5));
        }
        if ($("#cube-button")[0].checked) {
            shape.setVertices(shape.cube(0.5));
        }
        shape.setDrawingStyle("triangles");

        save();
        translate(x, y, 0);
        scale(0.5, 0.5, 0.5);
        shape.setTransform(context.currentTransform);
        restore();

        shape.buildObject = isBuildObject;

        objectsToDraw = objectsToDraw.concat(prepObjects([shape]));

        return shape;
    }

    var index = 0;
    var shapeIndex = 0;
    
    var findBuildObject = function () {
        var index = 0;
        for (var i = 0; i < objectsToDraw.length; i++) {
            if (objectsToDraw[i].buildObject) {
                index = i;
            }
        }
        return index;
    }

    var previousShape = function () {
        index = (index - 1 < 0) ? objectsToDraw.length - 1 : index - 1;
    }

    var nextShape = function () {
        index = (index + 1 >= objectsToDraw.length) ? 0 : index + 1;
    }

    var anotherShape = function () {
        var i = findBuildObject();
        objectsToDraw[i].buildObject = false;
        addShape(0, 0, true);
        index = findBuildObject();
        drawScene();
    }

    var focus = function () {
        $("#navigation").focus();
    }

    $("[name='camera-option']").on('click', function (event) {
        drawScene();
        focus();
    });

    $("[name='shape-option']").on('click', function (event) {
        if ($("#builder-mode-button")[0].checked) {
            var data = {};
            var i = findBuildObject();
            if (i !== -1) {
                data = objectsToDraw.splice(i, 1)[0];
            }
            anotherShape();
        }
        focus();

    });

    var speed = 0.25;
    var angleSpeed = 10;
    var currentScale = 1.0;
    var scaleVector = new Vector(1.0, 1.0, 1.0);

    $("#builder-mode-button").on('click', function (event) {
        if ($("#builder-mode-button")[0].checked) {
            anotherShape();
        } else {
            var data = {};
            var i = findBuildObject();
            if (i !== -1) {
                data = objectsToDraw.splice(i, 1)[0];
            }
        }
        focus();
    });


    /**
    
        Idea:
        
            1.) highlight the buildObject for user feedback

        Bugs:
        
        1.) scaling a shape also scales down its consecutive translations

        2.) rotating scaled objects distorts them

        3.) camara's YZ rotation remains in YZ plane even when camera isn't

        4.) diffuse and spectral lighting normals are slightly off for
        shapes that aren't spheres
        (I think my code is doing something to the normals. Shouldn't be 
        the order of indices cuz I had fixed those for the cylinder and circle
        - (see commits from 4/26). Didn't touch cube indices)
        Changing order of indices doesn't seem to affect anything
        (tried changing order of cube indices, no effect)

        5.) Shifting between first and third person during builder mode
        is changing the orientation of the camera

    */

    $("#navigation").keydown(function (event) {
        if ($("#builder-mode-button")[0].checked) {
            save();
            switch (event.keyCode) {
                case 87: // w
                    translate(0, 0, -speed);
                    break;
                case 83: // s
                    translate(0, 0, speed);
                    break;
                case 65: // a
                    translate(-speed, 0, 0);
                    break;
                case 68: // d
                    translate(speed, 0, 0);
                    break;
                case 81: // q
                    translate(0, speed, 0);
                    break;
                case 69: // e
                    translate(0, -speed, 0);
                    break;
                case 37: // left
                    if (event.shiftKey) {
                        rotate(-angleSpeed, 0, 1, 0);
                    } else {
                        rotate(angleSpeed, 0, 0, 1);
                    }
                    break;
                case 39: // right
                    if (event.shiftKey) {
                        rotate(angleSpeed, 0, 1, 0);
                    } else {
                        rotate(-angleSpeed, 0, 0, 1);
                    }
                    break;
                case 38: // up
                    rotate(-angleSpeed, 1, 0, 0);
                    break;
                case 40: // down
                    rotate(angleSpeed, 1, 0, 0);
                    break;
                case 74: // j
                    scale(1.0 - speed, 1.0 - speed, 1.0 - speed);
                    break;
                case 75: // k
                    scale(1.0 + speed, 1.0 + speed, 1.0 + speed);
                    break;
                case 88: // x
                    var spd = event.shiftKey ? -speed : speed;
                    scale(1.0 + spd, 1.0, 1.0);
                    break;
                case 89: // y
                    var spd = event.shiftKey ? -speed : speed;
                    scale(1.0, 1.0 + spd, 1.0);
                    break;
                case 90: // z
                    var spd = event.shiftKey ? -speed : speed;
                    scale(1.0, 1.0, 1.0 + spd);
                    break;
                case 13: // enter
                    anotherShape();
                    break;
                case 32:
                    event.shiftKey ? previousShape() : nextShape();
                    break;
                default:
                    break;
            }
            objectsToDraw[index].setTransform(context.currentTransform);
            restore();
            drawScene();
            $("#navigation").val("");
        } else {
            var translateSpeed = 0.3;
            var rotationSpeed = Math.PI/10;
            var directionalVector = cameraStatus.lookAt.subtract(cameraStatus.location).unit();
            var lateralDirectional = directionalVector.cross(cameraStatus.up);
            var rotationVector = new Vector (directionalVector.x(), directionalVector.y(), directionalVector.z());

            // ** hardcoding adjustment for rotation when camera starts
            // ** out facing (0, 0, -1), otherwise, camera rotation will
            // ** start at 0 or Math.PI angle every time and cause camera to snap
            // ** to the wrong place
            if (cameraStatus.XZAngle === 0 && !cameraStatus.beginRotating) {
                cameraStatus.XZAngle = 3 * Math.PI / 2;
                cameraStatus.beginRotatingHorizontal = true;
            }
            if (cameraStatus.YZAngle === 0 && !cameraStatus.beginRotating) {
                cameraStatus.YZAngle = Math.PI;
                cameraStatus.beginRotatingVertical = true;
            }

            switch (event.keyCode) {
                case 87:
                    cameraStatus.location = cameraStatus.location.add(directionalVector.multiply(translateSpeed));
                    cameraStatus.lookAt = cameraStatus.lookAt.add(directionalVector);
                    break;
                case 83:
                    cameraStatus.location = cameraStatus.location.subtract(directionalVector.multiply(translateSpeed));
                    cameraStatus.lookAt = cameraStatus.lookAt.add(directionalVector);
                    break;
                case 65:
                    cameraStatus.location = cameraStatus.location.subtract(lateralDirectional);
                    cameraStatus.lookAt = cameraStatus.lookAt.subtract(lateralDirectional);
                    break;
                case 68:
                    cameraStatus.location = cameraStatus.location.add(lateralDirectional);
                    cameraStatus.lookAt = cameraStatus.lookAt.add(lateralDirectional);
                    break;
                case 37:
                    cameraStatus.XZAngle -= rotationSpeed;
                    rotationVector = rotationVector.add(new Vector(Math.cos(cameraStatus.XZAngle), 0, Math.sin(cameraStatus.XZAngle)));
                    cameraStatus.lookAt = cameraStatus.location.add(rotationVector);
                    break;
                case 39:
                    cameraStatus.XZAngle += rotationSpeed;
                    rotationVector = rotationVector.add(new Vector(Math.cos(cameraStatus.XZAngle), 0, Math.sin(cameraStatus.XZAngle)));
                    cameraStatus.lookAt = cameraStatus.location.add(rotationVector);
                    break;
                case 38:
                    cameraStatus.YZAngle -= rotationSpeed;
                    var coordVector = new Vector(directionalVector.x(), directionalVector.y() + Math.sin(cameraStatus.YZAngle), directionalVector.z() + Math.cos(cameraStatus.YZAngle));
                    cameraStatus.lookAt = cameraStatus.location.add(coordVector);
                    break;
                case 40:
                    cameraStatus.YZAngle += rotationSpeed;
                    var coordVector = new Vector(directionalVector.x(), directionalVector.y() + Math.sin(cameraStatus.YZAngle), directionalVector.z() + Math.cos(cameraStatus.YZAngle));
                    cameraStatus.lookAt = cameraStatus.location.add(coordVector);
                    break;
                default:
                    break;
            }
            drawScene();

            $("#navigation").val("");
        }
    });

    // Draw the initial scene.
    drawScene();


}(document.getElementById("hello-webgl")));