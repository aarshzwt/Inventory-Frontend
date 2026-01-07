type SortHeaderProps = {
    label: string
    column: string
    activeSortBy?: string
    sortOrder?: "asc" | "desc"
    onSort?: (column: string) => void
    align?: "left" | "center" | "right"
}

export default function SortHeader({
    label,
    column,
    activeSortBy,
    sortOrder,
    onSort,
    align = "left",
}: SortHeaderProps) {
    const isActive = activeSortBy === column

    return (
        <th
            onClick={() => onSort?.(column)}
            className={`px-4 py-3 font-semibold cursor-pointer select-none
        ${align === "center" ? "text-center" : "text-left"}
      `}
        >
            <div
                className={`flex items-center gap-1
          ${align === "center" ? "justify-center" : ""}
        `}
            >
                {label}

                {isActive && (
                    <span className="text-sm text-black">
                        {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                )}
            </div>
        </th>
    )
}
