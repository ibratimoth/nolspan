const jwt = require('jsonwebtoken');
require('dotenv').config()

function tokenVerificationMiddleware(req, res, next) {
    const accessToken = req.cookies.accessToken;

    console.log('TokenCheck:', accessToken); // Log the token for debugging

    if (!accessToken) {
        return res.redirect('/'); 
    }

    try {
        // Verify token using JWT_SECRET
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET, { clockTolerance: 5 });
        req.user = decoded; // Store decoded user data in req.user
        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Invalid token:', error.message);
         // Clear session token
         res.clearCookie('accessToken');
        return res.redirect('/'); // Redirect if the token is invalid
    }
}

module.exports = tokenVerificationMiddleware;