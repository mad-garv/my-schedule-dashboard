
const StatsPanel = ({ onCollapse }) => {
  return (
    <aside className="stats-panel">
      <div className="stats-panel-header">
        <h2>Overview</h2>
        <button
          className="icon-button"
          type="button"
          onClick={onCollapse}
          aria-label="Collapse statistics panel"
          title="Collapse statistics panel"
        >
          ›
        </button>
      </div>

      <p className="stats-panel-subtitle">
        Your activity at a glance
      </p>

      <div className="stats-placeholder">
        <div className="stats-placeholder-icon">◌</div>
        <p className="stats-placeholder-title">Your stats, here</p>
        <p>Progress rings and activity summaries will appear here.</p>
      </div>
    </aside>
  )
}

export default StatsPanel