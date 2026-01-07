import { useCallback, useEffect, useState } from "react"
import ItemFilters from "@/components/ItemFilters"
import ItemTable from "@/components/ItemTable"
import ItemForm from "@/components/ItemForm"
import { Pagination } from "@/components/Pagination"
import { fetchItems, createItem, FilterType, ItemType } from "../../services/item"

export default function AdminItems() {
    const [items, setItems] = useState<ItemType[]>([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState<FilterType>({
        name: "",
        category_id: "",
        sub_category_id: "",
        minStock: "",
        maxStock: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    })

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        itemsPerPage: 10,
        total: 0,
    })

    const loadItems = useCallback(
        async (customFilters: FilterType, page: number, limit: number) => {
            try {
                const res = await fetchItems({ ...customFilters, page, limit })
                setItems(res.items)
                setPagination(res.pagination)
            } catch {

            }
        },
        []
    )

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadItems(filters, currentPage, pagination.itemsPerPage)
    }, [filters, currentPage, pagination.itemsPerPage, loadItems])

    const handleSort = (column: string) => {
        setFilters(prev => ({
            ...prev,
            sortBy: column,
            sortOrder:
                prev.sortBy === column && prev.sortOrder === "asc"
                    ? "desc"
                    : "asc",
        }))
        setCurrentPage(1)
    }


    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Manage Items
                </h1>

                <button
                    onClick={() => setShowCreateForm(prev => !prev)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md
                               hover:bg-blue-700 transition"
                >
                    {showCreateForm ? "Close Form" : "+ Add Item"}
                </button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <ItemForm
                    mode="create"
                    role="admin"
                    onClose={() => setShowCreateForm(false)}
                    onSubmit={async (values) => {
                        const formData = new FormData()
                        Object.entries(values).forEach(([k, v]) => {
                            console.log(k, v)
                            if (k !== "image") formData.append(k, String(v))
                        })
                        if (values.image instanceof File) {
                            formData.append("image", values.image)
                        }
                        await createItem(formData)
                        setShowCreateForm(false)
                        loadItems(filters, currentPage, pagination.itemsPerPage)
                    }}
                />
            )}

            {/* Filters */}
            <ItemFilters onChange={setFilters} />

            {/* Table */}
            <ItemTable
                items={items}
                isAdmin
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSort={handleSort}
                onDelete={() => loadItems(filters, currentPage, pagination.itemsPerPage)}
                onRestock={() => loadItems(filters, currentPage, pagination.itemsPerPage)}
            />

            {/* Pagination */}
            {items.length > 0 && (
                <Pagination
                    contentType="Item"
                    paginationData={pagination}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setPagination(p => ({ ...p, itemsPerPage: size }))
                        setCurrentPage(1)
                    }}
                />
            )}
        </div>
    )
}
