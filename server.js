const express = require('express');
var path = require('path');
var src = path.join(__dirname, 'src');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.sendFile(path.join(src, '/html/index.html'));
});

app.use('/', express.static(src));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));