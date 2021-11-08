function extractMask() {
    app.beginUndoGroup("Extract Mask");
    var thisComp = app.project.activeItem;
    var thisLayer = thisComp.selectedLayers[0];
    var parent = thisLayer.parent;
    var originPath = thisLayer.property("Masks").property("Mask 1").property(1);

    var maskLayer = thisComp.layers.addShape();

    thisLayer.parent = null;

    copyProperty(thisLayer, maskLayer, "Anchor Point");
    copyProperty(thisLayer, maskLayer, "Position");
    copyProperty(thisLayer, maskLayer, "Scale");
    copyProperty(thisLayer, maskLayer, "Rotation");

    thisLayer.parent = parent;

    var mPath = maskLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Group").property("ADBE Vector Shape");

    if (originPath.numKeys > 0) {
        pasteKeys(mPath, keyData(originPath));
    } else {
        mPath.setValue(originPath.value);
    }

    maskLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    maskLayer.name = "Mask";
    maskLayer.inPoint = thisLayer.inPoint;
    maskLayer.outPoint = thisLayer.outPoint;
    maskLayer.moveBefore(thisLayer);

    thisLayer.property("Masks").property("Mask 1").remove();
    thisLayer.trackMatteType = TrackMatteType.ALPHA;

    app.endUndoGroup();
}

function copyProperty(origin, target, name) {
    target.property(name).setValue(origin.property(name).value);
}

function keyData(prop) {
    var kData = [];

    for (var i = 1; i <= prop.numKeys; i++) {
        var k = {};
        k.time = prop.keyTime(i);
        k.value = prop.keyValue(i);
        k.kIIT = prop.keyInInterpolationType(i);
        k.kOIT = prop.keyOutInterpolationType(i);
        k.kITE = prop.keyInTemporalEase(i);
        k.kOTE = prop.keyOutTemporalEase(i);

        if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL) {
            k.kIST = prop.keyInSpatialTangent(i);
            k.kOST = prop.keyOutSpatialTangent(i);
            k.kR = prop.keyRoving(i);
            k.kSAB = prop.keySpatialAutoBezier(i);
            k.kSC = prop.keySpatialContinuous(i);
        }

        kData.push(k);
    }

    return kData;
}

function pasteKeys(prop, data) {
    for (var i = 0; i < data.length; i++) {
        var k = data[i];
        prop.addKey(k.time);
        prop.setValueAtKey(prop.numKeys, k.value);
        prop.setInterpolationTypeAtKey(prop.numKeys, k.kIIT, k.kOIT);
        prop.setTemporalEaseAtKey(prop.numKeys, k.kITE, k.kOTE);

        if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL) {
            prop.setSpatialTangentsAtKey(prop.numKeys, k.kIST, k.kOST);
            prop.setSpatialAutoBezierAtKey(prop.numKeys, k.kSAB);
            prop.setTemporalContinuousAtKey(prop.numKeys, k.kSC);
            prop.setRovingAtKey(prop.numKeys, k.kR);
        }
    }
}