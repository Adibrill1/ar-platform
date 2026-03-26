const { createClerkClient } = require('@clerk/clerk-sdk-node');

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await clerkClient.verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { requireAuth };