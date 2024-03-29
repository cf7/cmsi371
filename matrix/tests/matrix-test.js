
/*
 * Unit tests for our vector object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        
        var idMat = new Matrix(4, 4);

        equal(idMat.dimensions().rows, 4, "Rows");
        equal(idMat.dimensions().cols, 4, "Columns");
        equal(idMat.elements[0][0], 1, "Row 0 Col 0");
        equal(idMat.elements[0][1], 0, "Row 0 Col 1");
        equal(idMat.elements[0][2], 0, "Row 0 Col 2");
        equal(idMat.elements[0][3], 0, "Row 0 Col 3");
        equal(idMat.elements[1][0], 0, "Row 1 Col 0");
        equal(idMat.elements[1][1], 1, "Row 1 Col 1");
        equal(idMat.elements[1][2], 0, "Row 1 Col 2");
        equal(idMat.elements[1][3], 0, "Row 1 Col 3");
        equal(idMat.elements[2][0], 0, "Row 2 Col 0");
        equal(idMat.elements[2][1], 0, "Row 2 Col 1");
        equal(idMat.elements[2][2], 1, "Row 2 Col 2");
        equal(idMat.elements[2][3], 0, "Row 2 Col 3");
        equal(idMat.elements[3][0], 0, "Row 3 Col 0");
        equal(idMat.elements[3][1], 0, "Row 3 Col 1");
        equal(idMat.elements[3][2], 0, "Row 3 Col 2");
        equal(idMat.elements[3][3], 1, "Row 3 Col 3");

        idMat = new Matrix(2, 2);
        equal(idMat.elements[0][0], 1, "Row 0 Col 0");
        equal(idMat.elements[0][1], 0, "Row 0 Col 1");
        equal(idMat.elements[1][0], 0, "Row 1 Col 0");
        equal(idMat.elements[1][1], 1, "Row 1 Col 1");

        var array = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];
        var matrix = new Matrix(3, 3, array);

        // fillMatrix() function

        equal(matrix.dimensions().rows, 3, "Rows");
        equal(matrix.dimensions().cols, 3, "Columns");
        equal(matrix.elements[0][0], 1, "Row 0 Col 0");
        equal(matrix.elements[0][1], 2, "Row 0 Col 1");
        equal(matrix.elements[0][2], 3, "Row 0 Col 2");
        equal(matrix.elements[1][0], 4, "Row 1 Col 0");
        equal(matrix.elements[1][1], 5, "Row 1 Col 1");
        equal(matrix.elements[1][2], 6, "Row 1 Col 2");
        equal(matrix.elements[2][0], 7, "Row 2 Col 0");
        equal(matrix.elements[2][1], 8, "Row 2 Col 1");
        equal(matrix.elements[2][2], 9, "Row 2 Col 2");

        array = [
            [ 1, 2, 3, 4 ],
            [ 5, 6, 7, 8 ],
            [ 9, 10, 11, 12 ],
            [ 13, 14, 15, 16 ]
        ];
        matrix = new Matrix(4, 4, array);

        equal(matrix.dimensions().rows, 4, "Rows");
        equal(matrix.dimensions().cols, 4, "Columns");
        equal(matrix.elements[0][0], 1, "Row 0 Col 0");
        equal(matrix.elements[0][1], 2, "Row 0 Col 1");
        equal(matrix.elements[0][2], 3, "Row 0 Col 2");
        equal(matrix.elements[0][3], 4, "Row 0 Col 3");
        equal(matrix.elements[1][0], 5, "Row 1 Col 0");
        equal(matrix.elements[1][1], 6, "Row 1 Col 1");
        equal(matrix.elements[1][2], 7, "Row 1 Col 2");
        equal(matrix.elements[1][3], 8, "Row 1 Col 3");
        equal(matrix.elements[2][0], 9, "Row 2 Col 0");
        equal(matrix.elements[2][1], 10, "Row 2 Col 1");
        equal(matrix.elements[2][2], 11, "Row 2 Col 2");
        equal(matrix.elements[2][3], 12, "Row 2 Col 3");
        equal(matrix.elements[3][0], 13, "Row 3 Col 0");
        equal(matrix.elements[3][1], 14, "Row 3 Col 1");
        equal(matrix.elements[3][2], 15, "Row 3 Col 2");
        equal(matrix.elements[3][3], 16, "Row 3 Col 3");
    });

    test("Matrix Multiplication", function () {
        var array = [
            [ 1, 2, 3, 4, 5 ],
            [ 6, 7, 8, 9, 10 ],
            [ 11, 12, 13, 14, 15 ],
            [ 16, 17, 18, 19, 20 ]
        ];
        var array2 = [
            [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
            [ 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ],
            [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ],
            [ 31, 32, 33, 34, 35, 36, 37, 38, 39, 40 ]
        ];
        var matrix1 = new Matrix(4, 5, array);
        var matrix2 = new Matrix(10, 4, array2);

        throws(
            function () {
                return matrix1.checkDimensions(matrix2);
            },
            "checkDimensions: Throw error if matrices do not meet specifications"
        );

        throws(
            function () {
                return matrix1.mult(matrix2);
            },
            "mult: Throw error if matrices do not meet specifications"
        );

        array = [
            [ 1, 2, 3, 4, 5 ],
            [ 6, 7, 8, 9, 10 ],
            [ 11, 12, 13, 14, 15 ],
            [ 16, 17, 18, 19, 20 ]
        ];

        array2 = [
            [ 20, 19, 18, 17 ],
            [ 16, 15, 14, 13 ],
            [ 12, 11, 10, 9 ],
            [ 8, 7, 6, 5 ],
            [ 4, 3, 2, 1 ]
        ];

        matrix1 = new Matrix( 4, 5, array);
        matrix2 = new Matrix( 5, 4, array2);
        var matrixResult = matrix1.mult(matrix2);

        equal(matrixResult.elements[0][0], 140, "Row 0 Col 0");
        equal(matrixResult.elements[0][1], 125, "Row 0 Col 1");
        equal(matrixResult.elements[0][2], 110, "Row 0 Col 2");
        equal(matrixResult.elements[0][3], 95, "Row 0 Col 3");
        equal(matrixResult.elements[1][0], 440, "Row 1 Col 0");
        equal(matrixResult.elements[1][1], 400, "Row 1 Col 1");
        equal(matrixResult.elements[1][2], 360, "Row 1 Col 2");
        equal(matrixResult.elements[1][3], 320, "Row 1 Col 3");
        equal(matrixResult.elements[2][0], 740, "Row 2 Col 0");
        equal(matrixResult.elements[2][1], 675, "Row 2 Col 1");
        equal(matrixResult.elements[2][2], 610, "Row 2 Col 2");
        equal(matrixResult.elements[2][3], 545, "Row 2 Col 3");
        equal(matrixResult.elements[3][0], 1040, "Row 3 Col 0");
        equal(matrixResult.elements[3][1], 950, "Row 3 Col 1");
        equal(matrixResult.elements[3][2], 860, "Row 3 Col 2");
        equal(matrixResult.elements[3][3], 770, "Row 3 Col 3");

        array = [
            [ 1, 1, 1 ],
            [ 2, 2, 2 ]
        ];
        array2 = [
            [ 0, 1 ],
            [ 1, 0 ],
            [ 1, 1 ]
        ];

        matrix1 = new Matrix(2, 3, array);
        matrix2 = new Matrix(3, 2, array2);
        matrixResult = matrix1.mult(matrix2);

        equal(matrixResult.elements[0][0], 2, "Row 0 Col 0");
        equal(matrixResult.elements[0][1], 2, "Row 0 Col 1");
        equal(matrixResult.elements[1][0], 4, "Row 1 Col 0");
        equal(matrixResult.elements[1][1], 4, "Row 1 Col 1");
        
    });

    test("3D Translation Matrices", function () {
       
        var data = { tx: 5, ty: 2, tz: 4 };
        var translateMatrix = new Matrix(4, 4).getTranslateMatrix(4, 4, data);
        console.log(translateMatrix);

        equal(translateMatrix.elements[0][0], 1, "Row 0 Col 0");
        equal(translateMatrix.elements[0][1], 0, "Row 0 Col 1");
        equal(translateMatrix.elements[0][2], 0, "Row 0 Col 2");
        equal(translateMatrix.elements[0][3], data.tx, "Row 0 Col 3");
        equal(translateMatrix.elements[1][0], 0, "Row 1 Col 0");
        equal(translateMatrix.elements[1][1], 1, "Row 1 Col 1");
        equal(translateMatrix.elements[1][2], 0, "Row 1 Col 2");
        equal(translateMatrix.elements[1][3], data.ty, "Row 1 Col 3");
        equal(translateMatrix.elements[2][0], 0, "Row 2 Col 0");
        equal(translateMatrix.elements[2][1], 0, "Row 2 Col 1");
        equal(translateMatrix.elements[2][2], 1, "Row 2 Col 2");
        equal(translateMatrix.elements[2][3], data.tz, "Row 2 Col 3");
        equal(translateMatrix.elements[3][0], 0, "Row 3 Col 0");
        equal(translateMatrix.elements[3][1], 0, "Row 3 Col 1");
        equal(translateMatrix.elements[3][2], 0, "Row 3 Col 2");
        equal(translateMatrix.elements[3][3], 1, "Row 3 Col 3");

    });

    
    test("3D Scale Matrices", function () {
       
        var data = { sx: 2, sy: 2, sz: 2 };
        var scaleMatrix = new Matrix(4, 4).getScaleMatrix(4, 4, data);
        console.log(scaleMatrix);
        equal(scaleMatrix.elements[0][0], data.sx, "Row 0 Col 0");
        equal(scaleMatrix.elements[0][1], 0, "Row 0 Col 1");
        equal(scaleMatrix.elements[0][2], 0, "Row 0 Col 2");
        equal(scaleMatrix.elements[0][3], 0, "Row 0 Col 3");
        // equal(scaleMatrix.elements[0][4], 4, "Row 0 Col 3");
        equal(scaleMatrix.elements[1][0], 0, "Row 1 Col 0");
        equal(scaleMatrix.elements[1][1], data.sy, "Row 1 Col 1");
        equal(scaleMatrix.elements[1][2], 0, "Row 1 Col 2");
        equal(scaleMatrix.elements[1][3], 0, "Row 1 Col 3");
        // equal(scaleMatrix.elements[1][4], 5, "Row 1 Col 0");
        equal(scaleMatrix.elements[2][0], 0, "Row 2 Col 0");
        equal(scaleMatrix.elements[2][1], 0, "Row 2 Col 1");
        equal(scaleMatrix.elements[2][2], data.sz, "Row 2 Col 2");
        equal(scaleMatrix.elements[2][3], 0, "Row 2 Col 3");
        // equal(scaleMatrix.elements[2][4], 5, "Row 1 Col 0");
        equal(scaleMatrix.elements[3][0], 0, "Row 3 Col 0");
        equal(scaleMatrix.elements[3][1], 0, "Row 3 Col 1");
        equal(scaleMatrix.elements[3][2], 0, "Row 3 Col 2");
        equal(scaleMatrix.elements[3][3], 1, "Row 3 Col 3");
        // equal(scaleMatrix.elements[3][4], 5, "Row 1 Col 0");
        // equal(scaleMatrix.elements[4][0], 13, "Row 3 Col 0");
        // equal(scaleMatrix.elements[4][1], 14, "Row 3 Col 1");
        // equal(scaleMatrix.elements[4][2], 15, "Row 3 Col 2");
        // equal(scaleMatrix.elements[4][3], 16, "Row 3 Col 3");
        // equal(scaleMatrix.elements[4][4], 5, "Row 1 Col 0");

        // ** add a multiplication test case
    });
    
    var floatEquality = function (n, m) {
        if (Math.abs(n - m) < 0.0001) {
            return true;
        } else {
            return false;
        }
    }

    test("3D Rotation Matrices", function () {
       
        var data = { angle: 60, rx: 1, ry: 0, rz: 0 };
        var rotationMatrix = new Matrix(4, 4).getRotationMatrix(4, 4, data);
        console.log(rotationMatrix);

        var array = [
            [ 1, 2, 3, 4 ],
            [ 5, 6, 7, 8 ],
            [ 9, 10, 11, 12 ],
            [ 13, 14, 15, 16 ]
        ];
        var matrix1 = new Matrix(4, 4, array);
        var matrixResult = rotationMatrix.mult(matrix1);

        console.log(matrixResult);

        equal(floatEquality(1.00001, 0.99999), true, "test");
        equal(floatEquality(0.00001, 0.0000001), true, "test2");
        equal(!floatEquality(2.00001, 0.0000001), true, "test2");

        // equal(matrix1.checkDimensions(matrix2), true, "Check that dimensions match");
        // equal(matrixResult.dimensions().rows, 4, "Rows");
        // equal(matrixResult.dimensions().cols, 4, "Columns");
        equal(matrixResult.elements[0][0], 1, "Row 0 Col 0");
        equal(matrixResult.elements[0][1], 2, "Row 0 Col 1");
        equal(matrixResult.elements[0][2], 3, "Row 0 Col 2");
        equal(matrixResult.elements[0][3], 4, "Row 0 Col 3");
        // equal(matrixResult.elements[0][4], 4, "Row 0 Col 3");
        equal(floatEquality(matrixResult.elements[1][0], -5.294228634056), true, "Row 1 Col 0");
        equal(floatEquality(matrixResult.elements[1][1], -5.66025403784), true, "Row 1 Col 1");
        equal(floatEquality(matrixResult.elements[1][2], -6.026279441624), true, "Row 1 Col 2");
        equal(floatEquality(matrixResult.elements[1][3], -6.392304845408), true, "Row 1 Col 3");
        // equal(matrixResult.elements[1][4], 5, "Row 1 Col 0");
        equal(floatEquality(matrixResult.elements[2][0], 8.83012701892), true, "Row 2 Col 0");
        equal(floatEquality(matrixResult.elements[2][1], 10.196152422704), true, "Row 2 Col 1");
        equal(floatEquality(matrixResult.elements[2][2], 11.562177826488), true, "Row 2 Col 2");
        equal(floatEquality(matrixResult.elements[2][3], 12.928203230272), true, "Row 2 Col 3");
        // equal(matrixResult.elements[2][4], 5, "Row 1 Col 0");
        equal(matrixResult.elements[3][0], 13, "Row 3 Col 0");
        equal(matrixResult.elements[3][1], 14, "Row 3 Col 1");
        equal(matrixResult.elements[3][2], 15, "Row 3 Col 2");
        equal(matrixResult.elements[3][3], 16, "Row 3 Col 3");
        // equal(matrixResult.elements[3][4], 5, "Row 1 Col 0");
        // equal(matrixResult.elements[4][0], 13, "Row 3 Col 0");
        // equal(matrixResult.elements[4][1], 14, "Row 3 Col 1");
        // equal(matrixResult.elements[4][2], 15, "Row 3 Col 2");
        // equal(matrixResult.elements[4][3], 16, "Row 3 Col 3");
        // equal(matrixResult.elements[4][4], 5, "Row 1 Col 0");

    });
    
    test("Camera Matrices", function () {
        var location = new Vector(0, 0, 0);
        var lookAt = new Vector(1, 0.5, 1);
        var upward = new Vector(0, 1, 0);
        var cameraMatrix = new Matrix(4, 4).getCameraMatrix(location, lookAt, upward);

        equal(cameraMatrix.dimensions().rows, 4, "Rows");
        equal(cameraMatrix.dimensions().cols, 4, "Cols");
        notEqual(cameraMatrix.elements[0][0], 0, "Row 0 Col 0");
        equal(cameraMatrix.elements[0][1], 0, "Row 0 Col 1");
        notEqual(cameraMatrix.elements[0][2], 0, "Row 0 Col 2");
        equal(cameraMatrix.elements[0][3], 0, "Row 0 Col 3");
        notEqual(cameraMatrix.elements[1][0], 0, "Row 1 Col 0");
        notEqual(cameraMatrix.elements[1][1], 0, "Row 1 Col 1");
        notEqual(cameraMatrix.elements[1][2], 0, "Row 1 Col 2");
        equal(cameraMatrix.elements[1][3], 0, "Row 1 Col 3");
        notEqual(cameraMatrix.elements[2][0], 0,"Row 2 Col 0");
        notEqual(cameraMatrix.elements[2][1], 0,"Row 2 Col 1");
        notEqual(cameraMatrix.elements[2][2], 0,"Row 2 Col 2");
        equal(cameraMatrix.elements[2][3], 0,"Row 2 Col 3");
        equal(cameraMatrix.elements[3][0], 0, "Row 3 Col 0");
        equal(cameraMatrix.elements[3][1], 0, "Row 3 Col 1");
        equal(cameraMatrix.elements[3][2], 0, "Row 3 Col 2");
        equal(cameraMatrix.elements[3][3], 1, "Row 3 Col 3");

    });

    test("conversion to GLFormat", function () {
        var matrix = new Matrix(4, 4);

        equal(matrix.elements[0][0], 1, "Row 0 col 0");
        equal(matrix.elements[1][0], 0, "Row 1 col 0");
        equal(matrix.elements[2][0], 0, "Row 2 col 0");
        equal(matrix.elements[3][0], 0, "Row 3 col 0");

        equal(matrix.elements[0][1], 0, "Row 0 col 1");
        equal(matrix.elements[1][1], 1, "Row 1 col 1");
        equal(matrix.elements[2][1], 0, "Row 2 col 1");
        equal(matrix.elements[3][1], 0, "Row 3 col 1");

        equal(matrix.elements[0][2], 0, "Row 0 col 2");
        equal(matrix.elements[1][2], 0, "Row 1 col 2");
        equal(matrix.elements[2][2], 1, "Row 2 col 2");
        equal(matrix.elements[3][2], 0, "Row 3 col 2");

        equal(matrix.elements[0][3], 0, "Row 0 col 3");
        equal(matrix.elements[1][3], 0, "Row 1 col 3");
        equal(matrix.elements[2][3], 0, "Row 2 col 3");
        equal(matrix.elements[3][3], 1, "Row 3 col 3");    
    });
});