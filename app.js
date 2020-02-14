//dependencies
const express    = require('express');
const webpush    = require('web-push');
const bodyParser = require("body-parser");
const path       = require("path");

//routes
const sub        = require("./routes/subscribe");
const list       = require("./routes/list");
const database   = require("./routes/database");
//express
const app = express();


app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const privateKey = '03eNJ44ARLXm3q3JJ6FcD99H8GyjMUw-5lHLDSlWziQ';
const publicKey = 'BHr98FwTnZ7fszUAqe1M1Hw9m24Z1yKNeLdQMoKP3DMktphRO4oBtwogH8zrNokMHUl6KHbDfIVL2VTL5D9vZhE';

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  'BHr98FwTnZ7fszUAqe1M1Hw9m24Z1yKNeLdQMoKP3DMktphRO4oBtwogH8zrNokMHUl6KHbDfIVL2VTL5D9vZhE',
  '03eNJ44ARLXm3q3JJ6FcD99H8GyjMUw-5lHLDSlWziQ'
);

app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => res.sendFile('index.html'));
app.use('/list', list);
app.use('/subscribe', sub);
app.use('/database', database);



app.listen(port, () => console.log(`Listening to port ${port}`));

module.exports = app;
