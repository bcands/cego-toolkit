function generateName() {
    var letters = "abcdefghijklmnopqrstuvwxyz";
    var nums = "0123456789";
    var result = "";
    var nameLength = 10;

    function grabRandomChar(string) {
        return string[Math.floor(Math.random() * string.length)];
    }

    function chance() {
        return Math.random() * 100 > 50;
    }

    for (var i = 0; i < nameLength; i++) {
        var tempString = chance() ? letters : nums;
        result += chance() ? grabRandomChar(tempString) : grabRandomChar(tempString).toUpperCase();
    }
    return result;
}

cTID = function (s) { return app.charIDToTypeID(s); };
sTID = function (s) { return app.stringIDToTypeID(s); };

function newGroupFromLayers(doc) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(sTID('layerSection'));
    desc.putReference(cTID('null'), ref);
    var lref = new ActionReference();
    lref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc.putReference(cTID('From'), lref);
    executeAction(cTID('Mk  '), desc, DialogModes.NO);
};

function undo() {
    executeAction(cTID("undo", undefined, DialogModes.NO));
};

function getSelectedLayers(doc) {
    var selLayers = [];
    newGroupFromLayers();

    var group = doc.activeLayer;
    var layers = group.layers;

    for (var i = 0; i < layers.length; i++) {
        selLayers.push(layers[i]);
    }

    undo();

    return selLayers;
};

var n = generateName();
var docRef = app.activeDocument;
var selectedLayers = getSelectedLayers(app.activeDocument);

var newDoc = app.documents.add(docRef.width, docRef.height, docRef.resolution, n);
app.activeDocument = docRef;

for (var x = selectedLayers.length - 1; x >= 0 ; x--) {
    selectedLayers[x].duplicate(newDoc);
}

app.activeDocument = newDoc;
newDoc.backgroundLayer.remove();
newDoc.saveAs(File("~/Desktop"), PhotoshopSaveOptions);
newDoc.close();
n;