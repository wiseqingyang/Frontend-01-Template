const net = require('net');
const parser = require("./parser");
const images = require('images');

class Request {
    //method url = host + port + path
    //body k v
    //headers
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/',
            this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded"
        }

        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers["Content-Type"] = "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&")
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}\r\n`
    }
    open(method, url) {

    }
    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port,
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on("data", (data) => {
                parser.receive(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response)
                }
                connection.end();
            });
            connection.on("error", (err) => {
                reject(err);
            })
        })
    }
}

class Response {

}

class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 7;
        this.WAITING_HEADER_VALUE = 3;
        this.WAITING_HEADER_LINE_END = 4;
        this.WAITING_HEADER_BLOCK_END = 5;
        this.WAITING_BODY = 6;

        this.currentState = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
    }
    receive(string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char) {
        if (this.currentState == this.WAITING_STATUS_LINE) {
            if (char === "\r") {
                this.currentState = this.WAITING_HEADER_LINE_END;
            } else {
                this.statusLine += char;
            }
        } else if (this.currentState === this.WAITING_STATUS_LINE_END) {
            if (char === "\n") {
                this.currentState = this.WAITING_HEADER_NAME;
            }
        } else if (this.currentState == this.WAITING_HEADER_NAME) {
            if (char === ":") {
                this.currentState = this.WAITING_HEADER_SPACE;
            } else if (char === "\r") {
                this.currentState = this.WAITING_HEADER_BLOCK_END;
            } else {
                this.headerName += char;
            }
        } else if (this.currentState == this.WAITING_HEADER_SPACE) {
            if (char === " ") {
                this.currentState = this.WAITING_HEADER_VALUE;
            }
        } else if (this.currentState == this.WAITING_HEADER_VALUE) {
            if (char === "\r") {
                this.currentState = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue += char;
            }
        } else if (this.currentState === this.WAITING_HEADER_LINE_END) {
            if (char === "\n") {
                this.currentState = this.WAITING_HEADER_NAME;
            }
        } else if (this.currentState === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.currentState = this.WAITING_BODY;
                if (this.headers["Transfer-Encoding"] === "chunked") {
                    this.bodyParser = new TrunkBodyParser;
                }
            }
        } else if (this.currentState === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char)
        }
    }

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join(''),
        }
    }
}

class TrunkBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.isFinished = false;
        this.length = 0;
        this.content = [];
        this.currentState = this.WAITING_LENGTH;
    }
    receiveChar(char) {
        // console.log(JSON.stringify(char));
        if (this.currentState === this.WAITING_LENGTH) {
            if (char === '\r') {
                this.currentState = this.WAITING_LENGTH_LINE_END;
                if (this.length === 0) {
                    // console.log(this.content, this.content.length)
                    this.isFinished = true;
                }
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.currentState === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.currentState = this.READING_TRUNK;
            }
        } else if (this.currentState === this.READING_TRUNK) {
            this.content.push(char);
            this.length--;
            if (this.length == 0) {
                this.currentState = this.WAITING_NEW_LINE;
            }
        } else if (this.currentState === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.currentState = this.WAITING_NEW_LINE_END;
            }
        } else if (this.currentState === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.currentState = this.WAITING_LENGTH;
            }
        }
    }
}

const render = require('./render');

void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        path: "/",
        port: "8088",
        headers: {
            ["X-Foo2"]: "bra2"
        },
        body: {
            name: 'winter'
        }
    })

    let ret = await request.send();
    let dom = parser.parseHTML(ret.body);
    console.log(JSON.stringify(dom));
    let viewport = images(800, 600);

    render(viewport, dom.children[0].children[1].children[0]);
    viewport.save('viewport.jpg');
}()