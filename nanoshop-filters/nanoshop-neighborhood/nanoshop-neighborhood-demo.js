/*
 * This demo script uses the NanoshopNeighborhood module to apply a
 * "pixel neighborhood" filter on a canvas drawing.
 */
$(function () {
    var canvas = $("#picture")[0];
    var renderingContext = canvas.getContext("2d");

    renderingContext.save();
    // Scene created by Angela Elgar: https://github.com/aelgar
    renderingContext.save();
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
    renderingContext.restore();

    // Some edge lines to test for wraparound bleeding.
    renderingContext.strokeStyle = "yellow";
    renderingContext.beginPath();
    renderingContext.moveTo(0, 0);
    renderingContext.lineTo(canvas.width - 1, 0);
    renderingContext.stroke();

    renderingContext.strokeStyle = "cyan";
    renderingContext.beginPath();
    renderingContext.moveTo(0, canvas.height - 1);
    renderingContext.lineTo(canvas.width - 1, canvas.height - 1);
    renderingContext.stroke();

    renderingContext.strokeStyle = "green";
    renderingContext.beginPath();
    renderingContext.moveTo(0, 0);
    renderingContext.lineTo(0, canvas.height - 1);
    renderingContext.stroke();

    renderingContext.strokeStyle = "red";
    renderingContext.beginPath();
    renderingContext.moveTo(canvas.width - 1, 0);
    renderingContext.lineTo(canvas.width - 1, canvas.height / 2);
    renderingContext.stroke();

    renderingContext.strokeStyle = "blue";
    renderingContext.beginPath();
    renderingContext.moveTo(canvas.width - 1, canvas.height / 2);
    renderingContext.lineTo(canvas.width - 1, canvas.height - 1);
    renderingContext.stroke();

    renderingContext.restore();


    renderingContext.save();
    renderingContext.translate(600, 100);
    window.SpriteLibrary.fairy({
        context: renderingContext,
        fairyData: {
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
        }
    });
    renderingContext.restore();

    renderingContext.save();
    renderingContext.scale(0.5, 0.5);
    renderingContext.translate(400, 500);
    window.SpriteLibrary.tree({
        context: renderingContext,
        treeData: {
            trunk: {
                dimensions: { width: 50, height: 300 }
            },
            branches: {
                dimensions: { width: 50, height: 75 },
                nextThickness: 0.5,
                angles: (Math.PI/9),
                layers: 7,
                leaves: {
                    position: { x: 0, y: 0 },
                    radius: 20,
                    startAngle: 0,
                    endAngle: 4 * Math.PI/3,
                    counterClockwise: true,
                    leafColor: "green",
                    count: 2,
                },
            },
            barkColor: "rgb(90, 55, 45)" 
        }               
    });
    renderingContext.restore();

    renderingContext.save();
    renderingContext.translate(500, 400);
    window.SpriteLibrary.water({
        context: renderingContext,
        waterData: {
            radius: 200,
            startAngle: 0,
            endAngle: Math.PI*2,
            counterClockwise: true,
            color: "rgba(0, 130, 255, 0.9)",
            numberWaves: 30
        }
    });
    renderingContext.restore();

    // Set a little event handler to apply the filter.
    $("#apply-filter-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // NanoshopNeighborhood.darkener
                // NanoshopNeighborhood.averager // Convenience comment for easy switching.
                //NanoshopNeighborhood.outline
                // NanoshopNeighborhood.crystal
                // NanoshopNeighborhood.illuminated
                NanoshopNeighborhood.sunlight
            ),
            0, 0
        );
    });
});
