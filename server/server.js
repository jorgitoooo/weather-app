const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const morgan =  require('morgan');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors({
       // origin: 'http://localhost:1234',
        optionsSuccessStatus: 200
    })
);

app.get('/weather/:type/:lat/:lng', (req, res) => {
    const baseURL = 'https://api.darksky.net/forecast/';
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
    const type = req.params.type;


    // pass an error argument through res.end()?
    // validation of lat, lng
    if ((lat > 90.0 || lat < -90.0) || (lng > 180.0 || lng < -180.0)) res.end();


    fetch(`${baseURL+process.env.DARK_SKY_API}/${lat},${lng}`)
     .then(response => response.json())
     .then(weather => {
        switch ( type ) {
            case 'all':
                res.json(weather);
                break;
            case 'currently':
                res.json(weather.currently);
                break;
            case 'hourly':
                res.json(weather.hourly);
                break;
            case 'minutely':
                res.json(weather.minutely);
                break;
            default:
                res.json({ success: false });
        }
     })
     .catch(err => console.log(err));
});

const fofRouter = require('./routers/fourOfour');
app.all('/', fofRouter);
app.all('/weather/*/:lat/:lng/*', fofRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening to port:${port}`);
});