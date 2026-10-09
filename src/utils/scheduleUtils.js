
export const getDateString = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
  
    return `${year}-${month}-${day}`
  }
  
  export const parseLocalDate = (dateString) =>
    new Date(`${dateString}T12:00:00`)
  
  export const addDays = (dateString, amount) => {
    const date = parseLocalDate(dateString)
    date.setDate(date.getDate() + amount)
  
    return getDateString(date)
  }
  
  export const getMonthStart = (dateString) => {
    const date = parseLocalDate(dateString)
    date.setDate(1)
  
    return getDateString(date)
  }
  
  export const addMonths = (dateString, amount) => {
    const date = parseLocalDate(dateString)
    date.setDate(1)
    date.setMonth(date.getMonth() + amount)
  
    return getDateString(date)
  }
  
  export const formatMonthYear = (dateString) =>
    new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(parseLocalDate(dateString))
  
  export const formatDayHeading = (dateString) =>
    new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(parseLocalDate(dateString))
  
  export const timeToMinutes = (time) => {
    if (!time) return null
  
    const [hours, minutes] = time.split(":").map(Number)
  
    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null
    }
  
    return hours * 60 + minutes
  }