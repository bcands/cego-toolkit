var t, r;

if (app.project.activeItem != null) {
    t.mainSource.file.fsName;
    r = t.split("\\");
};

var w = new Window("palette");
var tree = w.add("treeview", [0, 0, 250, 250], undefined, { multiselect: true });

if (app.project.selection.length > 0) {
    for (var i = 0; i < r.length; i++) {
        if (i == 0) {
            tree[r[i]] = tree.add("node", r[i]);
        } else {
            tree[r[i]] = tree[r[i - 1]].add("node", r[i]);
        };
    }

    // tree.add("node", app.project.selection[0].name);

    expand_node(tree);
}

w.show();

function expand_node(tree) {
    tree.expanded = true;
    var branches = tree.items;
    for (var i = 0; i < branches.length; i++) {
        if (branches[i].type == 'node') {
            expand_node(branches[i]);
        }
    }
}

