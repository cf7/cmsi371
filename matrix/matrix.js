/*
 * This JavaScript file defines a Vector object and associated functions.
 * The object itself is returned as the result of a function, allowing us
 * to encapsulate its code and module variables.
 *
 * This module's approach is non-destructive: methods always return new
 * Vector objects, and never modify the operands.  This is a design choice.
 *
 * This module is designed for vectors of any number of dimensions.  The
 * implementations are generalized but not optimal for certain sizes of
 * vectors.  Specific Vector2D and Vector3D implementations can be much
 * more compact, while sacrificing generality.
 */

 

// ** screencasts 3/15, 3/17, 3/22

/**
    translate(x, y) -> (x + tx, y + ty)
    scale(x, y) -> (x * sx, y * sy)
    rotate(x, y) -> ( x * cos theta - y * sin theta,
                      x * sin theta + y * cos theta )
"translate by (5, 2) then scale by -2 then rotate by 10 degrees"
(x + 5, y + 2)
-2 * (x + 5, y + 2) = (-2x - 10, -2y - 4)
( (-2x - 10) * cos 10 - (-2y - 4) * sin 10,
  (-2x - 10) * sin 10 + (-2y - 4) * cos 10 )

matrices:

x + tx -> (1 * x) + (0 * y) + tx --> 1 0 tx
y + ty -> (0 * x) + (1 * y) + ty --> 0 1 ty

x * sx -> (sx * x) + (0 * y) + 0 --> sx 0 0
y * sy -> (0 * x) + (sy * y) + 0 --> 0 sy 0

x * cos theta - y * sin theta -> ((cos theta) * x) + ((-sin theta) * y) + 0
x * sin theta + y * cos theta -> ((sine theta) * x) + ((cos theta) * y) + 0

                --> (cos theta) (-sin theta) 0
                --> (sin theta) (cos theta)  0

All of these transformations are represented as sums, with each component mult.
by a coefficient plus a constant. They all have the same format!
Can take away x's and y's and have matrix. Each of these transforms are matrices.

To perform operations:
-represent coordinate arrays as vertical arrays
-matrix mult. vertical array with transform matrix
-in order to keep tx, ty in computation, add extra 1 to end of vertical array
when doing matrix mult. and add it as last row of transform matrix
(3/22 at 17:00 onward)
matrix mult. is associative   (A op B) op C = A op (B op C)
important because depending on the operation, can save time on computation
ex: mult. scale and translate matrices first, then mult. by coordinate array 1000 times
as oposed to mult. scale, translate, and coordinate matrices 1000 times
save 1000 computations
(3/22 at 30:00)
Translation:

                scale by -2            translate by (5, 2)    coordinates
                -2  0 0                  1 0 5                  x
                 0 -2 0                  0 1 2                  y
                 0  0 1                  0 0 1                  1
                    \                      /
                     \                    /
                          -2   0   -10             (-2x - 10)
                           0  -2    -4             (-2y - 4)
                           0   0     1

Now have one matrix that you can run multiple vertices across.

matrix mult. is most important function to implement,
Matrix Objects that are 2D arrays
write code that produces matrices
3D just means 4x4 matrix (last column is the transform constant)

matrices for different transforms are on pdfs on website
for orthogonal project matrix, need to take in six arguments (r, l, t, b, f, n)

(3/22 at 41:00)
eventually, when returning matrices to WebGL
-WebGL wants 16 element arrays
-column first, need a convenience function that will turn array into linear array with col first
-float32array


translation followed by a scale followed by a rotation is multiplied out as RST. 
i.e., R(S(T(vertex)))

*/


var Matrix = (function () {
    
    // Define the constructor.
    function Matrix (rows, cols, array) {
        this.elements = [];
        // this.elements = [].slice.call(arguments);
        if (!array && rows === cols) {
            var array = newArray(cols);
            var colIndex = 0;
            for (var index = 0; index < rows; index++) {
                if (colIndex < cols) {
                    array[colIndex] = 1;
                    this.elements.push(array);
                    colIndex++;
                    array = newArray(cols);
                }
            } 
        } else {
            this.elements = array;
        }
    }
    
    var newArray = function (cols) {
        var newArray = [];
        for (var index = 0; index < cols; index++) {
            newArray.push(0);
        }
        return newArray;
    }

    // A private method for checking dimensions,
    // throwing an exception when different.
    // var checkDimensions = function (m1, m2) {
    //     if (v1.dimensions() !== v2.dimensions()) {
    //         throw "Vectors have different dimensions";
    //     }
    // };

    Matrix.prototype.dimensions = function () {
        return { rows: this.elements.length, cols: this.elements[0].length };
    };

    Matrix.prototype.checkDimensions = function(matrix2) {
        if (this.dimensions().cols !== matrix2.dimensions().rows) {
            throw "Matrices do not meet specifications for multiplication";
        }
    };

    // Matrix.prototype.transpose = function (matrix) {

    //     return matrix;
    // };

    var addAndMult = function (array1, matrix2) {
        var sum = 0;
        var result = [];
        for (var i = 0; i < matrix2.elements[0].length; i++) {
            for (var j = 0; j < array1.length; j++) {
                sum += (array1[j] * matrix2.elements[j][i]);
            }
            result.push(sum);
            sum = 0;
        }
        return result;
    };

    Matrix.prototype.mult = function (matrix2) {
        // cols in matrix1 must be equal to rows in matrix2
        // checkDimensions to make sure they are NxM MxN format,
        // M's must match
        // otherwise return error
        // result is NxN (e.g. 4x5 mult. 5x4 result is 4x4)
        this.checkDimensions(matrix2);
        var result = [];
        for (var i = 0; i < this.elements.length; i++) {
            result.push(addAndMult(this.elements[i], matrix2));
        }
        return new Matrix(this.dimensions().rows, matrix2.dimensions().cols, result);
    };

    // ** Givens

    // ** code for 4x4 matrices for now
    // ** arbitrary dimensions are optional

    // ** the transform matrix should be the one multiplying the given matrix
    // ** so   TranslateMatrix x [ coordinates ] = result
    // ** as opposed to [ coordinates ] x TranslateMatrix = result
    
    // ** getRotationMatrix code is given in hello-webgl-again.js
    // ** format for returning matrix to webGL is in getRotationMatrix sample code

    //** orthographic projection given in matrices-webgl sample code

    // ** convenience functions that produce translation, scale, and rotation matrices
    // ** "need a translate matrix by this much that can be used to mult with this other matrix"

    
    Matrix.prototype.getTranslateMatrix = function(rows, cols, translateData) {
        var tx = translateData.tx;
        var ty = translateData.ty;
        var tz = translateData.tz;

        this.elements[0][this.dimensions().cols - 1] = tx || 0;
        this.elements[1][this.dimensions().cols - 1] = ty || 0;
        this.elements[2][this.dimensions().cols - 1] = tz || 0;
        this.elements[3][this.dimensions().cols - 1] = 1;

        return this.elements;
    };

    Matrix.prototype.getScaleMatrix = function(rows, cols, scaleData) {
        var sx = scaleData.sx;
        var sy = scaleData.sy;
        var sz = scaleData.sz;
        console.log("inside");
        this.elements[0][0] = sx || 1;
        this.elements[1][1] = sy || 1;
        this.elements[2][2] = sz || 1;
        this.elements[3][3] = 1;
        console.log("elements: " + this.elements);
        return this.elements;
    };

    Matrix.prototype.getRotationMatrix = function(rows, cols, rotationData) {
        var angle = rotationData.angle;
        var x = rotationData.rx;
        var y = rotationData.ry;
        var z = rotationData.rz;
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
            (x2 * oneMinusC) + c,    // row 0
            (xy * oneMinusC) + zs,   // row 1
            (xz * oneMinusC) - ys,
            0.0,

            (xy * oneMinusC) - zs,  // row 0
            (y2 * oneMinusC) + c,   // row 1
            (yz * oneMinusC) + xs,
            0.0,

            (xz * oneMinusC) + ys, // row 0
            (yz * oneMinusC) - xs, // row 1
            (z2 * oneMinusC) + c,
            0.0,

            0.0,                   // row 0
            0.0,                   // row 1
            0.0,
            1.0
        ];
    };

    Matrix.prototype.getOrthoMatrix = function (left, right, bottom, top, zNear, zFar) {
        var width = right - left;
        var height = top - bottom;
        var depth = zFar - zNear;

        return [
            2.0 / width,
            0.0,
            0.0,
            0.0,

            0.0,
            2.0 / height,
            0.0,
            0.0,

            0.0,
            0.0,
            -2.0 / depth,
            0.0,

            -(right + left) / width,
            -(top + bottom) / height,
            -(zFar + zNear) / depth,
            1.0
        ];
    };

    // ** frustum matrix from class
    Matrix.prototype.getFrustumMatrix = function(right, left, bottom, top, zNear, zFar) {
        var width = right - left;
        var height = top - bottom;
        var depth = zFar - zNear;

        return [
            2.0 * zNear / width,
            0.0,
            0.0,
            0.0,

            0.0,
            2.0 * zNear / height,
            0.0,
            0.0,

            (right + left) / width,
            (top + bottom) / height,
            -(zFar + zNear) / depth,
            -1,

            0,
            0,
            -2 * zNear * zFar / depth,
            0
        ];
    };

    
    return Matrix;

    /** 
        WebGL return format
        // GL expects its matrices in column major order.
        return [
            (x2 * oneMinusC) + c,   // col 1
            (xy * oneMinusC) + zs,
            (xz * oneMinusC) - ys,
            0.0,

            (xy * oneMinusC) - zs, // col 1
            (y2 * oneMinusC) + c,
            (yz * oneMinusC) + xs,
            0.0,

            (xz * oneMinusC) + ys, // col 1
            (yz * oneMinusC) - xs,
            (z2 * oneMinusC) + c,
            0.0,

            0.0,                  // col 1
            0.0,
            0.0,
            1.0
        ];
    */


    // vector.prototype.add = function (v) {
    //     var result = new Vector();

    //     checkDimensions(this, v);

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result.elements[i] = this.elements[i] + v.elements[i];
    //     }

    //     return result;
    // };

    // vector.prototype.subtract = function (v) {
    //     var result = new Vector();

    //     checkDimensions(this, v);

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result.elements[i] = this.elements[i] - v.elements[i];
    //     }

    //     return result;
    // };

    // vector.prototype.multiply = function (s) {
    //     var result = new Vector();

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result.elements[i] = this.elements[i] * s;
    //     }

    //     return result;
    // };

    // vector.prototype.divide = function (s) {
    //     var result = new Vector();

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result.elements[i] = this.elements[i] / s;
    //     }

    //     return result;
    // };

    // vector.prototype.dot = function (v) {
    //     var result = 0;

    //     checkDimensions(this, v);

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result += this.elements[i] * v.elements[i];
    //     }

    //     return result;
    // };

    // vector.prototype.cross = function (v) {
    //     if (this.dimensions() !== 3 || v.dimensions() !== 3) {
    //         throw "Cross product is for 3D vectors only.";
    //     }

    //     // With 3D vectors, we can just return the result directly.
    //     return new Vector(
    //         (this.y() * v.z()) - (this.z() * v.y()),
    //         (this.z() * v.x()) - (this.x() * v.z()),
    //         (this.x() * v.y()) - (this.y() * v.x())
    //     );
    // };

    // vector.prototype.magnitude = function () {
    //     return Math.sqrt(this.dot(this));
    // };

    // vector.prototype.unit = function () {
    //     // At this point, we can leverage our more "primitive" methods.
    //     return this.divide(this.magnitude());
    // };

    // vector.prototype.projection = function (v) {
    //     checkDimensions(this, v);

    //     // Plug and chug :)
    //     // The projection of u onto v is u dot the unit vector of v
    //     // times the unit vector of v.
    //     var unitv = v.unit();
    //     return unitv.multiply(this.dot(unitv));
    // };

    // return vector;
})();
