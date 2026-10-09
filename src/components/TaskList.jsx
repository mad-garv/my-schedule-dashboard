
import { useState } from "react"

const TaskList = ({
  title,
  tasks,
  onAddTask,
  onToggleTask,
  onRenameTask,
  onDeleteTask,
  onMoveTask,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const orderedTasks = [...tasks].sort(
    (a, b) => a.position - b.position
  )

  const incompleteTasks = orderedTasks.filter(
    (task) => !task.completed
  )

  const completedTasks = orderedTasks.filter(
    (task) => task.completed
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    const title = newTaskTitle.trim()

    if (!title) return

    onAddTask(title)
    setNewTaskTitle("")
  }

  const renderTask = (task, index, taskGroup) => (
    <li className="task-item" key={task.id}>
      <label className="task-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
        />

        <span className={task.completed ? "task-completed" : ""}>
          {task.title}
        </span>
      </label>

      <div className="task-actions">
        <button
          type="button"
          onClick={() => onMoveTask(task.id, -1)}
          disabled={index === 0}
          aria-label={`Move ${task.title} up`}
          title="Move up"
        >
          ↑
        </button>

        <button
          type="button"
          onClick={() => onMoveTask(task.id, 1)}
          disabled={index === taskGroup.length - 1}
          aria-label={`Move ${task.title} down`}
          title="Move down"
        >
          ↓
        </button>

        <button
          type="button"
          onClick={() => onRenameTask(task)}
          aria-label={`Rename ${task.title}`}
          title="Rename"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDeleteTask(task)}
          aria-label={`Delete ${task.title}`}
          title="Delete"
        >
          ×
        </button>
      </div>
    </li>
  )

  return (
    <div className="view task-list-view">
      <h1>{title}</h1>

      <p className="task-summary">
        {incompleteTasks.length} remaining · {completedTasks.length} completed
      </p>

      <form className="new-task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
          placeholder="Add a task..."
          aria-label="New task title"
        />

        <button type="submit" disabled={!newTaskTitle.trim()}>
          Add task
        </button>
      </form>

      {incompleteTasks.length === 0 && (
        <p className="empty-tasks">
          No incomplete tasks. Add one above!
        </p>
      )}

      {incompleteTasks.length > 0 && (
        <section className="task-section">
          <h2>To do</h2>

          <ul className="task-items">
            {incompleteTasks.map((task, index) =>
              renderTask(task, index, incompleteTasks)
            )}
          </ul>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section className="task-section">
          <h2>Completed</h2>

          <ul className="task-items">
            {completedTasks.map((task, index) =>
              renderTask(task, index, completedTasks)
            )}
          </ul>
        </section>
      )}
    </div>
  )
}

export default TaskList