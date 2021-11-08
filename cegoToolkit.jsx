#include '../CEGO Functions/psdText.jsx';
#include '../CEGO Functions/consolidate.jsx';
#include '../CEGO Functions/offset_layers.jsx';
#include '../CEGO Functions/clean_fx.jsx';
#include '../CEGO Functions/extractMask.jsx';
#include '../CEGO Functions/markSources.jsx';
#include '../CEGO Functions/dateFolder.jsx';

{
    function myScript(thisObj) {
        function myScript_buildUI(thisObj) {
            var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "CEGO Toolkit", undefined, { resizeable: true, closeButton: true });

            res = "group{\
                orientation:'row',\
                alignChildren:'top',\
                gBtns:Group{\
                    size:[20,100],\
                    orientation:'column',\
                    alignChildren:'top',\
                    spacing:6,\
                    btnPSD:Button{size:[110,30],text:'PSD Text'},\
                    btnConsolidate:Button{size:[110,30],text:'Consolidate'},\
                    btnCleanFX:Button{size:[110,30],text:'Clean FX'},\
                    btnExtractMask:Button{size:[110,30],text:'Mask to Shape'},\
                    btnMarkSources:Button{size:[110,30],text:'Mark Sources'},\
                    gOffset:Group{orientation:'row',spacing:2,alignChildren:'center',\
                    offName:StaticText{text:'Offset Layers'}, offLeft:Button{size:[20,20],text:'-',value:-1},offRight:Button{size:[20,20],text:'+',value:1}}},\
                gBtns2:Group{\
                    size:[20,100],\
                    orientation:'column',\
                    alignChildren:'top',\
                    btnDateFolder:Button{size:[110,30],text:'Today Folder'},\
                }}}";

            panelGrp = panel.add(res);
            panelGrp.layout.layout(true);
            panel.layout.layout(true);

            panelGrp.gBtns.btnPSD.onClick = psdText;
            panelGrp.gBtns.btnConsolidate.onClick = consolidate;
            panelGrp.gBtns.btnCleanFX.onClick = cleanFx;
            panelGrp.gBtns.btnExtractMask.onClick = extractMask;
            panelGrp.gBtns.btnMarkSources.onClick = markSources;
            panelGrp.gBtns2.btnDateFolder.onClick = dateFolder;
            panelGrp.gBtns.gOffset.offLeft.onClick = offset;
            panelGrp.gBtns.gOffset.offRight.onClick = offset;

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