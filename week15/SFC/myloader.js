var paser = require('./parser');

module.exports = function(source, map) {

    let tree = paser.parseHTML(source);
    let tempalte = null;
    let script = null;

    for (let node of tree.children) {
        if (node.tagName === 'template') {
            tempalte = node.children.filter(c => c.type!=='text')[0];
        }
        if (node.tagName === 'script') {
            script = node;
        }
    }
    let createCode = '';

    let visit = (node) => {
        if(node.type === 'text') {
            return JSON.stringify(node.content);
        }
        let attr = {};
        for (let attribute of node.attributes) {
            attr[attribute.name] = attribute.value;
        }
        let children = node.children.map(child => visit(child));
        return `create('${node.tagName}', ${JSON.stringify(attr)}, ${children})`
    }
    console.log(visit(tempalte));

    return `import { create } from './createElement.js';
    export class Carousel {
        render(){
            return ${visit(tempalte)}
        }
        mountTo(node) {
            this.render().mountTo(node);
        }
    }`;
}