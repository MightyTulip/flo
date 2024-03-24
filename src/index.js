const express = require('express');
const multer = require('multer');
const MeterReadingController = require('./controllers/meterReadingController');
const csvService = require('./services/csvService');
const meterReadingModel = require('./models/meterReading');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });
const meterReadingController = new MeterReadingController(csvService, meterReadingModel);

app.use(express.json());

app.post('/upload-and-insert', upload.any(), (req, res) => {
  meterReadingController.uploadAndInsert(req, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
