const errorHandler = (err, req, res, next) => {
    const formatErrors = Object.entries(err.errors).map(([fieldName, error]) => ({field: fieldName, message: error.properties.message}))

    // handles field validations
    if (err.name === 'ValidationError') {
        return res.status(400).send({
            message: "Validation failed",
            errors: formatErrors
        })
    }

    // handles any other server related issue
    res.status(500).send({message: 'Server Error'})
}

module.exports = errorHandler