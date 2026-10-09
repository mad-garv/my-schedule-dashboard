
import { useEffect, useState } from "react"

import Sidebar from "./components/Sidebar"
import ViewNavigation from "./components/ViewNavigation"
import StatsPanel from "./components/StatsPanel"
import TaskList from "./components/TaskList"

import Today from "./views/Today"
import Week from "./views/Week"
import Month from "./views/Month"

import "./App.css"

const defaultLists = [
  { id: 1, name: "MA201" },
  { id: 2, name: "CS200" },
  { id: 3, name: "Project X" },
  { id: 4, name: "Personal" },
]

const readSavedData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const App = () => {
  const [currentView, setCurrentView] = useState("today")

  const [lists, setLists] = useState(() =>
    readSavedData("scheduleLists", defaultLists)
  )

  const [tasks, setTasks] = useState(() =>
    readSavedData("scheduleTasks", [])
  )

  const [selectedListId, setSelectedListId] = useState(null)

  // Persist lists and tasks whenever they change.
  useEffect(() => {
    localStorage.setItem("scheduleLists", JSON.stringify(lists))
  }, [lists])

  useEffect(() => {
    localStorage.setItem("scheduleTasks", JSON.stringify(tasks))
  }, [tasks])

  // List management
  const createList = () => {
    const name = window.prompt("Enter a list name")

    if (!name?.trim()) return

    const newList = {
      id: crypto.randomUUID(),
      name: name.trim(),
    }

    setLists((currentLists) => [...currentLists, newList])
  }

  const renameList = (listId) => {
    const list = lists.find((item) => item.id === listId)
    if (!list) return

    const name = window.prompt("Enter a new list name", list.name)

    if (!name?.trim()) return

    setLists((currentLists) =>
      currentLists.map((item) =>
        item.id === listId
          ? { ...item, name: name.trim() }
          : item
      )
    )
  }

  const deleteList = (listId) => {
    const list = lists.find((item) => item.id === listId)
    if (!list) return

    const confirmed = window.confirm(
      `Delete "${list.name}" and move its tasks to Inbox?`
    )

    if (!confirmed) return

    // Preserve tasks by moving them into Inbox.
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.listId === listId
          ? { ...task, listId: null }
          : task
      )
    )

    setLists((currentLists) =>
      currentLists.filter((item) => item.id !== listId)
    )

    if (selectedListId === listId) {
      setSelectedListId(null)
      setCurrentView("today")
    }
  }

  // Navigation
  const selectInbox = () => {
    setSelectedListId(null)
    setCurrentView("inbox")
  }

  const selectList = (listId) => {
    setSelectedListId(listId)
    setCurrentView("list")
  }

  const changeView = (view) => {
    setCurrentView(view)
  }

  // Task management
  const createTask = (title, listId) => {
    const listTasks = tasks.filter(
      (task) => task.listId === listId
    )

    const nextPosition =
      listTasks.length === 0
        ? 0
        : Math.max(...listTasks.map((task) => task.position)) + 1

    const newTask = {
      id: crypto.randomUUID(),
      listId,
      title,
      completed: false,
      position: nextPosition,
    }

    setTasks((currentTasks) => [...currentTasks, newTask])
  }

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const renameTask = (task) => {
    const title = window.prompt("Edit task title", task.title)

    if (!title?.trim()) return

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === task.id
          ? { ...item, title: title.trim() }
          : item
      )
    )
  }

  const deleteTask = (task) => {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`
    )

    if (!confirmed) return

    setTasks((currentTasks) =>
      currentTasks.filter((item) => item.id !== task.id)
    )
  }

  const moveTask = (taskId, direction) => {
    setTasks((currentTasks) => {
      const task = currentTasks.find((item) => item.id === taskId)
      if (!task) return currentTasks

      // Reorder within the same list and completion group.
      const group = currentTasks
        .filter(
          (item) =>
            item.listId === task.listId &&
            item.completed === task.completed
        )
        .sort((a, b) => a.position - b.position)

      const index = group.findIndex((item) => item.id === taskId)
      const targetIndex = index + direction

      if (targetIndex < 0 || targetIndex >= group.length) {
        return currentTasks
      }

      const first = group[index]
      const second = group[targetIndex]

      return currentTasks.map((item) => {
        if (item.id === first.id) {
          return { ...item, position: second.position }
        }

        if (item.id === second.id) {
          return { ...item, position: first.position }
        }

        return item
      })
    })
  }

  // Determine which content belongs in the main area.
  const renderMainContent = () => {
    if (currentView === "inbox") {
      return (
        <TaskList
          title="Inbox"
          tasks={tasks.filter((task) => task.listId === null)}
          onAddTask={(title) => createTask(title, null)}
          onToggleTask={toggleTask}
          onRenameTask={renameTask}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
        />
      )
    }

    if (currentView === "list") {
      const selectedList = lists.find(
        (list) => list.id === selectedListId
      )

      if (!selectedList) {
        return <p>Select a list to get started.</p>
      }

      return (
        <TaskList
          title={selectedList.name}
          tasks={tasks.filter(
            (task) => task.listId === selectedList.id
          )}
          onAddTask={(title) => createTask(title, selectedList.id)}
          onToggleTask={toggleTask}
          onRenameTask={renameTask}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
        />
      )
    }

    if (currentView === "week") return <Week />
    if (currentView === "month") return <Month />

    return <Today />
  }

  return (
    <div className="app">
      <header className="header">
        <h1>My Schedule</h1>

        <ViewNavigation
          currentView={currentView}
          onViewChange={changeView}
        />
      </header>

      <div className="app-body">
        <Sidebar
          lists={lists}
          tasks={tasks}
          currentView={currentView}
          selectedListId={selectedListId}
          onSelectInbox={selectInbox}
          onSelectList={selectList}
          onCreateList={createList}
          onRenameList={renameList}
          onDeleteList={deleteList}
        />

        <main className="main-content">
          {renderMainContent()}
        </main>

        <StatsPanel />
      </div>
    </div>
  )
}

export default App