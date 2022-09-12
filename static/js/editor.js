function extractExtension(name) {
    if(name.split("").indexOf(".") == -1) {
        return "";
    }
    let split = name.split(".")
    return split[split.length - 1];
}
function createDirectoryDom(name, folder = false, subdirCount = 0) {
    const icons = {
        "html": "fa-brands fa-html5",
        "css": "fa-brands fa-css3",
        "js": "fa-brands fa-square-js",
        "folder": "fa-solid fa-folder",
        "code": "fa-regular fa-file-code"
    }
    const extension = extractExtension(name.toLowerCase());
    const type = folder ? "folder" : "file";
    console.log(type)
    let icon = icons["code"];
    if(folder) {
        icon = icons["folder"];
    } else if(extension in icons) {
        icon = icons[extension];
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
    display.append("<i class='" + icon + "'></i>")
    display.append("<span>" + name + "</span>")
    parent.append(display);
    if(folder) {
        const subdir = $("<ul class='folder-list'></ul>")
        parent.append(subdir);
    }
    return parent;
} 

$(function() {
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
    $("#sidebar").on("click", ".file-display",function() {
        if($(this).parent().attr("data-type") == "folder") {
            $(this).parent().toggleClass("open")
            $(this).children("i").remove();
            if($(this).parent().hasClass("open")) {
                $(this).prepend('<i class="fa-regular fa-folder"></i>')
            } else {
                $(this).prepend('<i class="fa-solid fa-folder"></i>')
                //Close all children folders
                const childs = $(this).parent().find(".folder");
                childs.removeClass("open")
                childs.children(".file-display").children("i").remove();
                childs.children(".file-display").prepend('<i class="fa-solid fa-folder"></i>')
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