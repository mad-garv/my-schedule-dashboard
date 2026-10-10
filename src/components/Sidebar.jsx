
import ViewNavigation from "./ViewNavigation"

const Sidebar = ({
  lists,
  tasks,
  currentView,
  selectedListId,
  theme,
  onToggleTheme,
  onCollapse,
  onViewChange,
  onSelectInbox,
  onSelectList,
  onCreateList,
  onRenameList,
  onDeleteList,
}) => {
  const inboxCount = tasks.filter(
    (task) => task.listId === null && !task.completed
  ).length

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="brand-mark">S</span>
          <span>Schedule</span>
        </div>

        <button
          className="icon-button"
          type="button"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          ‹
        </button>
      </div>

      <div className="sidebar-navigation">
        <p className="sidebar-label">WORKSPACE</p>
        <ViewNavigation
          currentView={currentView}
          onViewChange={onViewChange}
        />

        <button
          className={`sidebar-item ${
            currentView === "inbox" ? "selected" : ""
          }`}
          onClick={onSelectInbox}
        >
          <span className="sidebar-item-main">
            <span className="sidebar-symbol">↳</span>
            <span>Inbox</span>
          </span>
          <span className="sidebar-count">{inboxCount}</span>
        </button>
      </div>

      <div className="sidebar-lists">
        <div className="sidebar-list-heading">
          <p className="sidebar-label">YOUR LISTS</p>
          <button
            className="icon-button icon-button-small"
            type="button"
            onClick={onCreateList}
            aria-label="Create list"
            title="Create list"
          >
            +
          </button>
        </div>

        <div className="sidebar-list-scroll">
          {lists.map((list) => {
            const remaining = tasks.filter(
              (task) =>
                task.listId === list.id && !task.completed
            ).length

            return (
              <div className="sidebar-list-row" key={list.id}>
                <button
                  className={`sidebar-item ${
                    currentView === "list" &&
                    selectedListId === list.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => onSelectList(list.id)}
                  onDoubleClick={() => onRenameList(list.id)}
                  onContextMenu={(event) => {
                    event.preventDefault()
                    onDeleteList(list.id)
                  }}
                  title="Double-click to rename; right-click to delete"
                >
                  <span className="sidebar-item-main">
                    <span className="sidebar-list-dot" />
                    <span className="sidebar-item-name">
                      {list.name}
                    </span>
                  </span>
                  <span className="sidebar-count">{remaining}</span>
                </button>
              </div>
            )
          })}

          {lists.length === 0 && (
            <p className="sidebar-empty">No lists yet.</p>
          )}

          <button
            className="sidebar-item new-list-button"
            onClick={onCreateList}
          >
            <span className="sidebar-item-main">
              <span className="sidebar-symbol">+</span>
              <span>New list</span>
            </span>
          </button>
        </div>
      </div>

      <footer className="sidebar-footer">
        <button
          className="sidebar-footer-button"
          type="button"
          onClick={onToggleTheme}
        >
          <span>{theme === "dark" ? "☼" : "☾"}</span>
          <span>Switch to {theme === "dark" ? "light" : "dark"} mode</span>
        </button>
      </footer>
    </aside>
  )
}

export default Sidebar