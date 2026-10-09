
const getDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const parseLocalDate = (dateString) => {
  return new Date(`${dateString}T12:00:00`)
}

const addDays = (dateString, amount) => {
  const date = parseLocalDate(dateString)
  date.setDate(date.getDate() + amount)
  return getDateString(date)
}

// Monday is the first day of the week.
const getWeekStart = (dateString) => {
  const date = parseLocalDate(dateString)
  const day = date.getDay()
  const daysSinceMonday = (day + 6) % 7

  date.setDate(date.getDate() - daysSinceMonday)

  return getDateString(date)
}

const formatShortDate = (dateString) => {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(parseLocalDate(dateString))
}

const formatWeekday = (dateString) => {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
  }).format(parseLocalDate(dateString))
}

const formatWeekRange = (startDate, endDate) => {
  const start = parseLocalDate(startDate)
  const end = parseLocalDate(endDate)

  const sameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()

  if (sameMonth) {
    const month = new Intl.DateTimeFormat(undefined, {
      month: "long",
    }).format(start)

    return `${month} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`
  }

  return `${formatShortDate(startDate)} – ${formatShortDate(endDate)}, ${end.getFullYear()}`
}

const Week = ({
  date,
  tasks,
  schedules,
  lists,
  onDateChange,
  onOpenDay,
  onGoToToday,
}) => {
  const weekStart = getWeekStart(date)

  const weekDates = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index)
  )

  const weekEnd = weekDates[6]

  const today = getDateString(new Date())

  const scheduledTasksByDate = Object.fromEntries(
    weekDates.map((day) => {
      const dayTasks = schedules
        .filter((schedule) => schedule.date === day)
        .map((schedule) => ({
          schedule,
          task: tasks.find(
            (task) => task.id === schedule.taskId
          ),
        }))
        .filter((item) => item.task)
        .sort((a, b) => {
          const timeA = a.schedule.startTime || "99:99"
          const timeB = b.schedule.startTime || "99:99"

          return timeA.localeCompare(timeB)
        })

      return [day, dayTasks]
    })
  )

  const getListName = (listId) => {
    if (listId === null) return "Inbox"

    return (
      lists.find((list) => list.id === listId)?.name ??
      "Unknown list"
    )
  }

  const moveWeek = (amount) => {
    onDateChange(addDays(weekStart, amount * 7))
  }

  return (
    <div className="view week-view">
      <header className="week-header">
        <div>
          <p className="week-eyebrow">WEEKLY AGENDA</p>
          <h1>Week</h1>
          <p className="week-date-range">
            {formatWeekRange(weekStart, weekEnd)}
          </p>
        </div>

        <div className="week-controls">
          <button
            type="button"
            onClick={() => moveWeek(-1)}
            aria-label="Previous week"
          >
            ←
          </button>

          <button type="button" onClick={onGoToToday}>
            This week
          </button>

          <button
            type="button"
            onClick={() => moveWeek(1)}
            aria-label="Next week"
          >
            →
          </button>
        </div>
      </header>

      <div className="week-grid">
        {weekDates.map((day) => {
          const dayTasks = scheduledTasksByDate[day]
          const isToday = day === today

          return (
            <section
              className={`week-day ${isToday ? "week-day-today" : ""}`}
              key={day}
            >
              <button
                type="button"
                className="week-day-header"
                onClick={() => onOpenDay(day)}
                aria-label={`Open ${formatWeekday(day)}, ${formatShortDate(day)}`}
              >
                <span className="week-day-name">
                  {formatWeekday(day)}
                </span>

                <span className="week-day-number">
                  {parseLocalDate(day).getDate()}
                </span>

                <span className="week-day-count">
                  {dayTasks.length}{" "}
                  {dayTasks.length === 1 ? "task" : "tasks"}
                </span>
              </button>

              <div className="week-day-tasks">
                {dayTasks.length === 0 ? (
                  <p className="week-empty-day">No tasks</p>
                ) : (
                  dayTasks.map(({ schedule, task }) => (
                    <button
                      type="button"
                      className={`week-task ${
                        task.completed ? "week-task-completed" : ""
                      }`}
                      key={schedule.id}
                      onClick={() => onOpenDay(day)}
                      title={`${task.title} · ${getListName(task.listId)}`}
                    >
                      {schedule.startTime && (
                        <span className="week-task-time">
                          {schedule.startTime}
                          {schedule.endTime
                            ? `–${schedule.endTime}`
                            : ""}
                        </span>
                      )}

                      <span className="week-task-title">
                        {task.title}
                      </span>

                      <span className="week-task-list">
                        {getListName(task.listId)}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <button
                type="button"
                className="week-open-day"
                onClick={() => onOpenDay(day)}
              >
                Open day →
              </button>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default Week