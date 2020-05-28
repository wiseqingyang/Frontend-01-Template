const http = require('http')

const server = http.createServer((req, res) => {
    console.log("server receive meesage");
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(
      `<html maaa=a>
<head>
    <style>
    body div #myid{
      width:100px;
      height: 100px;
      background-color: rgb(255,100,100);
    }
    body div{
      display: flex;
      background-color: rgb(20,100,100);
    }
    .like {
      width: 100px;
      height: 200px;
      background-color: rgb(20,140,100);
    }
    </style>
</head>
<body>
  <div>
      <div id="myid"/>
      <div class="like"/>
  </div>
</body>
</html>`);
  });

  server.listen(8088);