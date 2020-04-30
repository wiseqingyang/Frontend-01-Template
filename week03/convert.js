const strArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const numberObj = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'a': 10,
    'A': 10,
    'b': 11,
    'B': 11,
    'c': 12,
    'C': 12,
    'd': 13,
    'D': 13,
    'e': 14,
    'E': 14,
    'f': 15,
    'F': 15,
}

function convertNumberToString(number, x = 10) {

    if (isNaN(number)) return 'NaN';

    if (number == 0) return 0;

    let string = ''
    if (number < 0) {
        string += '-';
        number *= -1;
    }

    if (number === Infinity) {
        return string + 'Infinity';
    }

    let s;
    let ex = -15;
    while (ex++ < 64) {
        s = number / (10 ** ex);
        if (isInteger(s) && !isInteger(s / 10)) {
            let k = getIntegerLength(s);
            let n = ex + k;
            if (n >= k && n <= 21) {
                for (let i = k - 1; i >= 0; i--) {
                    string += strArr[Math.floor(s / (10 ** i)) % 10];
                }
                for (let i = 0; i < n - k; i++) {
                    string += strArr[0];
                }
                return string;
            }
            if (n > 0 && n <= 21) {
                for (let i = k - 1; i >= 0; i--) {
                    string += strArr[Math.floor(s / (10 ** i)) % 10];
                    if (i == k - n) {
                        string += '.'
                    }
                }
                return string;
            }
            if (n > -6 && n <= 0) {
                string += '0.';
                for (let i = 0; i < -n; i++) {
                    string += strArr[0];
                }
                for (let i = k - 1; i >= 0; i--) {
                    string += strArr[Math.floor(s / (10 ** i)) % 10];
                }
                return string;
            }
            if (k == 1) {
                string += strArr[s];
                string += 'e';
                string += (n - 1 > 0 ? '+' : '-');
                string += convertNumberToString(Math.abs(n - 1));
                return string;
            }
            for (let i = k - 1; i >= 0; i--) {
                string += strArr[Math.floor(s / (10 ** i)) % 10];
                if (i == k - 1) {
                    string += '.'
                }
            }
            string += 'e';
            string += (n - 1 > 0 ? '+' : '-');
            string += convertNumberToString(Math.abs(n - 1));
            return string;
        }
    }
}


function convertStringToNumber(string, x = 10) {
    string = string.trim();
    if (string.length == 0) return 0;
    const reg1 = /^0([Bb][01]+|[Oo][0-7]+|[Xx][0-9a-fA-F]+)$/
    const reg2 = /^[+-]?Infinity$/
    const reg3 = /^[+-]?((0|[1-9]\d*)[.](\d+)?|[.]\d+|(0|[1-9]\d*))([Ee][+-]?\d+)?$/;
    if (!(reg1.test(string) || reg2.test(string) || reg3.test(string))) {
        return NaN
    }
    let index = string.indexOf('e');
    index = index == -1 ? string.indexOf('E') : index;
    let eString = '';
    if (index != -1) {
        eString = string.substring(index + 1, string.length);
        string = string.slice(0, index);
    }
    let i = 0;
    let number = 0;
    let digit = 10;
    if (/^0[Bb]/.test(string)) {
        digit = 2;
        string = string.slice(2);
    } else if (/^0[Oo]/.test(string)) {
        digit = 8;
        string = string.slice(2);
    } else if (/^0[Xx]/.test(string)) {
        digit = 16;
        string = string.slice(2);
    }

    while (string[i] != '.' && i < string.length) {
        number *= digit;
        number += numberObj[string[i]];
        i++;
    }
    if (string[i] == '.') {
        let fraction = string.slice(i + 1);
        for (let i = 0; i < fraction.length; i++) {
            let num = numberObj[fraction[i]];
            num *= digit ** (-(i + 1));
            number += num;
        }
    }
    console.log(eString);
    if (eString.length > 0) {
        number *= 10 ** convertStringToNumber(eString);
    }
    return number;
}


function isInteger(number) {
    return number - Math.floor(number) < Number.EPSILON;
}

function getIntegerLength(integer) {
    let length = 0;
    while (++length) {
        if (integer < 10) {
            break;
        }
        integer /= 10;
    }
    return length
}