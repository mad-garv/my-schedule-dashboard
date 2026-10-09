
const Sidebar = ({
  lists,
  tasks,
  currentView,
  selectedListId,
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
      <div className="sidebar-section">
        <h2>MY SCHEDULE</h2>
      </div>

      <div className="sidebar-section">
        <button
          className={`sidebar-item ${
            currentView === "inbox" ? "selected" : ""
          }`}
          onClick={onSelectInbox}
        >
          <span>Inbox</span>
          <span className="sidebar-count">{inboxCount}</span>
        </button>
      </div>

      <div className="sidebar-section">
        <h3>LISTS</h3>

        {lists.map((list) => {
          const remaining = tasks.filter(
            (task) => task.listId === list.id && !task.completed
          ).length

          return (
            <div className="sidebar-list-row" key={list.id}>
              <button
                className={`sidebar-item ${
                  currentView === "list" && selectedListId === list.id
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
                <span>{list.name}</span>
                <span className="sidebar-count">{remaining}</span>
              </button>
            </div>
          )
        })}

        <button
          className="sidebar-item new-list-button"
          onClick={onCreateList}
        >
          + New List
        </button>
      </div>
    </aside>
  )
}

export default Sidebar