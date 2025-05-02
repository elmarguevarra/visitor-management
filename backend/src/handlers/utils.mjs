export const calculateTTLInSeconds = (
  startDate,
  durationInHours
) => {
  const startTimeInMilliseconds = startDate.getTime();
  const durationInMilliseconds = durationInHours * 60 * 60 * 1000;
  const expirationTimeInMilliseconds =
    startTimeInMilliseconds + durationInMilliseconds;
  return Math.floor(expirationTimeInMilliseconds / 1000);
};
