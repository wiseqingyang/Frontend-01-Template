export function create(Cls, attribute, ...children) {
    var cls;
    if (typeof Cls == 'string') {
        cls = new Wrapper(Cls);
    } else {
        cls = new Cls();
    }

    for (var a in attribute) {
        // cls[a] = attribute[a];
        cls.setAttribute(a, attribute[a]);
    }

    const visit = children => {
        for (let child of children) {
            if (typeof child == 'string') {
                child = new TextNode (child);
            } else if (child instanceof Array) {
                visit(child);
                continue;
            }
            cls.appendChild(child);
        }
    }

    visit(children);
    
    return cls;
}

export class TextNode {
    constructor(text) {
        this.root = document.createTextNode(text);
    }

    mountTo(node) {
        node.appendChild(this.root);
    }
}

/*
class Cls {
    constructor(config) {
        this.config = config;
        this.root = document.createElement('div');
        this.children = [];
    }

    // property
    set id(v) {
        console.log("set::id", v);
    }

    // attribute
    setAttribute(key, value) {
        this.root.setAttribute(key, value);
    }

    // children
    appendChild(child) {
        console.log(child);
        this.children.push(child);
    }

    render() {
        return (
            <article>
                <header> i am header</header>
                {this.slot}
                <footer>i am footter </footer>
            </article>
        )
    }

    mountTo(node) {
        this.slot = <div></div>
        for (let child of this.children) {
            this.slot.appendChild(child);
        }
        this.render().mountTo(node);
    }
}*/

export class Wrapper {
    constructor(type) {
        this.root = document.createElement(type);
        this.children = [];
    }

    // property
    set id(v) {
        console.log("set::id", v);
    }

    get style() {
        return this.root.style;
    }

    // attribute
    setAttribute(key, value) {
        this.root.setAttribute(key, value);
    }

    // children
    appendChild(child) {
        this.children.push(child);
    }
    addEventListener() {
        this.root.addEventListener(...arguments)
    }

    mountTo(node) {
        for (let child of this.children) {
            console.log(child);
            child.mountTo(this.root);
        }
        node.appendChild(this.root);    
    }
}