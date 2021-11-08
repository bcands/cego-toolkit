function addControl() {
    app.beginUndoGroup("Add Control Layer");
    var thisComp = app.project.activeItem;
    var sLayers = thisComp.selectedLayers;

    var newShape = thisComp.layers.addShape();

    var topLayer;
    for (var i = 0; i < sLayers.length; i++) {
        if (topLayer != null) {
            if (sLayers[i].index < topLayer.index) {
                topLayer = sLayers[i];
            }
        } else {
            topLayer = sLayers[i];
        }
    }

    if (topLayer.hasTrackMatte) {
        topLayer = thisComp.layer(topLayer.index - 1);
    }

    newShape.moveBefore(topLayer);
    newShape.name = "Control";

    if (thisComp instanceof CompItem) {
        for (var i = 0; i < sLayers.length; i++) {
            sLayers[i].parent = newShape;
        }
    }
    app.endUndoGroup();
}