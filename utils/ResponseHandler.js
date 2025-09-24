class ResponseHandler {
    sendResponse(res, statusCode, success, message, data = null) {
        return res.status(statusCode).send({
            statusCode,
            success,
            message,
            data,
        });
    }
}

module.exports = ResponseHandler;
