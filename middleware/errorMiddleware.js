const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  const notFound = (req, res, next) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`
    });
  };
  
  module.exports = { errorHandler, notFound };