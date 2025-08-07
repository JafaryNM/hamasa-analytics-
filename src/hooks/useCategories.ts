import useData from "./useData";
import { Category } from "@/@types/category";

const useCategories = () => useData<Category>("/categories");

export default useCategories;
