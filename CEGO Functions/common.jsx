//Retorna uma string com a data simplificada do dia
function timeStamp() {
    var d = new Date(Date.now());
    var dDay = d.getDate().toString();
    var dMonth = (d.getMonth() + 1).toString();
    dMonth = dMonth.length < 2 ? "0" + dMonth : dMonth;
    var dYear = d.getFullYear().toString();
    return dYear + dMonth + dDay;
}

//Verifica se a pasta já tem uma pasta _OLD
function oldFolder(folder) {
    for (var i = 1; i <= folder.numItems; i++) {
        if (folder.item(i).name == "_OLD") {
            return folder.item(i);
        }
    }
    return folder.items.addFolder("_OLD");
}