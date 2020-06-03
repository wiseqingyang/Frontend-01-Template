// 目前只有复合选择器
function match(selector, element) {
    if (selector.length <= 0) {
        return false;
    }

    return mathchCombineSel(selector, element);
}

function mathchCombineSel(selector, element) {
    let selArr = splitSelector(selector);
    let isMatch = true;
    for (let sel of selArr) {
        if (!matchSimpleSel(sel, element)) {
            isMatch = false;
            break;
        }
    }
    return isMatch;
}

// 简单选择器  除了 namespace |
function matchSimpleSel(selector, element) {
    let first = selector.charAt(0);
    if (first === '*') 
        return true;
    if (first === '#') {
        return element.attributes.id.value === selector.replace('#', '');
    } else if (first === '.') {
        return element.attributes.class.value.split(' ').includes(selector.replace('.', ''));
    } else if (first === '[') {
        let attrArr = selector.replace(/[\[\]]/g, '').split('=');
        let attr = element.attributes[attrArr[0].trim()];
        if (attr) {
            return attrArr[1] ? attrArr[1].trim() === attr.value : true;
        }
        return false;
    } else if (first === ':') {
        // 伪类伪元素 TODO
        return false;
    } else {
        return selector.toLowerCase() === element.tagName.toLowerCase();
    }
}

// 分割复合选择器
function splitSelector(selector) {

    let singleSel = ''
    let selectors = [];
    for (let c of selector) {
        if (singleSel.charAt(0) === '[') {
            singleSel += c;
            if (c === ']') {
                selectors.push(singleSel);
                singleSel = '';
            }
        } else if (c.match(/[\*\.\#\:\[]/)) {
            singleSel.length > 0 && selectors.push(singleSel);
            singleSel = c;
        } else {
            singleSel += c;
        }
    }
    singleSel.length > 0 && selectors.push(singleSel);
    return selectors;
}