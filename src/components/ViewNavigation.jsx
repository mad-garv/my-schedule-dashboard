const ViewNavigation = ({ currentView, onViewChange }) => {
    return (
      <nav className="view-navigation">
        <button
          className={currentView === "today" ? "active" : ""}
          onClick={() => onViewChange("today")}
        >
          Today
        </button>
  
        <button
          className={currentView === "week" ? "active" : ""}
          onClick={() => onViewChange("week")}
        >
          Week
        </button>
  
        <button
          className={currentView === "month" ? "active" : ""}
          onClick={() => onViewChange("month")}
        >
          Month
        </button>
      </nav>
    )
  }
  
  export default ViewNavigation