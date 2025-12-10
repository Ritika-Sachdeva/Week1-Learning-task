function errorMiddleware(err, req, res, next) {
  console.error(new Date().toISOString(), err.stack || err.message);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
}

module.exports = errorMiddleware;
