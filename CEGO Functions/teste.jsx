{
    function myScript(thisObj) {
        function myScript_buildUI(thisObj) {
            var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "CEGO Toolkit", undefined, { resizeable: true, closeButton: true });

            res = "group{\
                gBtns:Group{\
                    size:[20,100],\
                    orientation:'column',\
                    alignChildren:'center',\
                    spacing:6,\
                    btnPSD:Button{size:[110,30],text:'Mark Sources'},\
                    }}";

            panelGrp = panel.add(res);
            panelGrp.layout.layout(true);
            panel.layout.layout(true);

            panelGrp.gBtns.btnPSD.onClick = markSources;

            return panel;
        }

        var myScriptPanel = myScript_buildUI(thisObj);

        myScriptPanel.onShow = function () {
            myScriptPanel.minimumSize = myScriptPanel.size; // define the initial standard size as minimum size
            for (var i = 0; i < myScriptPanel.children.length; i++) {
                myScriptPanel.children[i].minimumSize = myScriptPanel.children[i].size;
            }
        }

        if (myScriptPanel != null && myScriptPanel instanceof Window) {
            myScriptPanel.center();

            myScriptPanel.minimumSize = myScriptPanel.size;
            myScriptPanel.onResizing = myScriptPanel.onResize = function () { this.layout.resize() };

            myScriptPanel.show();
        }
    }
    myScript(this);
}

function markSources() {
    app.beginUndoGroup("Mark Sources");
    var prj = app.project;
    var thisComp = prj.activeItem;

    var sources = [];

    //Pra cada layer selecionada, busca a source e adiciona o corte a um array contendo todos os cortes da source
    for (var i = 0; i < thisComp.selectedLayers.length; i++) {
        var tempLayer = thisComp.selectedLayers[i];
        var sourceInfo = sourceInOut(tempLayer, thisComp);
        var sourceIndex = arrHasSource(sources, sourceInfo.source);

        if (!sourceIndex) {
            sources.push(sourceInfo);
            sourceIndex = sources[sources.length - 1];
        }

        manageCuts(sourceInfo.cuts[0], sourceIndex.cuts)
    }

    //Pra todas as sources do array, duplica a camada e corta de acordo com o array de cortes
    for (var i = sources.length - 1; i >= 0; i--) {
        var s = sources[i].source;
        if (s.numLayers > 1) {
            for (var i = s.numLayers - 1; i >= 1; i--) {
                s.layer(i).remove();
            }
        }
        for (var j = sources[i].cuts.length - 1; j >= 0; j--) {
            var newLayer = s.layer(s.numLayers).duplicate();
            newLayer.inPoint = sources[i].cuts[j][0];
            newLayer.outPoint = sources[i].cuts[j][1];
        }
    }

    app.endUndoGroup();

    //Verifica se o novo corte deve ser adicionado aos cortes ou se ele modifica algum já existente
    function manageCuts(newCut, cuts) {
        if (equals(newCut, cuts) == false) {
            var c = [contains(newCut[0], cuts), contains(newCut[1], cuts)];
            var d;
            switch (true) {
                case c[0] != -1 && c[1] != -1: cuts[c[0]][1] = cuts[c[1]][1]; d = cuts[c[0]]; break;
                case c[0] != -1 && c[1] == -1: cuts[c[0]][1] = newCut[1]; d = cuts[c[0]]; break;
                case c[0] == -1 && c[1] != -1: cuts[c[1]][0] = newCut[0]; d = cuts[c[1]]; break;
                case c[0] == -1 && c[1] == -1: cuts.push(newCut); d = newCut; break;
            }

            for (var i = cuts.length - 1; i >= 0; i--) {
                if (fullInside(cuts[i], d)) { cuts.splice(i, 1) };
            }

            cuts.sort(function (a, b) {
                return a[0] - b[0];
            })
        } else {
            return
        }

        function contains(p, arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i][0] < p && p < arr[i][1]) { return i }
            }
            return -1
        }

        function fullInside(b, a) {
            return (b[0] > a[0] && b[1] <= a[1])
        }
    }

    function equals(p, arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (p == arr[i]) { return true }
        }
        return false
    }

    //Verifica se a source em questão já está no array de sources
    function arrHasSource(arr, s) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (s == arr[i].source) { return arr[i] }
        }
        return false
    }

    //Retorna um objeto com a source da layer e seu verdadeiro in e out
    function sourceInOut(layer, comp) {
        var min = 0;
        var max = 0;

        if (layer.timeRemapEnabled) {
            var tr = layer.property('ADBE Time Remapping');
            var start, end;

            if (layer.stretch < 0) {
                start = clampTime(layer.outPoint, comp);
                end = clampTime(layer.inPoint, comp);
            } else {
                start = clampTime(layer.inPoint, comp);
                end = clampTime(layer.outPoint, comp);
            }

            for (var i = start; i < end; i += comp.frameDuration) {
                var temp = tr.valueAtTime(i, false);
                if (min == 0 || temp < min) { min = temp };
                if (max == 0 || temp > max) { max = temp };
            }
        } else {
            min = ((layer.inPoint - layer.startTime) * 100 / layer.stretch);
            max = ((layer.outPoint - layer.startTime) * 100 / layer.stretch);
        }

        return { source: layer.source, cuts: [[min, max]] }
    }

    //Analisa somente os tempos dentro da duração da comp
    function clampTime(t, comp) {
        if (t > comp.duration) return comp.duration
        if (t < 0) return 0
        return t
    }
}

