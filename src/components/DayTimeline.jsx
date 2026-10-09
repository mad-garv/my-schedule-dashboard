
import { timeToMinutes } from "../utils/scheduleUtils"

const HOUR_HEIGHT = 60
const DAY_START = 0
const DAY_END = 24 * 60

const formatHour = (hour) => {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
  }).format(date)
}

const DayTimeline = ({
  scheduledItems,
  onToggleTask,
  onUnscheduleTask,
  getListName,
}) => {
  const timedItems = scheduledItems
    .map((item) => {
      const start = timeToMinutes(item.schedule.startTime)

      if (start === null) return null

      const requestedEnd = timeToMinutes(item.schedule.endTime)

      // An event with no end time gets a one-hour visual duration.
      const end =
        requestedEnd !== null && requestedEnd > start
          ? requestedEnd
          : start + 60

      return {
        ...item,
        start,
        end,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.start - b.start || a.end - b.end)

  const untimedItems = scheduledItems.filter(
    (item) => timeToMinutes(item.schedule.startTime) === null
  )

  // Assign overlapping events to separate lanes.
  const positionedItems = []
  let cluster = []
  let clusterEnd = -1

  const finishCluster = () => {
    if (cluster.length === 0) return

    const laneEnds = []

    const assigned = cluster.map((item) => {
      let lane = laneEnds.findIndex((end) => end <= item.start)

      if (lane === -1) lane = laneEnds.length

      laneEnds[lane] = item.end

      return { ...item, lane }
    })

    const laneCount = Math.max(1, laneEnds.length)

    positionedItems.push(
      ...assigned.map((item) => ({
        ...item,
        laneCount,
      }))
    )

    cluster = []
    clusterEnd = -1
  }

  for (const item of timedItems) {
    if (cluster.length > 0 && item.start >= clusterEnd) {
      finishCluster()
    }

    cluster.push(item)
    clusterEnd = Math.max(clusterEnd, item.end)
  }

  finishCluster()

  return (
    <section className="day-timeline-section">
      <div className="today-section-heading">
        <h2>Daily timeline</h2>
        <span>{scheduledItems.length}</span>
      </div>

      {untimedItems.length > 0 && (
        <div className="day-untimed">
          <h3>All-day / no time assigned</h3>

          {untimedItems.map(({ schedule, task }) => (
            <div className="day-untimed-item" key={schedule.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                />
                <span
                  className={
                    task.completed ? "day-task-completed" : ""
                  }
                >
                  {task.title}
                </span>
              </label>

              <span>{getListName(task.listId)}</span>

              <button
                type="button"
                onClick={() => onUnscheduleTask(task.id)}
                aria-label={`Unschedule ${task.title}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="day-timeline">
        <div className="day-hour-labels">
          {Array.from({ length: 24 }, (_, hour) => (
            <div className="day-hour-label" key={hour}>
              {formatHour(hour)}
            </div>
          ))}
        </div>

        <div className="day-timeline-canvas">
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              className="day-hour-line"
              key={hour}
              style={{ top: `${hour * HOUR_HEIGHT}px` }}
            />
          ))}

          {positionedItems.map((item) => {
            const visibleStart = Math.max(item.start, DAY_START)
            const visibleEnd = Math.min(item.end, DAY_END)

            if (visibleEnd <= visibleStart) return null

            const top = (visibleStart / 60) * HOUR_HEIGHT
            const height = Math.max(
              24,
              ((visibleEnd - visibleStart) / 60) * HOUR_HEIGHT
            )

            const width = 100 / item.laneCount
            const left = width * item.lane

            return (
              <article
                className={`day-timeline-event ${
                  item.task.completed ? "day-task-completed" : ""
                }`}
                key={item.schedule.id}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: `${left}%`,
                  width: `${width}%`,
                }}
                title={`${item.task.title} · ${getListName(item.task.listId)}`}
              >
                <label className="day-event-title">
                  <input
                    type="checkbox"
                    checked={item.task.completed}
                    onChange={() => onToggleTask(item.task.id)}
                  />
                  <span>{item.task.title}</span>
                </label>

                <span className="day-event-time">
                  {item.schedule.startTime}
                  {" – "}
                  {item.schedule.endTime || "end not set"}
                </span>

                <span className="day-event-list">
                  {getListName(item.task.listId)}
                </span>

                <button
                  type="button"
                  className="day-event-remove"
                  onClick={() => onUnscheduleTask(item.task.id)}
                  aria-label={`Unschedule ${item.task.title}`}
                  title="Remove from schedule"
                >
                  ×
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default DayTimeline