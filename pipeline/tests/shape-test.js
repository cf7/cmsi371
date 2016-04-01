/*
 * Unit tests for our vector object.
 */ 
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        var shape = new Shape();
        
        var faceCount = 20;
        var coneData = shape.cone(faceCount);

        equal(coneData.vertices[0].length, 3, "x, y, and z coordinates");
        equal(coneData.indices.length, faceCount, "arrangement for each face");

        
    });

    test("Testing Defaults", function () {
        var shape2 = new Shape();
        shape2.setDrawingStyle("triangles");

        equal(shape2.color.r, 0, "red");
        equal(shape2.color.g, 0.75, "green");
        equal(shape2.color.b, 0.75, "blue");
        equal(shape2.getTranslate().tx, 0, "tx");
        equal(shape2.getTranslate().ty, 0, "ty");
        equal(shape2.getTranslate().tz, 0, "tz");
        equal(shape2.getScale().sx, 1, "sx");
        equal(shape2.getScale().sy, 1, "sy");
        equal(shape2.getScale().sz, 1, "sz");

    });

    test("Testing transform functions", function () {
        var shape3 = new Shape();
        shape3.translateShape(0.25, 1, 0.15);

        equal(shape3.getTranslate().tx, 0.25, "tx");
        equal(shape3.getTranslate().ty, 1, "ty");
        equal(shape3.getTranslate().tz, 0.15, "tz");

        shape3.scaleShape(0.25, 1, 0.15);

        equal(shape3.getScale().sx, 0.25, "sx");
        equal(shape3.getScale().sy, 1, "sy");
        equal(shape3.getScale().sz, 0.15, "sz");

        shape3.rotateShape(180, 1, 1, 0);

        equal(shape3.getRotate().angle, 180, "angle");
        equal(shape3.getRotate().rx, 1, "rx");
        equal(shape3.getRotate().ry, 1, "ry");
        equal(shape3.getRotate().rz, 0, "rz");

    });

    test("Testing child arrays", function () {
        var shape4 = new Shape();

        for (var index = 0; index < 10; index++) {
            shape4.addChild(new Shape());
        }
        shape4.getChildren()[4].addChild(new Shape());
        shape4.getChildren()[5].addChild(new Shape());

        equal(shape4.getChildren().length, 10, "10 elements in children array");
        equal(shape4.getChildren()[4].getChildren().length, 1, "two levels down");
        equal(shape4.getChildren()[5].getChildren().length, 1, "two levels down again");

        equal(shape4.getChildren()[3].parent.getChildren().length, 10, "up and down the tree");
    });

});