function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString.match(/px$/) || element.style[prop].toString.match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}

function layout(element) {
    if (!element.computedStyle) return;

    let elementStyle = getStyle(element);

    if (elementStyle.display != 'flex') return;

    const items = element.children.filter(item => item.type === 'element');
    items.sort((arg1, arg2) => {
        return (arg1.order || 0) > (arg2.order || 0);
    })

    let style = elementStyle;

    ['width', 'height'].forEach(prop => {
        if (style[prop] == 'auto' || style[prop] === '') {
            style[prop] = null;
        }
    });

    if (!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row';
    if (!style.alignItems || style.alignItems === 'auto')
        style.flexDirection = 'stretch';
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crpssSign, crossBase;

    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexDirection === 'row-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        var tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = +1;
    }

    let isAutoMainSize = false;

    if (style[mainSize] == null || style[mainSize] == (void 0)) {
        style[mainSize] = 0;
        for (var i = 0; i < items.length; i++) {
            let itemStyle = getStyle(items[i]);
            if (itemStyle[mainSize] !== null && itemStyle[mainSize] !== (void 0)) {
                style[mainSize] += itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }


    let flexLine = [];
    let flexLines = [flexLine];
    let mainSpace = style[mainSize];
    let crossSpace = 0;

    for (let item of items) {
        let itemStyle = getStyle(item);
        if (itemStyle.flex) {
            flexLine.push(item)
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (!itemStyle[crossSize]) {
                crossSpace = Math.max(itemStyle[crossSize], crossSpace);
            }
            flexLine.push(item)
        } else {
            itemStyle[mainSize] = Math.min(itemStyle[mainSize], style[mainSize]);
            if (itemStyle[mainSize] > mainSpace) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item)
            }
            if (!itemStyle[crossSize]) {
                crossSpace = Math.max(itemStyle[crossSize], crossSpace);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }
}

module.exports = layout;