export const calculateTTLInSeconds = (
  date,
  durationInHours
) => {
  const baseTime = new Date(date).getTime();

  // If durationInHours is not provided, treat `date` as the expiration date
  const expirationTimeInMilliseconds = durationInHours
    ? baseTime + durationInHours * 60 * 60 * 1000
    : baseTime;

  return Math.floor(expirationTimeInMilliseconds / 1000);
};

export const calculateDateFromTTLInSeconds = (durationInSeconds) => {
  return new Date(durationInSeconds * 1000).toISOString();
};

