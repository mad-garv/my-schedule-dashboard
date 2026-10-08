const Sidebar = ({
  lists,
  selectedListId,
  onSelectList,
  onCreateList,
  onRenameList,
  onDeleteList
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2>MY SCHEDULE</h2>
      </div>

      <div className="sidebar-section">
        <button className="sidebar-item">
          Inbox
        </button>
      </div>

      <div className="sidebar-section">
        <h3>LISTS</h3>

        {lists.map((list) => (
          <button
            key={list.id}
            className={`sidebar-item ${selectedListId === list.id ? "selected" : ""
              }`}
            onClick={() => onSelectList(list.id)}
            onDoubleClick={() => onRenameList(list.id)}
            onContextMenu={(event) => {
              event.preventDefault()
              onDeleteList(list.id)
            }}
          >
            {list.name}
          </button>
        ))}

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