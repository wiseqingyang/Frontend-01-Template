const stack = [{
    element: 'document',
    children: []
}];

let currentToken = null;
let currentAttr = null;
let currentTextNode = null;

const EOF = Symbol("EOF");

function emitToken(token) {
    let top = stack[stack.length - 1];
    if (token.type === 'startTag') {
        let element = {
            tagName: '',
            children: [],
            attrs: [],
        };
        element.tagName = token.tagName;

        for (let p in token) {
            if (p != 'tagName' && p != 'type') {
                element.attrs.push({
                    name: p,
                    value: token[p],
                });
            }
        }

        top.children.push(element);
        // element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;

    } else if (token.type === "endTag") {
        if (token.tagName !== top.tagName) {
            throw `not closing tag ${top.tagName} current ${token.tagName}`;
        } else {
            stack.pop()
        }
        currentTextNode = null;
    } else if (token.type === 'text') {
        if (!currentTextNode) {
            currentTextNode = {
                type: 'text',
                content: '',
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function data(c) {
    if (c == "<")
        return tagOpen;
    else if (c === EOF) {
        emitToken({
            type: 'EOF',
        })
        return;
    } else if (c === '\n') {
        return data;
    } else {
        emitToken({
            type: 'text',
            content: c,
        })
        return data;
    }
}

function tagOpen(c) {
    if (c === "/")
        return endTagOpen;
    else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c);
    } else
        return;
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: '',
        }
        return tagName(c);
    } else if (c === ">") {
        //emitToken(currentToken);
        return data;
    } else
        return;
}

function tagName(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c === '>') {
        emitToken(currentToken);
        currentToken = null;
        return data;
    } else if (c === '/')
        return selfClosingStartTag;
    else if (c.match(/^[\t\n\f ]$/))
        return beforeAttrName;
    else
        return tagName;
}

function beforeAttrName(c) {
    if (c.match(/^[\t\n\f ]$/))
        return beforeAttrName;
    else if (c === '>') {
        currentToken[currentAttr.name] = currentAttr.value;
        return data;
    }
    else if (c === "/")
        return selfClosingStartTag;
    else {
        currentAttr = {
            name: '',
            value: '',
        }
        return attrName(c);
    }
}

function attrName(c) {
    if (c === "=") {
        return beforeAttrValue;
    } else if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttrName(c);
    } else {
        currentAttr.name += c;
        return attrName;
    }
}

function beforeAttrValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttrValue;
    } else if (c === '"') {
        return doubleQuotedAttrValue;
    } else if (c === "'") {
        return singleQuotedAttrValue;
    } else {
        return unQuotedAttrValue(c);
    }
}

function doubleQuotedAttrValue(c) {
    if (c === '"') {
        currentToken[currentAttr.name] = currentAttr.value;
        return afterQuotedAttrValue;
    } else if (c === EOF) {

    } else {
        currentAttr.value += c;
        return doubleQuotedAttrValue;
    }
}

function singleQuotedAttrValue(c) {
    if (c === "'") {
        currentToken[currentAttr.name] = currentAttr.value;
        return afterQuotedAttrValue;
    } else if (c === EOF) {

    } else {
        currentAttr.value += c;
        return singleQuotedAttrValue;
    }
}

function unQuotedAttrValue(c) {
    if (c === '/') {
        currentToken[currentAttr.name] = currentAttr.value;
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttr.name] = currentAttr.value;
        emitToken(currentToken);
        return data;
    } else if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttr.name] = currentAttr.value;
        return beforeAttrName;
    } else {
        currentAttr.value += c;
        return unQuotedAttrValue;
    }
}

function afterQuotedAttrValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttrName;
    } else if (c === '>') {
        currentToken[currentAttr.name] = currentAttr.value;
        emitToken(currentToken);
        return data;
    } else if (c === '/') {
        currentToken[currentAttr.name] = currentAttr.value;
        return selfClosingStartTag;
    }
}

function afterAttrName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttrName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttr.name] = currentAttr.value;
        emitToken(currentToken);
        return data;
    } else {
        currentToken[currentAttr.name] = currentAttr.value;
        currentAttr = {
            name: '',
            value: ''
        }
        return attrName(c);
    }
}

function selfClosingStartTag(c) {
    if (c === ">") {
        currentToken.isSelfClosing = true;
        emitToken(currentToken);
        return data;
    } else if (c.match(/^[\t\n\f ]$/))
        return selfClosingStartTag;
    else
        return;
}


module.exports.parseHTML = function parseHTML(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    console.log(JSON.stringify(stack[0]));
    return stack[0];
}