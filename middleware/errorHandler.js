const errorHandler = (err, req, res, next) => {
  // handles field validations from mongoose
  if (err.name === 'ValidationError' && err.errors) {
    // format error
    const formatErrors = Object.entries(err.errors).map(
      ([fieldName, error]) => ({
        field: fieldName,
        message: error.properties.message,
      })
    );

    return res.status(400).render('error', {
      message: 'Easter Egg Found ;) Validation failed',
      errors: formatErrors,
    });
  }
  // handles any other server related issue
  res.status(500).render('error', {
    message: '500 - Server Error',
    errors: [
      {
        message:
          'Sorry, there may have been an issue on our end. Please check back later!',
      },
    ],
  });
};

module.exports = errorHandler;
