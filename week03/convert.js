const strArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
var a = convertStringToNumber('132456')
console.log(a, typeof a)

function convertStringToNumber(string, x = 10) {
    string = string.trim();
    if(string.length == 0) return 0;
    const reg1 = /^0([Bb][01]+|[Oo][0-7]+|[Xx][0-9a-fA-F]+)$/
    const reg2 = /^[+-]?Infinity$/
    const reg3 = /^[+-]?((0|[1-9]\d*)[.](\d+)?|[.]\d+|(0|[1-9]\d*))([Ee][+-]?\d+)?$/;
    if (!(reg1.test(string) || reg2.test(string) || reg3.test(string))) {
        return NaN
    }
    let index = string.indexOf('e');
    index = index == -1 ? string.indexOf('E') : index;
    if (index != -1);
    let ex = string.substring(index + 1, string.length);
    let i = 0;
    let number = 0;
    while(string[i] != '.' && i < string.length) {
        number *= 10;
        number += string[i] - '0';
        i++;
    }
    return number;
}


function isInteger(number) {
    return number == Math.floor(number)
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