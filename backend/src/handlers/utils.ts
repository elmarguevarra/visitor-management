export const calculateTTLInSeconds = (
  startDate: Date,
  durationInHours: number
): number => {
  const startTimeInMilliseconds = startDate.getTime();
  const durationInMilliseconds = durationInHours * 60 * 60 * 1000;
  const expirationTimeInMilliseconds =
    startTimeInMilliseconds + durationInMilliseconds;
  return Math.floor(expirationTimeInMilliseconds / 1000);
};
