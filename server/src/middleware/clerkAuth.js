const { createClerkClient, verifyToken } = require('@clerk/clerk-sdk-node');
const prisma = require('../lib/prisma');

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const AUTHORIZED_PARTIES = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
];

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Use standalone verifyToken (correct Clerk SDK v4 approach)
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: AUTHORIZED_PARTIES,
    });
    const clerkId = payload.sub;

    // Try to fetch Clerk user details; fall back to placeholder so the
    // upsert still works even if the Clerk API call fails.
    let email = `${clerkId}@placeholder.local`;
    let name = null;
    try {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      email = clerkUser.emailAddresses?.[0]?.emailAddress || email;
      name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;
    } catch (e) {
      console.warn('Could not fetch Clerk user profile (non-fatal):', e.message);
    }

    // Upsert so req.userId = Prisma User.id (cuid), satisfying the FK on Project
    const user = await prisma.user.upsert({
      where: { clerkId },
      create: { clerkId, email, name },
      update: { name },
    });

    req.userId = user.id;
    req.clerkId = clerkId;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ error: error.message || 'Invalid token' });
  }
};

module.exports = { requireAuth };
