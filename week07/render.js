const images = require("images");


function render(viewport, element) {
    console.log("element ", element.tagName)
    var img = images(element.style.width, element.style.height);

    if (element.style['background-color']) {
        let color = element.style["background-color"] || 'rgb(0,0,0)';
        color = color.replace(/\s*/g, '');
        color.match(/rgb\((\d+),(\d+)\s?,(\d+)\)/);
        img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1);
        viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }

    if (element.children) {
        for (let child of element.children) {
            render(viewport, child);
        }
    }
}

module.exports = render;