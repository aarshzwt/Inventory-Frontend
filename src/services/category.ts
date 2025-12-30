import { DELETE, GET, PATCH, POST } from "@/utils/axiosInstance";

export type Category = {
  id: number;
  name: string;
};

export type SubCategory = {
  id: number;
  name: string;
  category_id: number;
};

export type CategoryResponse = {
  categories: Category[];
  message: string;
};

export type SubCategoryResponse = {
  subCategories: SubCategory[];
  message: string;
};

export const fetchCategories = () =>
  GET<CategoryResponse>("/category");

export const createCategory = (data: unknown) => POST("/category", data);

export const updateCategory = (id: number, data: unknown) =>
  PATCH(`/category/${id}`, data);

export const deleteCategory = (id: number) =>
  DELETE(`/category/${id}`);


export const fetchSubCategories = (categoryId?: number) =>
  GET<SubCategoryResponse>("/sub-category", {
    params: categoryId ? { category_id: categoryId } : {},
  });
export const createSubCategory = (data: unknown) => POST("/sub-category", data);
export const updateSubCategory = (id: number, data: unknown) =>
  PATCH(`/sub-category/${id}`, data);

export const deleteSubCategory = (id: number) =>
  DELETE(`/sub-category/${id}`);
