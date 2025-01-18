import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5001;

let pushups = 0;
let screenTime = 0;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/pushups', (req, res) => {
  res.json({ pushups });
});

app.post('/api/pushups', (req, res) => {
  pushups += 1;
  screenTime += 1; // 1 pushup = 1 minute of screen time
  res.json({ pushups, screenTime });
});

app.get('/api/screen-time', (req, res) => {
  res.json({ screenTime });
});

app.post('/api/screen-time', (req, res) => {
  const { minutes } = req.body;
  screenTime -= minutes;
  res.json({ screenTime });
});

app.get('/api/todays-stats', (req, res) => {
  res.json({ pushups, screenTime });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});