'use client'

import { useCallback, useEffect, useState } from 'react'
import ItemFilters from '@/components/ItemFilters'
import ItemTable from '@/components/ItemTable'
import { Pagination } from '@/components/Pagination'
import { buyItem, fetchItems, FilterType, ItemType } from '../../services/item'

export default function UserItems() {
    const [items, setItems] = useState<ItemType[]>([])
    const [currentPage, setCurrentPage] = useState(1)
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
        itemsPerPage: 1,
        total: 0,
    })

    const loadItems = useCallback(
        async (customFilters: FilterType, page: number, limit: number) => {
            const res = await fetchItems({
                ...customFilters,
                page,
                limit,
            })

            setItems(res.items)
            setPagination(res.pagination)
        },
        []
    )


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadItems(filters, currentPage, pagination.itemsPerPage)
    }, [filters, currentPage, pagination.itemsPerPage, loadItems])

    const onBuy = async (itemId: number, quantity: number) => {
        await buyItem(itemId, quantity)

        // refresh items after buy
        loadItems(filters, currentPage, pagination.itemsPerPage)
    }


    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Available Items</h2>

            <ItemFilters onChange={setFilters} />

            <ItemTable items={items} isAdmin={false} onBuy={onBuy} />

            <Pagination
                contentType="Item"
                paginationData={pagination}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                    setPagination((prev) => ({ ...prev, itemsPerPage: size }))
                    setCurrentPage(1)
                }}
            />
        </div>
    )
}
