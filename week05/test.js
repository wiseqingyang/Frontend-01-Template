let set = new Set();
let globalProperties = [
    "Infinity",
    "NaN",
    "undefined",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "ArrayBuffer",
    "Boolean",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "Float32Array",
    "Float64Array",
    "Function",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Map",
    "Number",
    "Object",
    "Promise",
    "Proxy",
    "RangeError",
    "ReferenceError",
    "RegExp",
    "Set",
    "SharedArrayBuffer",
    "String",
    "Symbol",
    "SyntaxError",
    "TypeError",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "URIError",
    "WeakMap",
    "WeakSet",
    "Atomics",
    "JSON",
    "Math",
    "Reflect",
];
var queue = [];

for (var p of globalProperties) {
    queue.push({
        path: [p],
        object: this[p],
    })
}

while (queue.length) {
    current = queue.shift();
    if (set.has(current.object))
        continue;
    set.add(current.object);

    console.log(current);
    if (!(current.object instanceof Object))
        continue;
    for (let p in Object.getOwnPropertyDescriptors(current.object)) {
        let property = Object.getOwnPropertyDescriptor(current.object, p);
        if (property.hasOwnProperty("value") && property.value instanceof Object) {
            queue.push({
                path: current.path.concat([p]),
                object: property.value
            });
        }
        if (property.hasOwnProperty("get")) {
            queue.push({
                path: current.path.concat([p]),
                object: property.get
            })
        }
        if (property.hasOwnProperty("set")) {
            queue.push({
                path: current.path.concat([p]),
                object: property.set
            })
        }
    }
}