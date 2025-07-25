const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // ✅ This line is VERY IMPORTANT // ✅ set as `req.user.id` to match your usage
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
