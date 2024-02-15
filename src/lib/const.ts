const ENV = process.env;
export const GIT_OWNER = ENV.GIT_OWNER || "";
export const GIT_REPO = ENV.GIT_REPO || "";
export const GIT_ACTION_TYPE = ENV.GIT_ACTION_TYPE || "";
export const GIT_PRIVATE_ACCESS_TOKEN= ENV.GIT_PRIVATE_ACCESS_TOKEN || "";

export const STRAVA_CLIENT_ID = ENV.STRAVA_CLIENT_ID || "";
export const STRAVA_CLIENT_SECRET = ENV.STRAVA_CLIENT_SECRET || "";
export const STRAVA_REFRESH_TOKEN = ENV.STRAVA_REFRESH_TOKEN || "";

export const TYPE_OUTDOOR = "OutDoor";
export const TYPE_INDOOR = "InDoor";
export const TYPE_ALL = "All";