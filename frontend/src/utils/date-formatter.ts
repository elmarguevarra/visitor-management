class DateFormatter {
    formatDate(dateString: string): string {
      try {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      } catch (error: any) {
        console.error("Error formatting date:", error);
        return ''; // Or some other default/error string
      }
    }
  }
  
  export default new DateFormatter();