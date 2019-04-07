import fs from 'fs';
import uuidv4 from 'uuid/v4';
import { analysisDataCache } from '../../index';

export const createAnalysis = (req, res) => {
  const id = uuidv4();
  console.log("Created analysis, id: " + id);

  const { frequency } = req.body;
  console.log("Frequency: " + frequency);

  analysisDataCache[id] = {
    frequency,
    data: []
  };

  res.send(id);
};

export const updateAnalysis = (req, res) => {
  const id = req.params.analysisId;
  const samples = req.body;

  analysisDataCache[id].data.push(samples);

  res.send(null);
}

export const stopAnalysis = (req, res, next) => {
  const id = req.params.analysisId;

  if (analysisDataCache[id] && analysisDataCache[id].data.length) {
    const { frequency } = analysisDataCache[id];
    let data = analysisDataCache[id].data.sort((a, b) => a.timestamp - b.timestamp);

    const startTime = data[0].timestamp;

    const filePath = __dirname + '/../../records/' + id + '.txt';

    fs.writeFileSync(
      filePath,
      startTime + '\n' + frequency
    );

    // TODO: Fill lost frames

    const analogChannel0Data = data
      .map(sample => sample.frames)
      .reduce((a, b) => a.concat(b), [])
      .map(bitalinoFrame => bitalinoFrame.analog[0])
      .map(frame => '\n' + frame)
      .reduce((a, b) => a + b) + '\n';

    fs.appendFileSync(
      filePath,
      analogChannel0Data
    );

    delete analysisDataCache[id];

    console.log("Stopped analysis, id: " + id);

    return res.json({ 'message': 'Record file successfully saved!' });
  }

  res.send(null);
}
