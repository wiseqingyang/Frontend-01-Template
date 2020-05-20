const stack = [{
    element: 'document',
    children: []
}];

let currentToken = null;

const EOF = Symbol("EOF");

function emitToken(token) {
    console.log(token);
}

function data(c) {
    if (c == "<")
        return tagOpen;
    else if (c === EOF) {
        emitToken({
            type: 'EOF',
        })
        return;
    } else
        // emitToken({
        //     type: 'text',
        //     content: c,
        // })
    return data;
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
    } else if (c === ">")
        return;
    else
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
    else if (c.match(/^[\t\n\f]$/))
        return beforeAttrName;
    else
        return tagName;
}

function beforeAttrName(c) {
    if (c.match(/^[\t\n\f]$/))
        return beforeAttrName;
    else if (c === '>')
        return data;
    else if (c === "/")
        return selfClosingStartTag;
    else
        return beforeAttrName;
}

function selfClosingStartTag(c) {
    if (c === ">") {
        currentToken.isSelfClosing = true;
        emitToken(currentToken);
        return data;
    } else if (c.match(/^[\t\n\f]$/))
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
    return stack[0];
}