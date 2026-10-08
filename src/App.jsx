import { useState } from "react"

import Sidebar from "./components/Sidebar"
import ViewNavigation from "./components/ViewNavigation"
import StatsPanel from "./components/StatsPanel"

import Today from "./views/Today"
import Week from "./views/Week"
import Month from "./views/Month"

import "./App.css"

const App = () => {
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
        <Sidebar />

        <main className="main-content">
          {renderView()}
        </main>

        <StatsPanel />
      </div>
    </div>
  )
}

export default App