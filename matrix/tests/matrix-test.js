/*
 * Unit tests for our vector object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        
        var idMatrix = new Matrix(4, 4);

        // equal(idMatrix.dimensions().rows, 4, "Rows");
        // equal(idMatrix.dimensions().cols, 4, "Columns");
        equal(idMatrix.elements[0][0], 1, "Row 0 Col 0");
        equal(idMatrix.elements[0][1], 0, "Row 0 Col 1");
        equal(idMatrix.elements[0][2], 0, "Row 0 Col 2");
        equal(idMatrix.elements[0][3], 0, "Row 0 Col 3");
        equal(idMatrix.elements[1][0], 0, "Row 1 Col 0");
        equal(idMatrix.elements[1][1], 1, "Row 1 Col 1");
        equal(idMatrix.elements[1][2], 0, "Row 1 Col 2");
        equal(idMatrix.elements[1][3], 0, "Row 1 Col 3");
        equal(idMatrix.elements[2][0], 0, "Row 2 Col 0");
        equal(idMatrix.elements[2][1], 0, "Row 2 Col 1");
        equal(idMatrix.elements[2][2], 1, "Row 2 Col 2");
        equal(idMatrix.elements[2][3], 0, "Row 2 Col 3");
        equal(idMatrix.elements[3][0], 0, "Row 3 Col 0");
        equal(idMatrix.elements[3][1], 0, "Row 3 Col 1");
        equal(idMatrix.elements[3][2], 0, "Row 3 Col 2");
        equal(idMatrix.elements[3][3], 1, "Row 3 Col 3");

        var matrix = new Matrix(3, 3);

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

        matrix = new Matrix(4, 4);

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
        var matrix1 = new Matrix(4, 5);
        var matrix2 = new Matrix(10, 4);
        var matrixResult = matrix1.mult(matrix2);

        equal(matrixResult.dimensions().rows, 4, "Rows");
        equal(matrixResult.dimensions().cols, 4, "Columns");

        
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

    // test("Scalar Multiplication and Division", function () {
    //     var v = new Vector(8, 2, 3);
    //     var vresult = v.multiply(2);

    //     equal(vresult.x(), 16, "Vector scalar multiplication first element");
    //     equal(vresult.y(), 4, "Vector scalar multiplication second element");
    //     equal(vresult.z(), 6, "Vector scalar multiplication third element");

    //     vresult = vresult.divide(4);

    //     equal(vresult.x(), 4, "Vector scalar division first element");
    //     equal(vresult.y(), 1, "Vector scalar division second element");
    //     equal(vresult.z(), 1.5, "Vector scalar division third element");
    // });

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