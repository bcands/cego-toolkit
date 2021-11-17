function textFormat() {
    app.beginUndoGroup("Text Format");
    var prj = app.project;
    var sel = prj.selection;
    var tempName;

    if (sel.length > 0) {
        for (var i = 0; i < sel.length; i++) {
            tempName = sel[i].name;
            sel[i].name = tempName.replace(/\s/g, "-").toUpperCase();
        }
    } else {
        alert('Nenhum item selecionado para formatar.');
    }

    app.endUndoGroup();
}