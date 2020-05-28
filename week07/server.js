const http = require('http')

const html1 = `<html maaa=a>
<head>
    <style>
#container {
    width: 500px;
    height: 300px;
    display: flex;
    background-color: rgb(255, 0, 200);
}
#container #myid{
    width: 200px;
    height: 100px;
    background-color: rgb(20, 200, 200);
}

#container .c1{
    flex: 1;
    background-color: rgb(100, 50, 250);
}
    </style>
</head>
<body>
    <div id="container">
        <img id="myid"/>
        <img class="c1"/>
    </div>
</body>
</html>`

const html2 = `<html maaa=a>
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
</html>`

const server = http.createServer((req, res) => {
    console.log("server receive meesage");
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(html1);
  });

  server.listen(8088);