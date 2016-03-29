
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

        // v = new Vector(3, 2, 1, 2);

        // equal(v.dimensions(), 4, "Vector size");
        // equal(v.elements[0], 3, "First element by index");
        // equal(v.elements[1], 2, "Second element by index");
        // equal(v.elements[2], 1, "Third element by index");
        // equal(v.elements[3], 2, "Fourth element by index");
        // equal(v.x(), 3, "First element by coordinate");
        // equal(v.y(), 2, "Second element by coordinate");
        // equal(v.z(), 1, "Third element by coordinate");
        // equal(v.w(), 2, "Fourth element by coordinate");

        // v = new Vector();
        // equal(v.dimensions(), 0, "Empty vector (boundary case)");
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

        // equal(matrix1.checkDimensions(matrix2), false, "Check that dimensions match");

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

        /**
            result: [
                [ 140, 125, 110, 95 ],
                [ 440, 400, 360, 320 ],
                [ 740, 675, 610, 545 ],
                [ 1040, 950, 860, 770 ]
            ]
        */
        // equal(matrix1.checkDimensions(matrix2), true, "Check that dimensions match");
        // equal(matrixResult.dimensions().rows, 4, "Rows");
        // equal(matrixResult.dimensions().cols, 4, "Columns");
        equal(matrixResult.elements[0][0], 140, "Row 0 Col 0");
        equal(matrixResult.elements[0][1], 125, "Row 0 Col 1");
        equal(matrixResult.elements[0][2], 110, "Row 0 Col 2");
        equal(matrixResult.elements[0][3], 95, "Row 0 Col 3");
        // equal(matrixResult.elements[0][4], 4, "Row 0 Col 3");
        equal(matrixResult.elements[1][0], 440, "Row 1 Col 0");
        equal(matrixResult.elements[1][1], 400, "Row 1 Col 1");
        equal(matrixResult.elements[1][2], 360, "Row 1 Col 2");
        equal(matrixResult.elements[1][3], 320, "Row 1 Col 3");
        // equal(matrixResult.elements[1][4], 5, "Row 1 Col 0");
        equal(matrixResult.elements[2][0], 740, "Row 2 Col 0");
        equal(matrixResult.elements[2][1], 675, "Row 2 Col 1");
        equal(matrixResult.elements[2][2], 610, "Row 2 Col 2");
        equal(matrixResult.elements[2][3], 545, "Row 2 Col 3");
        // equal(matrixResult.elements[2][4], 5, "Row 1 Col 0");
        equal(matrixResult.elements[3][0], 1040, "Row 3 Col 0");
        equal(matrixResult.elements[3][1], 950, "Row 3 Col 1");
        equal(matrixResult.elements[3][2], 860, "Row 3 Col 2");
        equal(matrixResult.elements[3][3], 770, "Row 3 Col 3");
        // equal(matrixResult.elements[3][4], 5, "Row 1 Col 0");
        // equal(matrixResult.elements[4][0], 13, "Row 3 Col 0");
        // equal(matrixResult.elements[4][1], 14, "Row 3 Col 1");
        // equal(matrixResult.elements[4][2], 15, "Row 3 Col 2");
        // equal(matrixResult.elements[4][3], 16, "Row 3 Col 3");
        // equal(matrixResult.elements[4][4], 5, "Row 1 Col 0");

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
        

        // v1 = new Vector(0, -2, 3, 5);
        // v2 = new Vector(-2, 1, 0, 7);
        // matrixResult = v1.subtract(v2);
        // equal(matrixResult.dimensions(), 4, "Vector difference size check");
        // equal(matrixResult.x(), 2, "Vector difference first element");
        // equal(matrixResult.y(), -3, "Vector difference second element");
        // equal(matrixResult.z(), 3, "Vector difference third element");
        // equal(matrixResult.w(), -2, "Vector difference fourth element");

        // // Check for errors.
        // v1 = new Vector(5, 8, 10, 2);
        // v2 = new Vector(1, 2, 2);

        // // We can actually check for a *specific* exception, but
        // // we won't go that far for now.
        // throws(
        //     function () {
        //         return v1.add(v2);
        //     },
        //     "Check for vectors of different sizes"
        // );
    });

    test("3D Translation Matrices", function () {
       
        var data = { tx: 5, ty: 2, tz: 4 };
        var translateMatrix = new Matrix(4, 4).translate(4, 4, data);
        console.log(translateMatrix);
        // equal(matrix1.checkDimensions(matrix2), true, "Check that dimensions match");
        // equal(translateMatrix.dimensions().rows, 4, "Rows");
        // equal(translateMatrix.dimensions().cols, 4, "Columns");
        equal(translateMatrix.elements[0][0], 1, "Row 0 Col 0");
        equal(translateMatrix.elements[0][1], 0, "Row 0 Col 1");
        equal(translateMatrix.elements[0][2], 0, "Row 0 Col 2");
        equal(translateMatrix.elements[0][3], data.tx, "Row 0 Col 3");
        // equal(translateMatrix.elements[0][4], 4, "Row 0 Col 3");
        equal(translateMatrix.elements[1][0], 0, "Row 1 Col 0");
        equal(translateMatrix.elements[1][1], 1, "Row 1 Col 1");
        equal(translateMatrix.elements[1][2], 0, "Row 1 Col 2");
        equal(translateMatrix.elements[1][3], data.ty, "Row 1 Col 3");
        // equal(translateMatrix.elements[1][4], 5, "Row 1 Col 0");
        equal(translateMatrix.elements[2][0], 0, "Row 2 Col 0");
        equal(translateMatrix.elements[2][1], 0, "Row 2 Col 1");
        equal(translateMatrix.elements[2][2], 1, "Row 2 Col 2");
        equal(translateMatrix.elements[2][3], data.tz, "Row 2 Col 3");
        // equal(translateMatrix.elements[2][4], 5, "Row 1 Col 0");
        equal(translateMatrix.elements[3][0], 0, "Row 3 Col 0");
        equal(translateMatrix.elements[3][1], 0, "Row 3 Col 1");
        equal(translateMatrix.elements[3][2], 0, "Row 3 Col 2");
        equal(translateMatrix.elements[3][3], 1, "Row 3 Col 3");
        // equal(translateMatrix.elements[3][4], 5, "Row 1 Col 0");
        // equal(translateMatrix.elements[4][0], 13, "Row 3 Col 0");
        // equal(translateMatrix.elements[4][1], 14, "Row 3 Col 1");
        // equal(translateMatrix.elements[4][2], 15, "Row 3 Col 2");
        // equal(translateMatrix.elements[4][3], 16, "Row 3 Col 3");
        // equal(translateMatrix.elements[4][4], 5, "Row 1 Col 0");

    });

    // test("Dot Product", function () {
    //     var v1 = new Vector(-5, -2);
    //     var v2 = new Vector(-3, 4);

    //     equal(v1.dot(v2), 7, "2D dot product");

    //     // Try for a perpendicular.
    //     v1 = new Vector(Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    //     v2 = new Vector(-Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    //     equal(v1.dot(v2), 0, "Perpendicular 2D dot product");

    //     // Try 3D.
    //     v1 = new Vector(3, 2, 5);
    //     v2 = new Vector(4, -1, 3);
    //     equal(v1.dot(v2), 25, "3D dot product");

    //     // And 4D.
    //     v1 = new Vector(2, 2, 4, 8);
    //     v2 = new Vector(-1, 7, 0, 20);
    //     equal(v1.dot(v2), 172, "4D dot product");

    //     // Check for errors.
    //     v1 = new Vector(4, 2);
    //     v2 = new Vector(3, 9, 1);

    //     // We can actually check for a *specific* exception, but
    //     // we won't go that far for now.
    //     throws(
    //         function () {
    //             return v1.dot(v2);
    //         },
    //         "Check for vectors of different sizes"
    //     );
    // });

    // test("Cross Product", function () {
    //     var v1 = new Vector(3, 4);
    //     var v2 = new Vector(1, 2);

    //     // The cross product is restricted to 3D, so we start
    //     // with an error check.
    //     throws(
    //         function () {
    //             return v1.cross(v2);
    //         },
    //         "Check for non-3D vectors"
    //     );

    //     // Yeah, this is a bit of a trivial case.  But it at least
    //     // establishes the right-handedness of a cross-product.
    //     v1 = new Vector(1, 0, 0);
    //     v2 = new Vector(0, 1, 0);
    //     var vresult = v1.cross(v2);

    //     equal(vresult.x(), 0, "Cross product first element");
    //     equal(vresult.y(), 0, "Cross product second element");
    //     equal(vresult.z(), 1, "Cross product third element");

    //     // This one shows that switching vector order produces
    //     // the opposite-pointing normal.
    //     vresult = v2.cross(v1);

    //     equal(vresult.x(), 0, "Cross product first element");
    //     equal(vresult.y(), 0, "Cross product second element");
    //     equal(vresult.z(), -1, "Cross product third element");
    // });

    // test("Magnitude and Unit Vectors", function () {
    //     var v = new Vector(3, 4);

    //     // The classic example.
    //     equal(v.magnitude(), 5, "2D magnitude check");

    //     // Kind of a cheat, but still tests the third dimension.
    //     v = new Vector(5, 0, 12);
    //     equal(v.magnitude(), 13, "3D magnitude check");

    //     // Now for unit vectors.
    //     v = (new Vector(3, 4)).unit();

    //     equal(v.magnitude(), 1, "2D unit vector check");
    //     equal(v.x(), 3 / 5, "2D unit vector first element");
    //     equal(v.y(), 4 / 5, "2D unit vector second element");

    //     v = (new Vector(0, -7, 24)).unit();

    //     equal(v.magnitude(), 1, "3D unit vector check");
    //     equal(v.x(), 0, "3D unit vector first element");
    //     equal(v.y(), -7 / 25, "3D unit vector second element");
    //     equal(v.z(), 24 / 25, "3D unit vector third element");
    // });

    // test("Projection", function () {
    //     var v = new Vector(3, 3, 0);
    //     var vresult = v.projection(new Vector(5, 0, 0));

    //     equal(vresult.magnitude(), 3, "3D vector projection magnitude check");
    //     equal(vresult.x(), 3, "3D vector projection first element");
    //     equal(vresult.y(), 0, "3D vector projection second element");
    //     equal(vresult.z(), 0, "3D vector projection third element");

    //     // Error check: projection only applies to vectors with the same
    //     // number of dimensions.
    //     throws(
    //         function () {
    //             (new Vector(5, 2)).projection(new Vector(9, 8, 1));
    //         },
    //         "Ensure that projection applies only to vectors with the same number of dimensions"
    //     );
    // });

});