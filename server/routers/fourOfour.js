const express = require('express');
const router = express.Router();

function notFound(req, res, next) {
    const error = new Error('404 - Not Found!');
    res.status(404);
    next(error);
}

function errorHandler(error, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        success: error.message
    });
}

router.use(notFound);
router.use(errorHandler);

module.exports = router;