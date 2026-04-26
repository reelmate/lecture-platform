import crypto from 'crypto';

const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const SIGNING_KEY = process.env.BUNNY_SIGNING_KEY!;

export function getBunnyEmbedUrl(
  videoId: string,
  options: { autoplay?: boolean; captions?: string } = {}
): string {
  const { autoplay = false, captions } = options;
  const base = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`;
  const params = new URLSearchParams({ autoplay: String(autoplay) });
  if (captions) params.set('captions', captions);
  return `${base}?${params}`;
}

export function getSignedBunnyEmbedUrl(
  videoId: string,
  userIp: string,
  options: { autoplay?: boolean; expiresInSeconds?: number } = {}
): string {
  const { autoplay = false, expiresInSeconds = 3600 } = options;
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;

  // Bunny token: SHA256(signingKey + videoId + expires + userIp)
  const token = crypto
    .createHash('sha256')
    .update(SIGNING_KEY + videoId + expires + userIp)
    .digest('hex');

  const params = new URLSearchParams({
    token,
    expires: String(expires),
    autoplay: String(autoplay),
  });

  return `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?${params}`;
}

export function getThumbnailUrl(videoId: string): string {
  return `https://vz-${LIBRARY_ID}.b-cdn.net/${videoId}/thumbnail.jpg`;
}
