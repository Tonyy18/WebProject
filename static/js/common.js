function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Icons {
    static solidFolder = "fa-solid fa-folder"
    static solidPed = "fa-solid fa-pen"
    static solidTrash = "fa-solid fa-trash"
    static regularCode = "fa-regular fa-file-code"
    static html = "fa-brands fa-html5"
    static css = "fa-brands fa-css3"
    static js = "fa-brands fa-square-js"
}

function extractExtension(name) {
    if(name.split("").indexOf(".") == -1) {
        return "";
    }
    let split = name.split(".")
    return split[split.length - 1];
}

function ContextMenu(struct, container) {
    this.structure = struct;
    this.addons = {};
    this.container = container;
    this.id = getRandomInt(0, 100);
    this.callbacks = [];
    const getItem = (key, content, addon = false) => {
        const el = $("<li data-key='" + key + "'></li>")
        const icon = $("<div class='icon'><i class='" + content["icon"] + "'></i></div>")
        el.append(icon)
        el.append("<span>" + key + "</span>");
        if(addon) {
            el.attr("data-addon", "true");
        }
        return el
    }
    this.append = (struct) => {
        this.addons = struct;
        for(key in struct) {
            const item = getItem(key, struct[key], true);
            $(this.dom).find("ul").append(item);
        }
    }
    this.clear = () => {
        $(this.dom).children("ul").children("li[data-addon='true']").remove();
        this.addons = {};
    }
    this.on = (query, struct) => {
        this.callbacks[query] = struct;
    }
    this.build = () => {
        const dom = $("<div class='contextmenu' id='menu-" + this.id + "'></div>")
        const list = $("<ul></ul>")
        for(key in this.structure) {
            list.append(getItem(key, this.structure[key]));
        }
        dom.append(list)
        return dom;
    }
    this.show = () => {
        this.dom.show();
    }
    this.hide = () => {
        this.dom.hide();
    }
    this.attach = () => {
        $("#" + this.id).remove();
        $("body").append(this.dom);
        const _this = this;
        $(document).mousedown(function(e) {
            if(e.which == 1 && !_this.dom.is(e.target) && $(_this.dom).has(e.target).length === 0) {
                _this.hide();
            }
        })
        $(this.dom).on("click", "li", function() {
            let callbackLoc = _this.structure
            if($(this).attr("data-addon") == "true") {
                callbackLoc = _this.addons;
            }
            callbackLoc[$(this).attr("data-key")]["callback"]();
            _this.hide();
        })
        $(this.container).contextmenu(function(e) {
            _this.hide();
            const dom = _this.dom;
            const x = e.clientX;
            const y = e.clientY;
            for(let a = 0; a < _this.callbacks.length; a++) {
                let el = _this.callbacks[a];
                if($(el[0]).is(e.target) || $(el[0]).has(e.target).length > 0) {
                    el[1]($(e.target));
                }
            }
            dom.css({
                "left": x + "px",
                "top": y + "px"
            })
            _this.show();
            return false;
        })
    }
    this.on = (el, callback) => {
        this.callbacks.push([el, callback])
    }
    this.dom = this.build()
    this.attach();
}