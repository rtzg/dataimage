const express = require("express");
const multer = require("multer");
const app = express();
const fs = require("fs");
const imageDataURI = require('image-data-uri');
const PORT = process.env.PORT || 5000;
var UAParser = require('ua-parser-js');

app.get('/res/:file', (req, res) => {
    res.sendFile(__dirname + `/public/res/${req.params.file}`);
});

app.post("/upload", multer().single("file"), (req, res) => {
    const file = req.file;
    if (file == undefined) {
        return res.sendFile(__dirname + `/public/er.html`);
    }
    const type = file.mimetype.split("/")[0]
    var Type = file.mimetype.split("/")[1]
    const isImage = type === "image"
    if (!isImage) {
        return res.sendFile(__dirname + `/public/er.html`);
    };
    Type = Type.toUpperCase()
    var resi = imageDataURI.encode(file.buffer, Type)
    res.end(`<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <meta name="color-scheme" content="light dark">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>输出</title>
        <link rel="stylesheet" href="res/style.css">
        <script src="res/xm.js"></script>
    </head>
    
    <body>
        <center>
            <div class="preview">
                <h1>预览</h1>
                <img src="" id="img">
            </div>
            <hr>
            <div class="code">
                <h1>代码</h1>
                <textarea id="text" readonly></textarea>
            </div>
            <hr>
            <div class="btns">
                <button id="copy">复制 data:image</button>
                <button id="viewSource">查看完整代码</button>
            </div>
        </center>
        <script>
            src = "${resi}";
            document.getElementById("img").src = src
            document.getElementById("text").innerHTML = src
            document.getElementById("copy").onclick = function() {
                document.getElementById("text").select()
                document.execCommand("Copy")
                message("复制成功")
            }
            document.getElementById("viewSource").onclick = function() {
                var win = window.open("", "_blank")
                win.document.head.innerHTML = '<meta name="color-scheme" content="light dark"><title>Source</title>';
                win.document.write("<pre>" + src + "</pre>")
            }
        </script>
        <script>
            startXmessage();
        </script>
        <script src="res/check.js"></script>
    </body>
    
    </html>`)
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/ut', function(req, res) {
    res.redirect("https://alphabrate.github.io/project/di/ut");
});

app.get('/api/getBrowser', function(req, res) {
    var ua = parser(req.headers['user-agent']);
    res.end(JSON.stringify(ua, null, '  '));
});



app.listen(PORT, function(error) {
    if (error) throw error
    console.log("Server created Successfully on PORT:" + PORT)
});