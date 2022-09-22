function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    this.container = container;
    this.id = getRandomInt(0, 100);
    this.callbacks = [];
    const getItem = (key, content, addon = false) => {
        const el = $("<li data-key='" + key + "'></li>")
        const icon = $("<div class='icon'><i class='" + content["icon"] + "'></i></div>")
        el.append(icon)
        el.append("<span>" + key + "</span>");
        if(addon) {
            el.attr("data-addon='true'");
        }
        return el
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
            _this.structure[$(this).attr("data-key")]["callback"]();
            _this.hide();
        })
        $(this.container).contextmenu(function(e) {
            _this.hide();
            const dom = _this.dom;
            const x = e.clientX;
            const y = e.clientY;
            for(key in _this.callbacks) {
                const callback = _this.callbacks[key];
                if($(key).is(e.target) || $(key).has(e.target).length > 0) {
                    callback($(e.target));
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
        console.log(el)
        this.callbacks[el] = callback
    }
    this.dom = this.build()
    this.attach();
}