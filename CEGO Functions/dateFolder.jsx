app.beginUndoGroup("Today Folder");
var prj = app.project;
var active = prj.activeItem;
var sel = prj.selection;

var newFolder = prj.items.addFolder(timeStamp());

if (sel.length > 1) {
    for (var i = 0; i < sel.length; i++) {
        if (sel[i].parentFolder != sel[0].parentFolder) {
            break;
        }
        newFolder.parentFolder = sel[0].parentFolder;
    }
    for (var i = 0; i < sel.length; i++) {
        sel[i].parentFolder = newFolder;
    };

} else if (sel.length == 1) {
    newFolder.parentFolder = active.parentFolder;
    active.parentFolder = newFolder;
}

app.endUndoGroup();

function timeStamp() {
    var d = new Date(Date.now());
    var dDay = d.getDate().toString();
    var dMonth = (d.getMonth() + 1).toString();
    dMonth = dMonth.length < 2 ? "0" + dMonth : dMonth;
    var dYear = d.getFullYear().toString();
    return dYear + dMonth + dDay;
}

function dateFolder() {

}

