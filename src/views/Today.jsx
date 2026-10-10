
import { useState } from "react"
import DayTimeline from "../components/DayTimeline"
import { formatDayHeading } from "../utils/scheduleUtils"
import UnassignedTasks from "../components/unassignedTasks"

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
  unassignedTasks,
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

  const allDayItems = scheduledItems.filter(
    (item) => !item.schedule.startTime
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

      <div className="calendar-view-header">
        <div className="calendar-heading">

          <h1>
            {date === getTodayString()
              ? "TODAY"
              : formatDayHeading(date)}
          </h1>
        </div>

        <div className="calendar-controls">
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

      <UnassignedTasks
        tasks={allDayItems.map((item) => item.task)}
        lists={lists}
        onToggleTask={onToggleTask}
      />

      <DayTimeline
        scheduledItems={scheduledItems}
        onToggleTask={onToggleTask}
        onUnscheduleTask={onUnscheduleTask}
        getListName={getListName}
      />

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