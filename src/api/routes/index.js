import { createAnalysis, updateAnalysis, stopAnalysis } from '../controllers';

export default function (app) {
  app.route('/analyses')
    .post(createAnalysis);

  app.route('/analyses/:analysisId')
    .put(updateAnalysis);

  app.route('/analyses/:analysisId/stop')
    .put(stopAnalysis);
}
