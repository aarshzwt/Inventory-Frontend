import { GET } from "@/utils/axiosInstance";

export type Category = {
  id: number;
  name: string;
};

export type CategoryResponse = {
  categories: Category[];
  message: string;
};

export type SubCategoryResponse = {
  subCategories: Category[];
  message: string;
};

export const fetchCategories = () =>
  GET<CategoryResponse>("/category");

export const fetchSubCategories = (categoryId?: number) =>
  GET<SubCategoryResponse>("/sub-category", {
    params: categoryId ? { category_id: categoryId } : {},
  });
