class MeterReadingController {
  constructor(csvService, meterReadingModel) {
    this.csvService = csvService;
    this.meterReadingModel = meterReadingModel;
  }

  async uploadAndInsert(req, res) {
    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const file = req.files[0];
      const dataToBeInserted = await this.csvService.parse(file.path);
      await this.meterReadingModel.insertData(dataToBeInserted);
      return res.status(201).json({ message: 'done' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = MeterReadingController;
