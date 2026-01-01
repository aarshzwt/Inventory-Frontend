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

                const res = await fetchItems({
                    ...customFilters,
                    page,
                    limit,
                })

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


    return (
        <div className="max-w-6xl mx-auto p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Items</h1>

                <button
                    onClick={() => setShowCreateForm((prev) => !prev)}
                    className="px-4 py-2 rounded hover:bg-primary-700"
                >
                    {showCreateForm ? "Close" : "+ Create Item"}
                </button>
            </div>

            {/* Create Item Form */}
            {showCreateForm && (
                <ItemForm
                    mode="create"
                    role="admin"
                    onClose={() => setShowCreateForm(false)}
                    onSubmit={async (values) => {
                        const formData = new FormData()

                        formData.append("name", values.name)
                        formData.append("brand", values.brand)
                        formData.append("category_id", String(values.category_id))
                        formData.append("sub_category_id", String(values.sub_category_id))
                        formData.append("stock", String(values.stock))
                        formData.append("description", values.description)
                        formData.append("price", String(values.price))

                        // Append image ONLY if it's a File
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

            {/* Items Table */}
            <ItemTable
                items={items}
                isAdmin
                onRestock={() =>
                    loadItems(filters, currentPage, pagination.itemsPerPage)
                }
                onDelete={() =>
                    loadItems(filters, currentPage, pagination.itemsPerPage)
                }
            />

            {/* Pagination */}
            {items.length !== 0 && (

                <Pagination
                    contentType="Item"
                    paginationData={pagination}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setPagination((prev) => ({ ...prev, itemsPerPage: size }))
                        setCurrentPage(1)
                    }}
                />
            )}
        </div>
    )
}
