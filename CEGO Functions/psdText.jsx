function psdText() {
    app.beginUndoGroup("Import PSD");
    var tempPsdScript = Folder.current.absoluteURI + encodeURI('/Scripts/CEGO Functions/temppsd.jsx');
    var tempString = "$.evalFile('" + decodeURI(tempPsdScript) + "');";

    var bt = new BridgeTalk;
    bt.target = "photoshop";
    bt.body = tempString;
    bt.onResult = function (response) {
        app.beginUndoGroup('Import PSD');
        var prj = app.project;
        var thisComp = prj.activeItem;
        var n = response.body;

        var importOptions = new ImportOptions();
        importOptions.file = File('~/Desktop/' + n + '.psd');
        importOptions.importAs = ImportAsType.COMP_CROPPED_LAYERS;

        var newItem = prj.importFile(importOptions);

        for (var i = newItem.numLayers; i > 0; i--) {
            newItem.layer(i).copyToComp(thisComp);
        }

        for (var j = 1; j <= newItem.numLayers; j++) {
            thisComp.layer(j).selected = true;
        }

        app.executeCommand(3799); //convert to editable text

        newItem.remove();

        for (var i = 1; i <= prj.items.length; i++) {
            if (prj.item(i).name == n + " Layers") {
                prj.item(i).remove();
            }
        }
        importOptions.file.remove();

        app.endUndoGroup();
    }
    bt.send();
    app.endUndoGroup();
}