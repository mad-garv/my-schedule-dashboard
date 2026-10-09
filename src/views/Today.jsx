
import { useState } from "react"

const formatDate = (dateString) => {
  const date = new Date(`${dateString}T12:00:00`)

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

const changeDate = (dateString, amount) => {
  const date = new Date(`${dateString}T12:00:00`)
  date.setDate(date.getDate() + amount)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const getTodayString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const Today = ({
  date,
  tasks,
  schedules,
  lists,
  onDateChange,
  onGoToToday,
  onScheduleTask,
  onUnscheduleTask,
  onToggleTask,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [error, setError] = useState("")

  const scheduledItems = schedules
    .filter((schedule) => schedule.date === date)
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

  const availableTasks = tasks.filter(
    (task) => !task.completed
  )

  const handleSchedule = (event) => {
    event.preventDefault()
    setError("")

    if (!selectedTaskId) {
      setError("Choose a task to schedule.")
      return
    }

    if (
      startTime &&
      endTime &&
      endTime <= startTime
    ) {
      setError("The end time must be after the start time.")
      return
    }

    onScheduleTask(
      selectedTaskId,
      date,
      startTime,
      endTime
    )

    setSelectedTaskId("")
    setStartTime("")
    setEndTime("")
  }

  const getListName = (listId) => {
    if (listId === null) return "Inbox"

    return lists.find((list) => list.id === listId)?.name
      ?? "Unknown list"
  }

  return (
    <div className="view today-view">
      <div className="today-header">
        <div>
          <p className="today-eyebrow">DAILY AGENDA</p>
          <h1>{date === getTodayString() ? "Today" : formatDate(date)}</h1>
          <p className="today-date">{formatDate(date)}</p>
        </div>

        <div className="today-date-controls">
          <button
            type="button"
            onClick={() => onDateChange(changeDate(date, -1))}
            aria-label="Previous day"
          >
            ←
          </button>

          <button type="button" onClick={onGoToToday}>
            Today
          </button>

          <button
            type="button"
            onClick={() => onDateChange(changeDate(date, 1))}
            aria-label="Next day"
          >
            →
          </button>
        </div>
      </div>

      <section className="today-schedule-section">
        <div className="today-section-heading">
          <h2>Scheduled tasks</h2>
          <span>{scheduledItems.length}</span>
        </div>

        {scheduledItems.length === 0 ? (
          <p className="today-empty">
            Nothing scheduled for this day yet.
          </p>
        ) : (
          <ul className="today-task-list">
            {scheduledItems.map(({ schedule, task }) => (
              <li className="today-task" key={schedule.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  aria-label={`Mark ${task.title} as ${
                    task.completed ? "incomplete" : "complete"
                  }`}
                />

                <div className="today-task-details">
                  <span
                    className={
                      task.completed
                        ? "today-task-title completed"
                        : "today-task-title"
                    }
                  >
                    {task.title}
                  </span>

                  <span className="today-task-meta">
                    {schedule.startTime
                      ? schedule.startTime
                      : "No start time"}
                    {schedule.endTime
                      ? ` – ${schedule.endTime}`
                      : ""}
                    {" · "}
                    {getListName(task.listId)}
                  </span>
                </div>

                <label className="today-reschedule">
                  <span>Move to</span>
                  <input
                    type="date"
                    value={schedule.date}
                    aria-label={`Change date for ${task.title}`}
                    onChange={(event) => {
                      const newDate = event.target.value
                      if (!newDate) return

                      onScheduleTask(
                        task.id,
                        newDate,
                        schedule.startTime,
                        schedule.endTime
                      )
                    }}
                  />
                </label>

                <button
                  type="button"
                  className="today-unschedule-button"
                  onClick={() => onUnscheduleTask(task.id)}
                  aria-label={`Unschedule ${task.title}`}
                  title="Remove from schedule"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="today-add-section">
        <h2>Schedule a task</h2>
        <p>
          Choose an existing task. It will stay in its original
          list or Inbox.
        </p>

        {availableTasks.length === 0 ? (
          <p className="today-empty">
            No incomplete tasks available. Create a task in a list
            or Inbox first.
          </p>
        ) : (
          <form
            className="today-schedule-form"
            onSubmit={handleSchedule}
          >
            <label>
              Task
              <select
                value={selectedTaskId}
                onChange={(event) =>
                  setSelectedTaskId(event.target.value)
                }
                required
              >
                <option value="">Choose a task...</option>

                {availableTasks.map((task) => {
                  const listName = getListName(task.listId)

                  return (
                    <option key={task.id} value={task.id}>
                      {task.title} — {listName}
                    </option>
                  )
                })}
              </select>
            </label>

            <div className="today-time-fields">
              <label>
                Start time
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(event.target.value)
                  }
                />
              </label>

              <label>
                End time
                <input
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(event.target.value)
                  }
                />
              </label>
            </div>

            {error && (
              <p className="today-form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit">
              Add to schedule
            </button>
          </form>
        )}
      </section>
    </div>
  )
}

export default Today