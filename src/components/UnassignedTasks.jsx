const UnassignedTasks = ({
    tasks,
    lists,
    onToggleTask,
}) => {
    const sortedTasks = [...tasks].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
    )

    const getListName = (listId) => {
        if (listId === null) return "Inbox"

        return (
            lists.find((list) => list.id === listId)?.name ??
            "Unknown list"
        )

    }

    return (<section className="unassigned-section"> <div className="unassigned-heading"> <p className="view-eyebrow">DAILY TIMELINE</p>


        <span className="unassigned-count">
            {sortedTasks.length}
        </span>
    </div>

        <div className="unassigned-scroll">
            {sortedTasks.length === 0 ? (
                <div className="unassigned-empty">
                    <span className="unassigned-empty-check">✓</span>
                    <span>No all-day tasks for this day.</span>
                </div>
            ) : (
                sortedTasks.map((task) => (
                    <div className="unassigned-row" key={task.id}>
                        <label className="unassigned-task-label">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => onToggleTask(task.id)}
                            />

                            <span className="unassigned-task-title">
                                {task.title}
                            </span>
                        </label>

                        <span className="unassigned-task-list">
                            {getListName(task.listId)}
                        </span>
                    </div>
                ))
            )}
        </div>
    </section>

    )
}

export default UnassignedTasks    