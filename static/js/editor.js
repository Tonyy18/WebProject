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

function getElementPath(el) {
    const parents = el.parents("li");
    let path = "";
    for(let a = 0; a < parents.length; a++) {
        path = $(parents[a]).attr("data-name") + ">" + path
    }
    path += el.attr("data-name")
    return path;
}

function hideRenaming() {
    const els = $("#sidebar [data-editing='true']");
    for(let a = 0; a < els.length; a++) {
        const el = $(els[a]);
        const display = $($(el).find(">.file-display"));
        const value = $.trim(display.find("input").val());
        if(value == "") {
            el.addClass("error");
            continue;
        }
        el.removeClass("error");
        el.removeClass("active");
        el.removeAttr("data-editing");
        display.find("form").remove();
        display.find("span").html(value).show();
    }
}

function renameElement(el) {
    el.addClass("active");
    const display = $(el).find(">.file-display");
    const path = getElementPath(el);
    const split = path.split(">")
    const editElement = $('<form></form>')
    editElement.submit(function() {
        $(this).removeClass("error");
        hideRenaming();
        return false;
    })
    const input = $('<input type="text" value="' + split[split.length - 1] + '">')
    editElement.append(input)
    $(display).find("span").hide();
    $(display).append(editElement);
    $(el).attr("data-editing", true);
    input.focus().select();
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
    const parent = $("<li class='" + type + "' data-type='" + type + "' data-name='" + name + "'></li>");
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
    $(document).click(function(e) {
        const isElement = !$("#sidebar [data-editing='true']").is(e.target) && $("#sidebar [data-editing='true']").has(e.target).length === 0;
        const isContextMenu = !$(contextmenu.dom).is(e.target) && $(contextmenu.dom).has(e.target).length === 0
        if(isElement && isContextMenu) {
            hideRenaming();
        }
    })
    let currentMenuElement = null;
    const contextmenu = new ContextMenu({
        "Rename": {
            "icon": Icons.solidPen,
            "callback": () => renameElement(currentMenuElement)
        },
        "Delete": {
            "icon": Icons.solidTrash,
            "callback": function() {}
        }
    }, $("#sidebar"));
    contextmenu.onElement("#sidebar [data-type='file'] > .file-display", (el) => {
        currentMenuElement = $(el).closest("li");
    })
    contextmenu.onElement("#sidebar [data-type='folder'] > .file-display", (el) => {
        currentMenuElement = $(el).closest("li");
        contextmenu.prependItem({
            "Add folder": {
                "icon": Icons.solidFolder,
                "callback": function() { console.log("Addon 1") }
            },
            "Add file": {
                "icon": Icons.regularCode,
                "callback": function() { console.log("Addon 2") }
            }
        })
    })
    contextmenu.onElement("#sidebar .dir-list", (el) => {
        contextmenu.prependItem({
            "Add folder": {
                "icon": Icons.solidFolder,
                "callback": function() { console.log("Addon 3") }
            },
            "Add file": {
                "icon": Icons.regularCode,
                "callback": function() { console.log("Addon 4") }
            }
        })
    }, false);
    contextmenu.on("show", function() {
        hideRenaming();
    })
    const sidebar = $("#sidebar");
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