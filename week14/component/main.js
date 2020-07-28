function create(Cls, attribute, ...children) {
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

    for (let child of children) {
        if (typeof child == 'string') {
            child = new TextNode (child);
        }
        cls.appendChild(child);
    }
    return cls;
}

class TextNode {
    constructor(text) {
        this.root = document.createTextNode(text);
    }

    mountTo(node) {
        node.appendChild(this.root);
    }
}

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
        this.render().mountTo(node);
        for (let child of this.children) {
            this.slot.appendChild(child);
        }
    }
}

class Wrapper {
    constructor(type) {
        this.root = document.createElement(type);
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
        this.render().mountTo(node)
        for (let child of this.children) {
            this.slot.appendChild(child);
        }
    }
}

var component = <Cls id="a" style="width:100px;height:100px;background-color:red;">
    <Cls />
        <Cls />
        </ Cls>;
component.mountTo(document.body);
console.log(component);
// component.setAttribute('id', 'b');