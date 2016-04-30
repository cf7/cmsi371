

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
            this.color = data.color ? data.color : { r: 0, g: 0.75, b: 0.75, a: 1.0 };
            this.indexedVertices = data.indexedVertices ? data.indexedVertices : this.sphere(0.5, 10, 10);
            this.arrayType = data.arrayType ? data.arrayType : this.toRawLineArray(this.indexedVertices);
            this.mode = data.mode ? data.mode : this.gl.LINES;
            this.normals = this.toNormalArray(this.indexedVertices);
        } else {
            this.gl = gl || {};
            this.vertices = data ? data.vertices : [];
            this.indices = data ? data.indices : [];
            this.parent = {};
            this.children = [];
            this.translate = { tx: 0, ty: 0, tz: 0 };
            this.scale = { sx: 1, sy: 1, sz: 1 };
            this.rotate = { angle: 0, rx: 0, ry: 0, rz: 0 };
            this.color = { r: 0, g: 0.75, b: 0.75, a: 1.0 };
            this.indexedVertices = this.sphere(0.5, 10, 10);
            this.arrayType = this.toRawLineArray(this.indexedVertices);
            this.mode = this.gl.LINES;
            this.normals = this.toNormalArray(this.indexedVertices);
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
        console.log("inside");
        console.log(this.indexedVertices.indices.length);
        // when drawing lines, lines array comes out twice as long as normals
        // array, need to make normals array same size as lines array

        if (this.mode === this.gl.LINES) {
            console.log("inside inside");
            return {
                shape: this,
                color: this.color,
                specularColor: { r: 1.0, g: 1.0, b: 1.0 },
                shininess: 10,
                vertices: this.arrayType,
                mode: this.mode,
                translate: this.getTranslate(),
                scale: this.getScale(),
                rotate: this.getRotate(),
                normals: this.toVertexNormalArray(this.indexedVertices).concat(this.toVertexNormalArray(this.indexedVertices))
            }
        } else {
            return {
                shape: this,
                color: this.color,
                specularColor: { r: 1.0, g: 1.0, b: 1.0 },
                shininess: 10,
                vertices: this.arrayType,
                mode: this.mode,
                translate: this.getTranslate(),
                scale: this.getScale(),
                rotate: this.getRotate(),
                normals: this.toNormalArray(this.indexedVertices)
            }
        }
    };

    Shape.prototype.setNormals = function(type) {
        if (this.mode === this.gl.LINES) {
            
        } else {

        }
    };
    Shape.prototype.setColor = function(data) {
        this.color = { r: data.r, g: data.g, b: data.b };
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
        var midVertex = length / 2;
        indices.push([ 0, midVertex, (midVertex + 1) % length ]);

        for (var i = 1; i < vertices.length/2; i++) {
            indices.push([ midVertex, (midVertex + i + 1) % length, (midVertex + i) % length ]);
        }
        indices.push([ midVertex, (midVertex + 1) % length, (length - 1) % length ]);

        indices.push([ (midVertex + 2) % length, 1, (midVertex + 1) % length ]);
        indices.push([ 1, (midVertex + 2) % length, 2 ]);
        for (var i = 1; i < vertices.length/2; i++) {
            indices.push([ i, (midVertex + i) % length, (midVertex + i + 1) % length ]);
            indices.push([ i, (midVertex + i + 1) % length, (i + 1) % length ]);
        }
        indices.push([ (midVertex - 1), (length - 1) % length, (midVertex + 1) % length ]);
        indices.push([ (midVertex - 1), (midVertex + 1) % length, 1 ]);

        return {
            vertices: vertices,
            indices: indices
        }
    };


    Shape.prototype.sphere = function(radius, longit, lat) {  
        var vertices = [];
        var indices = [];

        var thetaDelta = 2 * Math.PI / lat;
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

        // spherical coordinates cause vertices to wrap back up through
        // the interior of the sphere multiple times, so the black triangles
        // are actually the backs of triangles being drawn facing the interior
        // the coordinates also pass over the sphere multiple times, so there
        // are multiple layers
        // need to find where coordinates begin to wrap back inside and reverse
        // the order that they are drawn
        for (var i = 0; i < vertices.length/2; i += longit) {
            for (var j = i; j < i + longit/2; j++) {
                indices.push([ j,  (j + longit) % vertices.length, (j + 1) % vertices.length ]);
            }
            for (var j = i + longit/2; j < i + longit; j++) {
                indices.push([ j, (j + 1) % vertices.length, (j + longit) % vertices.length ]);

            }
        }
        for (var i = vertices.length/2; i < vertices.length; i += longit) {
            for (var j = i; j < i + longit/2; j++) {
                indices.push([ j,  (j + longit) % vertices.length, (j + longit + 1) % vertices.length ]);
            }
            for (var j = i + longit/2; j < i + longit; j++) {
                indices.push([ j, (j + longit + 1) % vertices.length, (j + longit) % vertices.length ]);

            }
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

    Shape.prototype.toNormalArray = function (indexedVertices) {
        var result = [];

        // For each face...
        for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // We form vectors from the first and second then second and third vertices.
            var p0 = indexedVertices.vertices[indexedVertices.indices[i][0]];
            var p1 = indexedVertices.vertices[indexedVertices.indices[i][1]];
            var p2 = indexedVertices.vertices[indexedVertices.indices[i][2]];

            // Technically, the first value is not a vector, but v can stand for vertex
            // anyway, so...
            var v0 = new Vector(p0[0], p0[1], p0[2]);
            var v1 = new Vector(p1[0], p1[1], p1[2]).subtract(v0);
            var v2 = new Vector(p2[0], p2[1], p2[2]).subtract(v0);
            var normal = v1.cross(v2).unit();

            // We then use this same normal for every vertex in this face.
            for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    },

    /*
     * Another utility function for computing normals, this time just converting
     * every vertex into its unit vector version.  This works mainly for objects
     * that are centered around the origin.
     */
    Shape.prototype.toVertexNormalArray = function (indexedVertices) {
        var result = [];

        // For each face...
        for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // For each vertex in that face...
            for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                var p = indexedVertices.vertices[indexedVertices.indices[i][j]];
                var normal = new Vector(p[0], p[1], p[2]).unit();
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    }

    return Shape;
})();