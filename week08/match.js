// 目前只有复合选择器
function match(selector, element) {
    if (selector.length <= 0) {
        return false;
    }

    let arr = selector.split(',').map(s => s.trim());
    for (let i = 0; i < arr.length; i++) {
        if (matchComplexSel(arr[i], element)) {
            return true;
        }
    }
    return false;
}

function matchComplexSel(selector, element) {
    let combineSels = divideComplexSel(selector.trim()).reverse();
    return matchComplexSeletor(combineSels, element);
}

function matchComplexSeletor(combineSels, element) {
    // console.log('matchComplex Sel', combineSels, element);
    let currEle = element;
    let match = true;
    for (let idx = 0; idx < combineSels.length; idx++) {
        let combineSel = combineSels[idx]
        if (!currEle) {
            match = false;
            console.log("currELe is null");
            break;
        }
        if (!combineSel.type || idx == 0) {
            let ret = matchCombineSel(combineSel.selector, currEle);
            if (!ret) {
                match = false;
                console.log("currSelector ", combineSel, currEle);
                break;
            }
        } else if (combineSel.type === 'Decendant') {
            let subMatch = false;
            while (currEle = currEle.parentElement) {
                if (matchCombineSel(combineSel.selector, currEle)) {
                    subMatch = true;
                    break;
                }
            }
            if (!subMatch) {
                match = false;
                console.log("currSelector ", combineSel.type);
                break;
            }
        } else if (combineSel.type === 'Child') {
            currEle = currEle.parentElement
            let ret = matchCombineSel(combineSel.selector, currEle);
            if (!ret) {
                match = false;
                console.log("currSelector ", combineSel.type);
                break;
            }
        } else if (combineSel.type === 'AdjacentSubling') {
            let index = getNodeIndex(currEle);
            if (index <= 0 || !matchCombineSel(combineSel.selector, currEle = currEle.parentElement.children[index - 1])) {
                match = false;
                console.log("currSelector ", combineSel, index);
                break;
            }
        } else if (combineSel.type === 'AfterSubling') {
            let index = getNodeIndex(currEle);
            let totalMatch = false;
            for (let i = 0; i < index; i++) {
                if (matchCombineSel(combineSel.selector, currEle.parentElement.children[i])) {
                    // let newSelectors = combineSels.slice(0, idx + 1);
                    // newSelectors[newSelectors.length - 1].type = null;
                    if (matchComplexSeletor(combineSels.slice(idx), currEle.parentElement.children[i])) {
                        totalMatch = true;
                        break;
                    }
                }
            }
            match = totalMatch;
            break;
        } else {
            throw 'unexpected selector type';
        }
    }
    return match;
}

function getNodeIndex(element) {
    let arr = element.parentElement.children;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === element)
            return i;
    }
    return -1;
}

function divideComplexSel(selector) {
    let selectors = [];
    let combineSel = {
        selector: '',
        type: null,
    };
    for (let c of selector) {
        if (c === ' ') {
            if (!combineSel.type)
                combineSel.type = 'Decendant';
        } else if (c === '>') {
            combineSel.type = 'Child';
        } else if (c === '~') {
            combineSel.type = 'AfterSubling';
        } else if (c === '+') {
            combineSel.type = 'AdjacentSubling';
        } else {
            if (combineSel.type) {
                selectors.push(combineSel);
                combineSel = {
                    selector: c,
                    type: null,
                }
            } else {
                combineSel.selector += c;
            }
        }
    }
    if (!combineSel.type)
        selectors.push(combineSel);
    else
        throw 'invilad selector';
    return selectors;
}

function matchCombineSel(selector, element) {
    let selArr = splitSelector(selector);
    let isMatch = true;
    for (let sel of selArr) {
        if (!matchSimpleSel(sel, element)) {
            isMatch = false;
            // console.log(`${sel} dismatch element ${element}`);
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
        return element.attributes.id && element.attributes.id.value === selector.replace('#', '');
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