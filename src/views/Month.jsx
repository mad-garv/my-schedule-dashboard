
import {
  addMonths,
  formatMonthYear,
  getDateString,
  getMonthStart,
  parseLocalDate,
} from "../utils/scheduleUtils"

import UnassignedTasks from "../components/unassignedTasks"

const getMonthDates = (monthDate) => {
  const firstOfMonth = parseLocalDate(getMonthStart(monthDate))
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7

  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(firstOfMonth.getDate() - firstWeekday)

  // Always show complete weeks, using 4–6 rows as needed.
  const lastOfMonth = new Date(
    firstOfMonth.getFullYear(),
    firstOfMonth.getMonth() + 1,
    0
  )

  const lastWeekday = (lastOfMonth.getDay() + 6) % 7
  const totalDays = firstWeekday + lastOfMonth.getDate()
  const totalCells = Math.ceil(totalDays / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + index)

    return getDateString(day)
  })
}

const Month = ({
  date,
  tasks,
  schedules,
  lists,
  onDateChange,
  onOpenDay,
  onGoToToday,
  unassignedTasks,
  onScheduleTask,
  onToggleTask,
}) => {
  const monthStart = getMonthStart(date)
  const monthDates = getMonthDates(monthStart)
  const today = getDateString(new Date())

  const monthNumber = parseLocalDate(monthStart).getMonth()

  const getListName = (listId) => {
    if (listId === null) return "Inbox"

    return (
      lists.find((list) => list.id === listId)?.name ??
      "Unknown list"
    )
  }

  const getDayTasks = (day) =>
    schedules
      .filter((schedule) => schedule.date === day)
      .map((schedule) => ({
        schedule,
        task: tasks.find((task) => task.id === schedule.taskId),
      }))
      .filter((item) => item.task)
      .sort((a, b) => {
        const timeA = a.schedule.startTime || "99:99"
        const timeB = b.schedule.startTime || "99:99"

        return timeA.localeCompare(timeB)
      })

  return (
    <div className="view month-view">

      <header className="calendar-view-header">
        <div className="calendar-heading">
          <p className="view-eyebrow">MONTHLY OVERVIEW</p>
          <h1>{formatMonthYear(monthStart)}</h1>
        </div>

        <div className="calendar-controls">
          <button
            type="button"
            onClick={() => onDateChange(addMonths(monthStart, -1))}
            aria-label="Previous month"
          >
            ←
          </button>
          <button type="button" onClick={onGoToToday}>
            This month
          </button>
          <button
            type="button"
            onClick={() => onDateChange(addMonths(monthStart, 1))}
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </header>

      <UnassignedTasks
        tasks={unassignedTasks}
        lists={lists}
        date={date}
        onScheduleTask={onScheduleTask}
        onToggleTask={onToggleTask}
      />

      <div className="month-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (weekday) => (
            <div className="month-weekday" key={weekday}>
              {weekday}
            </div>
          )
        )}

        {monthDates.map((day) => {
          const dayTasks = getDayTasks(day)
          const isCurrentMonth =
            parseLocalDate(day).getMonth() === monthNumber
          const isToday = day === today

          return (
            <section
              key={day}
              className={[
                "month-day",
                !isCurrentMonth ? "month-day-outside" : "",
                isToday ? "month-day-today" : "",
              ].filter(Boolean).join(" ")}
            >
              <button
                type="button"
                className="month-day-number"
                onClick={() => onOpenDay(day)}
                aria-label={`Open ${day}`}
              >
                {parseLocalDate(day).getDate()}
              </button>

              <div className="month-day-events">
                {dayTasks.slice(0, 3).map(({ schedule, task }) => (
                  <button
                    type="button"
                    key={schedule.id}
                    className={`month-event ${task.completed ? "month-event-completed" : ""
                      }`}
                    title={`${task.title} · ${getListName(task.listId)}`}
                    onClick={() => onOpenDay(day)}
                  >
                    {schedule.startTime && (
                      <span className="month-event-time">
                        {schedule.startTime}
                      </span>
                    )}
                    <span className="month-event-title">
                      {task.title}
                    </span>
                  </button>
                ))}

                {dayTasks.length > 3 && (
                  <button
                    type="button"
                    className="month-more-events"
                    onClick={() => onOpenDay(day)}
                  >
                    +{dayTasks.length - 3} more
                  </button>
                )}
              </div>

              <button
                type="button"
                className="month-open-day"
                onClick={() => onOpenDay(day)}
              >
                Open
              </button>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default Month