import { useEffect, useState } from "react"

import Sidebar from "./components/Sidebar"
import ViewNavigation from "./components/ViewNavigation"
import StatsPanel from "./components/StatsPanel"

import Today from "./views/Today"
import Week from "./views/Week"
import Month from "./views/Month"

import "./App.css"

const App = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem("scheduleLists")

    if (savedLists) {
      return JSON.parse(savedLists)
    }

    return [
      {
        id: 1,
        name: "MA201"
      },
      {
        id: 2,
        name: "CS200"
      },
      {
        id: 3,
        name: "Project X"
      },
      {
        id: 4,
        name: "Personal"
      }
    ]
  })

  const [selectedListId, setSelectedListId] = useState(null)

  const createList = () => {
    const name = window.prompt("Enter a list name")

    if (!name || !name.trim()) {
      return
    }

    const newList = {
      id: Date.now(),
      name: name.trim()
    }

    setLists((currentLists) => [
      ...currentLists,
      newList
    ])
  }

  const renameList = (listId) => {
    const list = lists.find((list) => list.id === listId)

    if (!list) {
      return
    }

    const newName = window.prompt(
      "Enter a new list name",
      list.name
    )

    if (!newName || !newName.trim()) {
      return
    }

    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? { ...list, name: newName.trim() }
          : list
      )
    )
  }

  const deleteList = (listId) => {
    const list = lists.find((list) => list.id === listId)

    if (!list) {
      return
    }

    const confirmed = window.confirm(
      `Delete "${list.name}"?`
    )

    if (!confirmed) {
      return
    }

    setLists((currentLists) =>
      currentLists.filter((list) => list.id !== listId)
    )

    if (selectedListId === listId) {
      setSelectedListId(null)
    }
  }

  const [currentView, setCurrentView] = useState("today")

  const renderView = () => {
    if (currentView === "today") {
      return <Today />
    }

    if (currentView === "week") {
      return <Week />
    }

    if (currentView === "month") {
      return <Month />
    }
  }

  useEffect(() => {
    localStorage.setItem(
      "scheduleLists",
      JSON.stringify(lists)
    )
  }, [lists])

  return (
    <div className="app">
      <header className="header">
        <h1>My Schedule</h1>

        <ViewNavigation
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </header>

      <div className="app-body">
        <Sidebar
          lists={lists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          onCreateList={createList}
          onRenameList={renameList}
          onDeleteList={deleteList}
        />

        <main className="main-content">
          {renderView()}
        </main>

        <StatsPanel />
      </div>
    </div>
  )
}

export default App