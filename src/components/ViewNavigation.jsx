
const ViewNavigation = ({ currentView, onViewChange }) => {
  const views = [
    { id: "today", label: "Today", symbol: "◷" },
    { id: "week", label: "Week", symbol: "▦" },
    { id: "month", label: "Month", symbol: "▤" },
  ]

  return (
    <nav className="view-navigation" aria-label="Calendar view">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          className={currentView === view.id ? "active" : ""}
          onClick={() => onViewChange(view.id)}
        >
          <span className="view-navigation-symbol">
            {view.symbol}
          </span>
          <span>{view.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default ViewNavigation