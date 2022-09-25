
function onFileContextmenu(dom) {
    console.log("FILE")
}

function onFolderContextmenu(dom) {
    console.log("FOLDER")
}

function createDirectoryDom(name, folder = false, subdirCount = 0) {
    const extension = extractExtension(name.toLowerCase());
    const type = folder ? "folder" : "file";
    let icon = Icons.regularCode;
    if(folder) {
        icon = Icons.solidFolder;
    } else if(Icons.hasOwnProperty(extension)) {
        icon = Icons[extension];
    }
    const paddingLeft = 20;
    const folderIndentation = paddingLeft + 15 * subdirCount
    const parent = $("<li class='" + type + "' data-type='" + type + "'></li>");
    const display = $("<div class='file-display'></div>")
    if(subdirCount > 0) {
        display.css({
            "padding-left": folderIndentation
        })
    }
    display.append("<div class='icon'><i class='" + icon + "'></i></div>")
    display.append("<span>" + name + "</span>")
    parent.append(display);
    if(folder) {
        const subdir = $("<ul class='folder-list'></ul>")
        parent.append(subdir);
    }
    return parent;
} 

$(function() {
    const contextmenu = new ContextMenu({
        "Rename": {
            "icon": Icons.solidPen,
            "callback": function() {}
        },
        "Delete": {
            "icon": Icons.solidTrash,
            "callback": function() {}
        }
    }, $("#sidebar"));
    contextmenu.on("#sidebar .file-display", (el) => {
        contextmenu.clear();
    })
    contextmenu.on("#sidebar [data-type='folder']", (el) => {
        contextmenu.prependItem({
            "Add folder": {
                "icon": Icons.solidFolder,
                "callback": function() { console.log("Addon 1") }
            },
            "Add file": {
                "icon": Icons.regularCode,
                "callback": function() { console.log("Addon 1") }
            }
        })
    })
    const sidebar = $("#sidebar");
    const directory = {
        "index.html": "html",
        "style.css": "css",
        "static": {
            "js": {
                "main.js": "js",
                "folder": {
                    "test": "test",
                    "folder": {
                        "moi": "moi"
                    },
                    "kansio": {}
                },
                "kansio": {}
            }
        },
        "requirements.txt": "django"
    }
    sidebar.on("click", ".file-display",function() {
        if($(this).parent().attr("data-type") == "folder") {
            $(this).parent().toggleClass("open")
            $(this).find("i").remove();
            if($(this).parent().hasClass("open")) {
                $(this).children(".icon").append('<i class="fa-regular fa-folder"></i>')
            } else {
                $(this).children(".icon").append('<i class="fa-solid fa-folder"></i>')
                //Close all children folders
                const childs = $(this).parent().find(".folder");
                childs.removeClass("open")
                childs.children(".file-display").find("i").remove();
                childs.children(".file-display").children(".icon").append('<i class="fa-solid fa-folder"></i>')
            }
        }
    })

    function displayDirectory(dir, dom = $("#sidebar .dir-list"), subdirCount = 0, subdir = false) {
        if(subdir) {
            subdirCount++;
        }
        for(key in dir) {
            let dirDom;
            if(typeof dir[key] == "object") {
                //folder
                dirDom = createDirectoryDom(key, true, subdirCount)
                displayDirectory(dir[key], $(dirDom).children(".folder-list"), subdirCount, true);
            } else {
                dirDom = createDirectoryDom(key, false, subdirCount);
            }
            dom.append(dirDom);
        }
    }

    displayDirectory(directory);

})