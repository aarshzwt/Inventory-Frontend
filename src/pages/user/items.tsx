'use client'

import { useCallback, useEffect, useState } from 'react'
import ItemFilters from '@/components/ItemFilters'
import ItemTable from '@/components/ItemTable'
import { Pagination } from '@/components/Pagination'
import { buyItem, fetchItems, FilterType, ItemType } from '../../services/item'

export default function UserItems() {
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
        itemsPerPage: 1,
        total: 0,
    })

    const loadItems = useCallback(async (
        customFilters = filters,
        page = pagination.page,
        limit = pagination.itemsPerPage
    ) => {
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
    }, [filters, pagination.page, pagination.itemsPerPage])

    useEffect(() => {
        loadItems(filters, 1, pagination.itemsPerPage)
    }, [filters, loadItems, pagination.itemsPerPage])

    const onBuy = async (itemId: number, quantity: number) => {
        await buyItem(itemId, quantity)

        // refresh items after buy
        loadItems()
    }


    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Available Items</h2>

            <ItemFilters onChange={setFilters} />

            <ItemTable items={items} isAdmin={false} onBuy={onBuy} />

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
