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


var Matrix = (function () {
    
    // Define the constructor.
    function Matrix (rows, cols, array) {
        this.elements = [];
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

    Matrix.prototype.dimensions = function () {
        return { rows: this.elements.length, cols: this.elements[0].length };
    };

    Matrix.prototype.checkDimensions = function(matrix2) {
        if (this.dimensions().cols !== matrix2.dimensions().rows) {
            throw "Matrices do not meet specifications for multiplication";
        }
    };

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
        this.checkDimensions(matrix2);
        var result = [];
        for (var i = 0; i < this.elements.length; i++) {
            result.push(addAndMult(this.elements[i], matrix2));
        }
        return new Matrix(this.dimensions().rows, matrix2.dimensions().cols, result);
    };
    
    Matrix.prototype.getTranslateMatrix = function(rows, cols, translateData) {
        var tx = translateData.tx;
        var ty = translateData.ty;
        var tz = translateData.tz;

        this.elements[0][this.dimensions().cols - 1] = tx || 0;
        this.elements[1][this.dimensions().cols - 1] = ty || 0;
        this.elements[2][this.dimensions().cols - 1] = tz || 0;
        this.elements[3][this.dimensions().cols - 1] = 1;

        return this;
    };

    Matrix.prototype.getScaleMatrix = function(rows, cols, scaleData) {
        var sx = scaleData.sx;
        var sy = scaleData.sy;
        var sz = scaleData.sz;

        this.elements[0][0] = sx || 1;
        this.elements[1][1] = sy || 1;
        this.elements[2][2] = sz || 1;
        this.elements[3][3] = 1;

        return this;
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

        this.elements[0][0] = (x2 * oneMinusC) + c;   // row 0
        this.elements[1][0] = (xy * oneMinusC) + zs;  // row 1
        this.elements[2][0] = (xz * oneMinusC) - ys;
        this.elements[3][0] = 0.0;

        this.elements[0][1] = (xy * oneMinusC) - zs;  // row 0
        this.elements[1][1] = (y2 * oneMinusC) + c;   // row 1
        this.elements[2][1] = (yz * oneMinusC) + xs;
        this.elements[3][1] = 0.0;

        this.elements[0][2] = (xz * oneMinusC) + ys; // row 0
        this.elements[1][2] = (yz * oneMinusC) - xs; // row 1
        this.elements[2][2] = (z2 * oneMinusC) + c;
        this.elements[3][2] = 0.0;

        this.elements[0][3] = 0.0;                   // row 0
        this.elements[1][3] = 0.0;                   // row 1
        this.elements[2][3] = 0.0;
        this.elements[3][3] = 1.0;
        
        // GL expects its matrices in column major order.
        return this;
    };

    Matrix.prototype.getOrthoMatrix = function (left, right, bottom, top, zNear, zFar) {
        var width = right - left;
        var height = top - bottom;
        var depth = zFar - zNear;

            this.elements[0][0] = 2.0 / width;
            this.elements[1][0] = 0.0;
            this.elements[2][0] = 0.0;
            this.elements[3][0] = 0.0;

            this.elements[0][1] = 0.0;
            this.elements[1][1] = 2.0 / height;
            this.elements[2][1] = 0.0;
            this.elements[3][1] = 0.0;

            this.elements[0][2] = 0.0;
            this.elements[1][2] = 0.0;
            this.elements[2][2] = -2.0 / depth;
            this.elements[3][2] = 0.0;

            this.elements[0][3] = -(right + left) / width;
            this.elements[1][3] = -(top + bottom) / height;
            this.elements[2][3] = -(zFar + zNear) / depth;
            this.elements[3][3] = 1.0;

        return this;
    };

    // ** frustum matrix from class
    Matrix.prototype.getFrustumMatrix = function(left, right, bottom, top, zNear, zFar) {
        var width = right - left;
        var height = top - bottom;
        var depth = zFar - zNear;

        this.elements[0][0] = (2.0 * zNear) / width;
        this.elements[1][0] = 0.0;
        this.elements[2][0] = 0.0;
        this.elements[3][0] = 0.0;

        this.elements[0][1] = 0.0;
        this.elements[1][1] = (2.0 * zNear) / height;
        this.elements[2][1] = 0.0;
        this.elements[3][1] = 0.0;

        this.elements[0][2] = (right + left) / width;
        this.elements[1][2] = (top + bottom) / height;
        this.elements[2][2] = -(zFar + zNear) / depth;
        this.elements[3][2] = -1.0;

        this.elements[0][3] = 0.0;
        this.elements[1][3] = 0.0;
        this.elements[2][3] = (-2.0 * zNear * zFar) / depth;
        this.elements[3][3] = 0.0;

        return this;
    };


    Matrix.prototype.getCameraMatrix = function(location, lookAt, upward) {
        var p = location;
        var q = lookAt;

        var z = p.subtract(q).unit();

        var up = upward;
        var projUp = up.projection(z);
        var y = up.subtract(projUp).unit();

        var x = y.cross(z);
        var Px = p.dot(x);
        var Py = p.dot(y);
        var Pz = p.dot(z);
  
        this.elements[0][0] = x.x();
        this.elements[1][0] = y.x();
        this.elements[2][0] = z.x();
        this.elements[3][0] = 0.0;

        this.elements[0][1] = x.y();
        this.elements[1][1] = y.y();
        this.elements[2][1] = z.y();
        this.elements[3][1] = 0.0;

        this.elements[0][2] = x.z();
        this.elements[1][2] = y.z();
        this.elements[2][2] = z.z();
        this.elements[3][2] = 0.0;

        this.elements[0][3] = -Px;
        this.elements[1][3] = -Py;
        this.elements[2][3] = -Pz;
        this.elements[3][3] = 1.0;

        return this;     
    };

    Matrix.prototype.glFormat = function() {
        return new Float32Array([
            this.elements[0][0],
            this.elements[1][0],
            this.elements[2][0],
            this.elements[3][0],

            this.elements[0][1],
            this.elements[1][1],
            this.elements[2][1],
            this.elements[3][1],

            this.elements[0][2],
            this.elements[1][2],
            this.elements[2][2],
            this.elements[3][2],

            this.elements[0][3],
            this.elements[1][3],
            this.elements[2][3],
            this.elements[3][3]
        ]);
    };
    return Matrix;

})();
