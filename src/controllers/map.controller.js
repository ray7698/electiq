const config = require('../config');
const { catchAsync } = require('../middleware/error.handler');
const AppError = require('../utils/AppError');

exports.getConfig = (req, res) => {
  res.json({ mapsApiKey: config.mapsApiKey });
};

exports.geocode = catchAsync(async (req, res) => {
  const { address } = req.query;
  if (!address) {
    throw new AppError('Address is required', 400);
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${config.mapsApiKey}`,
  );
  const data = await response.json();

  if (data.status === 'OK' && data.results && data.results.length > 0) {
    res.json({ results: data.results, status: data.status });
  } else {
    res.json({ results: [], status: data.status });
  }
});
