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
        maxStock: ""
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
        <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Name */}
            <input
                placeholder="Search item..."
                className="border px-3 py-2 rounded"
                value={filters.name}
                onChange={e => updateFilters("name", e.target.value)}
            />

            {/* Category */}
            <select
                className="border px-3 py-2 rounded"
                value={filters.category_id}
                onChange={e => updateFilters("category_id", e.target.value)}
            >
                <option value="">All Categories</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {/* Sub Category */}
            <select
                className="border px-3 py-2 rounded disabled:opacity-50"
                value={filters.sub_category_id}
                disabled={!filters.category_id}
                onChange={e => updateFilters("sub_category_id", e.target.value)}
            >
                <option value="">All Sub Categories</option>
                {subCategories.map(sc => (
                    <option key={sc.id} value={sc.id}>
                        {sc.name}
                    </option>
                ))}
            </select>

            <input
                name="minStock"
                type="number"
                className="border px-4 py-2.5 rounded-lg w-full bg-white/70"
                value={filters.minStock}
                onChange={(e) => updateFilters("minStock", e.target.value)}
                placeholder="Min Stock"
            />
            <input
                name="maxStock"
                type="number"
                className="border px-4 py-2.5 rounded-lg w-full bg-white/70"
                value={filters.maxStock}
                onChange={(e) => updateFilters("maxStock", e.target.value)}
                placeholder="Max Stock"
            />

            {/* Reset */}
            <button
                className="bg-gray-200 rounded px-3 py-2"
                onClick={() => {
                    const reset = {
                        name: "",
                        category_id: "",
                        sub_category_id: "",
                        minStock: "",
                        maxStock: ""
                    };
                    setFilters(reset);
                    onChange(reset);
                }}
            >
                Reset
            </button>
        </div>
    );
}
