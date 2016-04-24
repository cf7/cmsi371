

var Shape = (function () { 

    function Shape (gl, data) {
        if (data) {
            this.gl = gl || {};
            this.vertices = data.vertices ? data.vertices : [];
            this.indices = data.indices ? data.indices : [];
            this.parent = {};
            this.children = [];
            this.translate = data.translate ? data.translate : { tx: 0, ty: 0, tz: 0 };
            this.scale = data.scale ? data.scale : { sx: 1, sy: 1, sz: 1 };
            this.rotate = data.rotate ? data.rotate : { angle: 0, rx: 0, ry: 0, rz: 0 };
            this.color = data.color ? data.color : { r: 0, g: 0.75, b: 0.75 };
            this.indexedVertices = data.indexedVertices ? data.indexedVertices : this.sphere(0.5, 10, 10);
            this.arrayType = data.arrayType ? data.arrayType : this.toRawLineArray(this.indexedVertices);
            this.mode = data.mode ? data.mode : this.gl.LINES;
        } else {
            this.gl = gl || {};
            this.vertices = data ? data.vertices : [];
            this.indices = data ? data.indices : [];
            this.parent = {};
            this.children = [];
            this.translate = { tx: 0, ty: 0, tz: 0 };
            this.scale = { sx: 1, sy: 1, sz: 1 };
            this.rotate = { angle: 0, rx: 0, ry: 0, rz: 0 };
            this.color = { r: 0, g: 0.75, b: 0.75 };
            this.indexedVertices = this.sphere(0.5, 10, 10);
            this.arrayType = this.toRawLineArray(this.indexedVertices);
            this.mode = this.gl.LINES;
        }
    }

    Shape.prototype.setVertices = function(data) {
        this.indexedVertices = { vertices: data.vertices, indices: data.indices };
        this.setDrawingStyle("lines");
    };

    Shape.prototype.setDrawingStyle = function(name) {
        if (name === "lines") {
            this.arrayType = this.toRawLineArray(this.indexedVertices);
            this.mode = this.gl.LINES;
        } else if (name === "triangles") {
            this.arrayType = this.toRawTriangleArray(this.indexedVertices);
            this.mode = this.gl.TRIANGLES;
        } else {
           this.arrayType = this.toRawLineArray(this.indexedVertices);
           this.mode = this.gl.LINES;
        }
    };

    Shape.prototype.getDrawingStyle = function() {
        return { arrayType: this.arrayType, mode: this.mode };
    };

    Shape.prototype.getData = function() {
        return {
            shape: this,
            color: this.color,
            vertices: this.arrayType,
            mode: this.mode,
            translate: this.getTranslate(),
            scale: this.getScale(),
            rotate: this.getRotate(),
            normals: this.getNormals()
        }
    };

    Shape.prototype.setColor = function(data) {
        this.color = { r: data.r, g: data.g, b: data.b };
    };

    Shape.prototype.getNormals = function() {
        // use cross product to compute normals
        // this is why indices needed to be assigned counter-clockwise
        // because order matters for cross-product
        // will determine whether the resulting normal is inward or outward

        // array of normals, lightposition, and lightcolor all travel into shader
        // use the arrays of indices to compute normals, because
        // the vertices have already been sorted within the indices

        // should have one normal per vertex

        // use the indices to retrieve the vector data
        // convert to Vector objects
        // do computations to find normal vectors
        // convert back to data
        // store in Shape's data

        var vertices = this.indexedVertices.vertices;
        var indices = this.indexedVertices.indices;
        var points = [];

        // grab all of the vertices in each triangle group
        for (var i = 0; i < indices.length; i++) {
            points.push([ vertices[indices[i][0]], vertices[indices[i][1]], vertices[indices[i][2]] ]);
        }
        console.log(points);

        // each element in points is now a group of 3 points that make up a triangle on the Shape mesh
        /**
                0
               / \
              /   \
             1 --- 2

            compute a normal for vertex0 and vertex1 and vertex2
            means 3 cross product computations

        */

        var computeNormal = function (point0, point1, point2) {
            var vector1 = new Vector(point1[0] - point0[0],
                                    point1[1] - point0[1],
                                    point1[2] - point0[2]);
            var vector2 = new Vector(point2[0] - point0[0],
                                    point2[1] - point0[1],
                                    point2[2] - point0[2]);
            return vector1.cross(vector2);
        }

        var normalsData = [];

        // // comput the normals
        for (var i = 0; i < points.length; i++) {
            var vector = computeNormal(points[i][0], points[i][1], points[i][2]);
            // JD: Note, this is just a quick fix. Longer discussion in GitHub comment.
            normalsData.push(
                vector.x(), vector.y(), vector.z(),
                vector.x(), vector.y(), vector.z(),
                vector.x(), vector.y(), vector.z()
            );
        }

        // for (var i = 0; i < vertices.length; i++) {
        //     normalsData.push([ 0, 1, 0 ]);
        // }
        console.log(normalsData);

       return normalsData;

    };

    Shape.prototype.translateShape = function(x, y, z) {
        var newX = this.parent.translate ? this.parent.translate.tx + x : x;
        var newY = this.parent.translate ? this.parent.translate.ty + y : y;
        var newZ = this.parent.translate ? this.parent.translate.tz + z : z;
        this.translate = { tx: newX, ty: newY, tz: newZ };
    };

    Shape.prototype.getTranslate = function() {
        return this.translate;
    };

    Shape.prototype.scaleShape = function(x, y, z) {
        var newX = this.parent.scale ? this.parent.scale.sx * x : x;
        var newY = this.parent.scale ? this.parent.scale.sy * y : y;
        var newZ = this.parent.scale ? this.parent.scale.sz * z : z;
        this.scale = { sx: newX, sy: newY, sz: newZ };
    };

    Shape.prototype.getScale = function() {
        return this.scale;
    };

    Shape.prototype.rotateShape = function(angle, x, y, z) {
        var newAngle = this.parent.rotate ? this.parent.rotate.angle + angle : angle;
        this.rotate = { angle: newAngle, rx: x, ry: y, rz: z };
    };

    Shape.prototype.getRotate = function() {
        return this.rotate;
    };

    Shape.prototype.setParent = function(Shape) {
        this.parent = Shape;
    };

    Shape.prototype.addChild = function (Shape) {
        Shape.setParent(this);
        this.children.push(Shape);
    }

    Shape.prototype.getChildren = function() {
        return this.children;
    };    
    
    Shape.prototype.circle = function(radius, height, points) {
        var vertices = [];
        var indices = [];
        var RADIUS = radius;

        vertices.push([ 0, height, 0 ]);

        var currentTheta = 0.0;
        var thetaDelta = 2 * Math.PI / points;

        for (var i = 0; i < points; i++) {
            vertices.push([
                RADIUS * Math.cos(currentTheta),
                height,
                RADIUS * Math.sin(currentTheta)
            ]);
            currentTheta += thetaDelta;
        }

        for (var i = 0; i < vertices.length; i++) {
            indices.push([ 0, (i + 1) % vertices.length, (i + 2) % vertices.length ]);
        }
        indices.push([ 0, (vertices.length - 1), 1 ]);

        return {
            vertices: vertices,
            indices: indices
        }

    };

    Shape.prototype.trapezium = function(edge) {
        var vertices = [];
        var indices = [];
        vertices = vertices.concat(this.cube(edge).vertices);
        indices = indices.concat(this.cube(edge).indices);

        vertices[0][0] -= 0.25;
        vertices[0][2] -= 0.25;
        vertices[1][0] -= 0.25;
        vertices[1][2] += 0.25;
        vertices[2][0] += 0.25;
        vertices[2][2] += 0.25;
        vertices[3][0] += 0.25;
        vertices[3][2] -= 0.25;

        return {
            vertices: vertices,
            indices: indices
        };
    };

    Shape.prototype.cylinder = function(radius, height, points) {
        var vertices = [];
        var indices = [];
        var RADIUS = radius;
        vertices = vertices.concat(this.circle(radius, 0.0, points).vertices);
        indices = indices.concat(this.circle(radius, 0.0, points).indices);

        vertices = vertices.concat(this.circle(radius, height, points).vertices);
        var length = vertices.length;

        indices.push([ 0, length/2, (length/2 + 1) % length ]);

        for (var i = 1; i < vertices.length/2; i++) {
            indices.push([ length/2, (length/2 + i) % length, (length/2 + i + 1) % length ]);
        }
        indices.push([ length/2, (length - 1) % length, (length/2 + 1) % length ]);

        indices.push([ 1, (length/2 + 1) % length, (length/2 + 2) % length ]);
        indices.push([ 1, 2, (length/2 + 2) % length ]);
        for (var i = 1; i < vertices.length/2; i++) {
            indices.push([ i, (length/2 + i) % length, (length/2 + i + 1) % length ]);
            indices.push([ i, (i + 1) % length, (length/2 + i + 1) % length ]);
        }
        indices.push([ (length/2 - 1), (length - 1) % length, (length/2 + 1) % length ]);
        indices.push([ (length/2 - 1), (length/2 + 1) % length, 1 ]);

        return {
            vertices: vertices,
            indices: indices
        }
    };


    Shape.prototype.sphere = function(radius, longit, lat) {  
        var vertices = [];
        var indices = [];

        var thetaDelta = 2 * Math.PI / longit;
        var phiDelta = 2 * Math.PI / lat;
        var currentTheta = 0.0;
        var currentPhi = 0.0;

        var x = 0;
        var y = 0;
        var z = 0;

        // spherical coordinate system!
        // for other patterns, swap the sines and cosines, 
        // changing the indices, or dividing the angles
        for (var i = 0; i < longit; i++) {
            x = radius * Math.cos(currentPhi);
            z = radius * Math.sin(currentPhi);
            for (var j = 0; j < lat; j++) {
                vertices.push([
                    x * Math.sin(currentTheta),
                    radius * Math.cos(currentTheta),
                    z * Math.sin(currentTheta)
                ]);
                currentTheta += thetaDelta;
            }
            currentPhi += phiDelta;
        }

        for (var i = 0; i < vertices.length; i++) {
            indices.push([ i, (i + 1) % vertices.length, (i + longit) % vertices.length ]);
            indices.push([ i, (i + longit - 1) % vertices.length, (i + longit) % vertices.length ]);
        }

        return {
            vertices: vertices,
            indices: indices
        };
    };

    Shape.prototype.square = function (x, y, z, width, height) {
        return {
            vertices: [
                [ 0, y, 0 ],
                [ width, y, 0 ],
                [ width, y, -height ],
                [ 0, y, -height ]
            ],

            indices: [
                [ 0, 1, 2, 3 ]
            ]
        };
    };

    Shape.prototype.cube = function(edge) {
        return {
            vertices: [
                [ edge, edge, edge ],
                [ edge, edge, -edge ],
                [ -edge, edge, -edge ],
                [ -edge, edge, edge ],
                [ edge, -edge, edge ],
                [ edge, -edge, -edge ],
                [ -edge, -edge, -edge ],
                [ -edge, -edge, edge ]
            ],

            indices: [
                [ 0, 1, 3 ],
                [ 2, 3, 1 ],
                [ 0, 3, 4 ],
                [ 7, 4, 3 ],
                [ 0, 4, 1 ],
                [ 5, 1, 4 ],
                [ 1, 5, 6 ],
                [ 2, 1, 6 ],
                [ 2, 7, 3 ],
                [ 6, 7, 2 ],
                [ 4, 7, 6 ],
                [ 5, 4, 6 ]
            ]
        };
    };
    
    // ** code from class
    Shape.prototype.cone = function (faceCount) {
        var RADIUS = 0.5;
        var CONE_BASE = -0.5;
        var vertices = [
            [ 0, 0.5, 0 ],
        ];
        var indices = [];
        var thetaDelta = 2 * Math.PI / faceCount;
        var currentTheta = 0.0;
        for (var index = 0; index < faceCount; index++) {
            vertices.push([
                RADIUS * Math.cos(currentTheta), // x
                CONE_BASE, // y
                RADIUS * Math.sin(currentTheta) // z
            ]);

            currentTheta += thetaDelta;
        }

        for (var index = 0; index < faceCount; index++) {
            indices.push([ 0, (index + 1) % faceCount, (index + 2) % faceCount ]);
        }

        return {
            vertices: vertices,
            indices: indices
        };
    };

    /*
     * Returns the vertices for a small icosahedron.
     */
    Shape.prototype.icosahedron = function () {
        // These variables are actually "constants" for icosahedron coordinates.
        var X = 0.525731112119133606;
        var Z = 0.850650808352039932;

        return {
            vertices: [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],

            indices: [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ]
            ]
        };
    };

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as triangles.
     */
    Shape.prototype.toRawTriangleArray = function (indexedVertices) {
        var result = [];

        for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ]
                );
            }
        }

        return result;
    };

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as line segments.
     */
    Shape.prototype.toRawLineArray = function (indexedVertices) {
        var result = [];

        for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ],

                    indexedVertices.vertices[
                        indexedVertices.indices[i][(j + 1) % maxj]
                    ]
                );
            }
        }

        return result;
    };

    return Shape;
})();