function offset(){
    app.beginUndoGroup("Offset");
    var thisComp = app.project.activeItem;
    var a = this.value*thisComp.frameDuration;
    for (var i=0;i<thisComp.selectedLayers.length;i++){
      thisComp.selectedLayers[i].startTime = thisComp.selectedLayers[i].startTime + a*i;
    }
    app.endUndoGroup();
}