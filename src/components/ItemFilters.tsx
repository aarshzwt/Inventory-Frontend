import { useEffect, useState } from "react";
import {
    Category,
    fetchCategories,
    fetchSubCategories,
} from "../services/category";
import { FilterType } from "../services/item";

export default function ItemFilters({ onChange }: { onChange: (filters: FilterType) => void }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<Category[]>([]);

    const [filters, setFilters] = useState<FilterType>({
        name: "",
        category_id: "",
        sub_category_id: "",
        minStock: "",
        maxStock: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategories();
                if (res.categories)
                    setCategories(res.categories);
            } catch {
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadSubCategories = async () => {
            if (!filters.category_id) {
                setSubCategories([]);
                return;
            }

            try {
                const res = await fetchSubCategories(Number(filters.category_id));
                if (res.subCategories)
                    setSubCategories(res.subCategories);
            } catch {
            }
        };
        loadSubCategories();

    }, [filters.category_id]);
    useEffect(() => {
        const handler = setTimeout(() => {
            onChange(filters);
        }, 400); // ⏱ debounce delay

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.name]);

    const updateFilters = (key: string, value: string) => {
        const updated = { ...filters, [key]: value };

        if (key === "category_id") {
            updated.sub_category_id = "";
        }

        setFilters(updated);
        if (key !== "name") {
            onChange(updated);
        }
    };

    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                    placeholder="Search by name"
                    className="border px-3 py-2 rounded-md"
                    value={filters.name}
                    onChange={e => updateFilters("name", e.target.value)}
                />

                <select
                    className="border px-3 py-2 rounded-md"
                    value={filters.category_id}
                    onChange={e => updateFilters("category_id", e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="border px-3 py-2 rounded-md disabled:bg-gray-100"
                    value={filters.sub_category_id}
                    disabled={!filters.category_id}
                    onChange={e => updateFilters("sub_category_id", e.target.value)}
                >
                    <option value="">All Sub Categories</option>
                    {subCategories.map(sc => (
                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                    ))}
                </select>

                <input
                    type="number"
                    className="border px-3 py-2 rounded-md"
                    placeholder="Min stock"
                    value={filters.minStock}
                    onChange={e => updateFilters("minStock", e.target.value)}
                />

                <input
                    type="number"
                    className="border px-3 py-2 rounded-md"
                    placeholder="Max stock"
                    value={filters.maxStock}
                    onChange={e => updateFilters("maxStock", e.target.value)}
                />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => {
                        const reset = {
                            name: "",
                            category_id: "",
                            sub_category_id: "",
                            minStock: "",
                            maxStock: ""
                        }
                        setFilters(reset)
                        onChange(reset)
                    }}
                    className="text-sm text-gray-600 hover:text-black underline"
                >
                    Reset filters
                </button>
            </div>
        </div>
    )
}
