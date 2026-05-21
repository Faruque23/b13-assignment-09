const rawGoogleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

export const googleClientId = rawGoogleClientId;

export const isGoogleClientConfigured = Boolean(
  rawGoogleClientId &&
    rawGoogleClientId.endsWith(".apps.googleusercontent.com") &&
    !rawGoogleClientId.includes("your_google_oauth_client_id"),
);
