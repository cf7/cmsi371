/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */

// ** code methods and convenience functions to generate these meshes
// ** programmatically generate vertices

// ** design the interaction between shape.js and hello-webgl-again.js
// ** similar to how we coded the interaction between
// ** keyframe-tweener.js and keyframe-tweening-demo.js

// ** make all shapes centered around the origin

// ** make basic shapes
// ** when finished with matrices, use translate, rotate, and scale
// ** to make composite shapes and groups

// ** for transforms, can use concat() to append extra dimension to vertex arrays

// ** will need to go to vertexShader in html code to apply transforms

var Shape = (function () { 

    function Shape (vertices, indices) {
        if (vertices && indices) {
            this.vertices = vertices;
            this.indices = indices;
        }
        this.children = [];
    }

    Shape.prototype.addChild = function (Shape) {
        this.children.push(Shape);
    }

    var addDimension = function (vertices) {
        for (var index = 0; index < vertices.length; index++) {
            vertices[index] = vertices[index].concat([1]);
        }
    }
    
    // y axis is the one that goes up and down

    Shape.prototype.sphere = function(radius, longit, lat) {
        var RADIUS = 0.25;
        var faceCount = 30;
        var BASE = 0.0;
        var vertices = [0, 0, 0];
        var indices = [];
        var thetaDelta = Math.PI / 12;
        var currentTheta = 0.0;
 
        vertices.push([ 0.25, -0.5, 0.75]);
        vertices.push([ 0.75, 0, 0.25]);

        // vertices.push([ RADIUS * Math.cos(currentTheta), -0.5, RADIUS * Math.sin(currentTheta)]);
        // currentTheta += thetaDelta;
        // vertices.push([ RADIUS * Math.cos(currentTheta), 0, RADIUS * Math.sin(currentTheta)]);

        indices.push([ 0, 1, 2]);
        // for (var i = 0; i < longit; i++) {
        //     vertices.push([
        //         RADIUS * Math.cos(currentTheta),
        //         RADIUS * Math.sin(currentTheta),
        //         BASE
        //     ]);
        //     currentTheta += thetaDelta;
        // }

        // for (var i = 0; i < longit; i++) {
        //     indices.push([0, (i + 1), (i + 2)]);
        // }
        // for (var i = 0; i < longit; i++) {
        //     for (var j = 0; j < lat; j++) {

        //     }
        // }
        // for (var index = 0; index < faceCount; index++) {
        //     vertices.push([
        //         RADIUS * Math.cos(currentTheta), // x
        //         CONE_BASE, // y
        //         RADIUS * Math.sin(currentTheta) // z
        //     ]);

        //     currentTheta += thetaDelta;
        // }

        // for (var index = 0; index < faceCount; index++) {
        //     indices.push([ 0, (index + 1) % faceCount, (index + 2) % faceCount ]);
        // }

        return {
            vertices: vertices,
            indices: indices
        };
    };

    Shape.prototype.square = function () {
        return {
            vertices: [
                [ 0, 1, 0 ],
                [ 0, 1, -0.5 ],
                [ 0, 0, -0.5 ],
                [ 0, 0, 0 ]
            ],

            indices: [
                [ 0, 1, 2, 3 ]
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


    // ** functions that traverse meshes to produce triangles or lines, because
    // ** webGL needs a certain format to draw the vertices
    // ** mesh must be converted to vertex array (of given type) that is needed by the mode

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