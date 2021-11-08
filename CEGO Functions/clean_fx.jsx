function cleanFx() {
    app.beginUndoGroup("Clean FX");
    var thisComp = app.project.activeItem;
    var thisLayer;

    for (var j = 0; j < thisComp.selectedLayers.length; j++) {
        thisLayer = thisComp.selectedLayers[j];
        for (var i = thisLayer.property('ADBE Effect Parade').numProperties; i > 0; i--) {
            thisLayer.property('ADBE Effect Parade').property(i).remove();
        }
    }
    app.endUndoGroup();
}