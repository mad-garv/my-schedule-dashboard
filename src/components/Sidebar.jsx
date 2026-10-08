const Sidebar = () => {
    return (
      <aside className="sidebar">
        <div className="sidebar-section">
          <h2>MY SCHEDULE</h2>
        </div>
  
        <div className="sidebar-section">
          <button className="sidebar-item">Inbox</button>
        </div>
  
        <div className="sidebar-section">
          <h3>LISTS</h3>
  
          <button className="sidebar-item">MA201</button>
          <button className="sidebar-item">CS200</button>
          <button className="sidebar-item">Project X</button>
          <button className="sidebar-item">Personal</button>
        </div>
      </aside>
    )
  }
  
  export default Sidebar