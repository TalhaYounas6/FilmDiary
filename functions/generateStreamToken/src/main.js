import { StreamChat } from 'stream-chat';

export default async ({ req, res, log, error }) => {
  const STREAM_API_KEY = process.env.STREAM_API_KEY;
  const STREAM_API_SECRET = process.env.STREAM_API_SECRET;
  log(`STREAM API KEY: ${STREAM_API_KEY}`);
  log(`STREAM API SECRET: ${STREAM_API_SECRET}`);
  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    error('Missing Stream API keys. Check Appwrite Console.');
    return res.json(
      { success: false, message: 'Server configuration error' },
      500
    );
  }

  const serverClient = StreamChat.getInstance(
    STREAM_API_KEY,
    STREAM_API_SECRET
  );

  try {
    const payload =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
    const userId = payload.userId;

    if (!userId) {
      return res.json({ success: false, message: 'User ID is required' }, 400);
    }

    log(`Generating secure Stream token for user: ${userId}`);

    const token = serverClient.createToken(userId);

    return res.json(
      {
        success: true,
        token: token,
      },
      200
    );
  } catch (err) {
    error(`Failed to generate token: ${err.message}`);
    return res.json({ success: false, message: 'Internal server error' }, 500);
  }
};
