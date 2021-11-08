function consolidate() {
    app.beginUndoGroup("Consolidate Footage");
    var prj = app.project;
    prj.consolidateFootage();
    app.endUndoGroup();
}