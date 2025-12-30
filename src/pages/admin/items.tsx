import { useCallback, useEffect, useState } from 'react'
import ItemFilters from '@/components/ItemFilters'
import ItemTable from '@/components/ItemTable'
import { Pagination } from '@/components/Pagination'
import { fetchItems, FilterType, ItemType } from '../../services/item'

export default function AdminItems() {
    const [items, setItems] = useState<ItemType[]>([])
    const [filters, setFilters] = useState<FilterType>({
        name: "",
        category_id: "",
        sub_category_id: "",
        minStock: "",
        maxStock: ""
    })

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        itemsPerPage: 10,
        total: 0,
    })

    const loadItems = useCallback(async (
        customFilters = filters,
        page = pagination.page,
        limit = pagination.itemsPerPage
    ) => {
        const res = await fetchItems({
            ...customFilters,
            page,
            limit,
        })

        setItems(res.items)
        setPagination(res.pagination)
    }, [filters, pagination.page, pagination.itemsPerPage])

    /* Re-fetch on filters change and pagniation change */
    useEffect(() => {
        loadItems(filters, 1, pagination.itemsPerPage)
    }, [filters, loadItems, pagination.itemsPerPage])

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Filters */}
            <ItemFilters onChange={setFilters} />

            {/* Items Table */}
            <ItemTable items={items} isAdmin onRestock={() => loadItems()} onDelete={() => loadItems()} />

            {/* Pagination */}
            {pagination.total > pagination.itemsPerPage && (
                <Pagination
                    contentType="Item"
                    paginationData={pagination}
                    onPageChange={(page) =>
                        loadItems(filters, page, pagination.itemsPerPage)
                    }
                    onPageSizeChange={(size) =>
                        loadItems(filters, 1, size)
                    }
                />
            )}
        </div>
    )
}
