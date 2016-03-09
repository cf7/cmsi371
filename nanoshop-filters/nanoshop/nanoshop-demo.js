/*
 * This demo script uses the Nanoshop module to apply a simple
 * filter on a canvas drawing.
 */
$(function () {
    var canvas = $("#picture")[0];
    var renderingContext = canvas.getContext("2d");
    console.log(window.SpriteLibrary);
    // Scene created by Angela Elgar: https://github.com/aelgar
    renderingContext.translate(400, 200);
    Sprites.Wall.draw(renderingContext, { });
    
    renderingContext.resetTransform();
    renderingContext.translate(120, 220);
    Sprites.Shelf.draw(renderingContext);
    renderingContext.translate(220, 0);
    Sprites.Shelf.draw(renderingContext);
    renderingContext.resetTransform();
    renderingContext.translate(510, 120);
    Sprites.Chalkboard.draw(renderingContext, { variation: "A" });
    renderingContext.translate(110, 0);
    Sprites.Chalkboard.draw(renderingContext, { variation: "B" });
    renderingContext.translate(110, 0);
    Sprites.Chalkboard.draw(renderingContext, { variation: "A" });

    renderingContext.resetTransform();
    renderingContext.translate(80, 88);
    renderingContext.scale(0.2, 0.2);
    renderingContext.rotate(Math.PI);
    Sprites.Cup.draw(renderingContext, { color:"PapayaWhip" });
    renderingContext.translate(-180, 0);
    Sprites.Cup.draw(renderingContext, { color:"DarkSalmon" });
    renderingContext.translate(-180, 0);
    Sprites.Cup.draw(renderingContext, { color:"PapayaWhip" });
    
    renderingContext.translate(-690, 0);
    renderingContext.rotate(Math.PI);
    Sprites.Cup.draw(renderingContext, { color:"SeaGreen" });
    renderingContext.translate(250, 0);
    Sprites.Cup.draw(renderingContext, { });
    
    renderingContext.resetTransform();
    renderingContext.translate(70, 158);
    renderingContext.scale(0.2, 0.2);
    Sprites.Cup.draw(renderingContext, { color:"CadetBlue" });
    renderingContext.translate(220, 0);
    Sprites.Cup.draw(renderingContext, { color: "Plum" });
    renderingContext.translate(220, 0);
    Sprites.Cup.draw(renderingContext, { color: "CadetBlue" });

    renderingContext.resetTransform();
    renderingContext.translate(290, 228);
    renderingContext.scale(0.2, 0.2);
    Sprites.Cup.draw(renderingContext, { color: "LemonChiffon" });
    renderingContext.translate(220, 0);
    Sprites.Cup.draw(renderingContext, { color: "LemonChiffon" });
    renderingContext.translate(220, 0);
    Sprites.Cup.draw(renderingContext, { color: "LemonChiffon" });

    renderingContext.resetTransform();
    renderingContext.translate(570, 360);
    Sprites.Counter.draw(renderingContext);
    
    renderingContext.resetTransform();
    renderingContext.translate(540, 280);
    renderingContext.scale(0.2, 0.2);
    Sprites.Cup.draw(renderingContext, { steamOpacity: 0.3 });
    renderingContext.translate(300,0);
    Sprites.Cup.draw(renderingContext, { steamOpacity: 0.4, color: "SeaGreen" });

    renderingContext.setTransform(.5, 0, 0, .5, 60, 50);
    Sprites.RoomLight.draw(renderingContext, { brightness: 0.3 });
    renderingContext.translate(300, -50);
    renderingContext.scale(1.5, 1.2);
    Sprites.RoomLight.draw(renderingContext, { brightness: 0.5 });
    renderingContext.translate(280, -20);
    renderingContext.scale(0.5, 1);
    Sprites.RoomLight.draw(renderingContext, { brightness: 0.3 });
    renderingContext.translate(500, 30);
    renderingContext.scale(2.5, 0.7);
    Sprites.RoomLight.draw(renderingContext, { brightness: 0.4 });
    renderingContext.translate(160, -80);
    renderingContext.scale(0.5, 1);
    Sprites.RoomLight.draw(renderingContext, { brightness: 0.4 });
    renderingContext.translate(-800, -600);
    renderingContext.scale(5, 2.5);
    Sprites.RoomLight.draw(renderingContext, { brightness: 0.4 });

    window.SpriteLibrary.fairy({
        innerRadius: 20,
        beforeRadius: 20,
        outerRadius: 50,
        innerColor: "white",
        outerColor: "rgb(137, 255, 249)",
        direction: {forward: true, left: false, right: false },
        wingsInward: true,
        howOpen: 0,
        flutterSpeed: 4,
        howGlowy: 10,
        glowSpeed: 0
    });
    // window.SpriteLibrary.tree({
    //     trunk: {
    //         dimensions: { width: 50, height: 300 }
    //     },
    //     branches: {
    //         dimensions: { width: 50, height: 75 },
    //         nextThickness: 0.5,
    //         angles: (Math.PI/9),
    //         layers: 7,
    //         leaves: {
    //             position: { x: 0, y: 0 },
    //             radius: 20,
    //             startAngle: 0,
    //             endAngle: 4 * Math.PI/3,
    //             counterClockwise: true,
    //             leafColor: "green",
    //             count: 2,
    //         },
    //     },
    //     barkColor: "rgb(90, 55, 45)"                
    // });
    // window.SpriteLibrary.water({
    //     radius: 30,
    //     startAngle: 0,
    //     endAngle: Math.PI*2,
    //     counterClockwise: true,
    //     color: "rgba(0, 130, 255, 0.9)",
    //     numberWaves: 30
    // });

    // Set a little event handler to apply the filter.
    $("#apply-filter-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                Nanoshop.blueFinder
                // Nanoshop.fairyDust
                // Nanoshop.waves
            ),
            0, 0
        );
    });
});
