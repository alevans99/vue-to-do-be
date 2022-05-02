/**
 * For any errors created that include a status code and error message, these
 * are passed back into the response. If the error is not a custom error, we will use
 * the next middleware to handle it.
 * @param {*} err - The error received
 * @param {*} req - The request object
 * @param {*} res  - The reponse object
 * @param {*} next - Function to move to the next middleware
 */
exports.handleCustomErrors = (err, req, res, next)=> {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message })
  } else {
    next(err)
  }
}

/**
 * Any errors triggered by psql will be caught here and a response sent 
 * indicating that there was an error.
 * @param {*} err - The error received
 * @param {*} req - The request object
 * @param {*} res  - The reponse object
 * @param {*} next - Function to move to the next middleware
 */
exports.handleDbErrors = (err, req, res, next) => {
    if (err.code === 23503){
        res.status(400).send({
            message: 'Invalid Request'
        }) 
    } else {
        next()
    }
}

/**
 * This will catch any errors which do not fit into the custom or DB categories.
 * @param {*} err - The error received
 * @param {*} req - The request object
 * @param {*} res  - The reponse object
 * @param {*} next - Function to move to the next middleware
 */
exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({
        message: 'Internal Server Error'
    })
}

/**
 * This sends an error for methods which are not accepted.
 * @param {*} err - The error received
 * @param {*} req - The request object
 * @param {*} res  - The reponse object
 * @param {*} next - Function to move to the next middleware
 */
exports.handleMethodNotAllowed = (req, res, next) => {
    res.status(405).send({
        message: 'Method Not Allowed'
    })
}