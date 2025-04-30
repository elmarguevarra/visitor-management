export function getYearMonthDay(date: Date | string | number): string {
  let dateObject: Date
  if (date instanceof Date) {
    dateObject = date
  } else {
    dateObject = new Date(date)
    if (isNaN(dateObject.getTime())) {
      console.error('Error: getYearMonthDay called with invalid date:', date)
      return ''
    }
  }

  const year = dateObject.getFullYear()
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObject.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
