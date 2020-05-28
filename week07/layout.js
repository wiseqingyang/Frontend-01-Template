function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/) || element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}

function layout(element) {
    if (!element.computedStyle) return;

    let elementStyle = getStyle(element);

    if (elementStyle.display != 'flex') return;

    const items = element.children.filter(item => item.type !== 'text');
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
        style.alignItems = 'stretch';
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
        crossSize, crossStart, crossEnd, crossSign, crossBase;

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
        let tmp = crossStart;
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
        for (let i = 0; i < items.length; i++) {
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
    flexLine.mainSpace = mainSpace;
    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] != undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = (style[mainSize] - mainSpace) / style[mainSize];
        let mainCurrent = mainBase;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] /= scale;
            itemStyle[mainStart] = mainCurrent;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            mainCurrent = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(function (items) {
            let mainSpace = items.mainSpace;

            let totalFlex = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);

                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    totalFlex += itemStyle.flex;
                }
            }

            if (totalFlex > 0) {
                let mainCurrent = mainBase;

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = itemStyle.flex / totalFlex * mainSpace;
                    }
                    itemStyle[mainStart] = mainCurrent;
                    itemStyle[mainEnd] = mainCurrent + mainSign * itemStyle[mainSize];
                    mainCurrent = itemStyle[mainEnd];
                }
            } else {
                let mainCurrent = mainBase;
                let step = 0;
                if (style.justifyContent === 'flex-start') {
                    mainCurrent = mainBase;
                } else if (style.justifyContent === 'flex-end') {
                    mainCurrent = mainBase + mainSign * mainSpace;
                } else if (style.justifyContent === 'center') {
                    mainCurrent = mainBase + mainSign * mainSpace / 2;
                } else if (style.justifyContent === 'space-between') {
                    mainCurrent = mainBase;
                    step = mainSpace / ( items.length - 1 ) * mainSign;
                } else if (style.justifyContent === 'space-around') {
                    step = mainSign / items.length * mainSign;
                    mainCurrent = mianBase + step / 2;
                }
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    itemStyle[mainStart] = mainCurrent;
                    itemStyle[mainEnd] = mainCurrent + mainSign * itemStyle[mainSize];
                    mainCurrent = step + itemStyle[mainEnd];
                }
            }
        })
    }
    
    if (!style[crossSize]) {
        crossSpace = 0;
        style[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            style[crossSize] += flexLines[i].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;

    let step;
    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    } else if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    } else if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    } else if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    } else if (style.alignContent === 'space-around') {
        step = crossSapce / (flexLines.length);
        crossBase += crossSign * step / 2;
    } else if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(function (items) {
        let lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || style.alignItems;

            if (!itemStyle[crossSize]) {
                itemStyle[crossSize] =  align === 'stretch' ? lineCrossSize : 0;
            }
            if (align === 'flex-start') {
                itemStyle[corssStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * itemStyle[crossSize];
            }
            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign - itemStyle[crossSize];
            }
            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = crossBase + crossSign * itemStyle[crossSize];
            }
            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * (itemStyle[crossSize] ? itemStyle[crossSize] : lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    })
}

module.exports = layout;