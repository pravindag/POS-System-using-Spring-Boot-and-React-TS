import CategoryType from "../category/CategoryType";

interface ItemType {

    id?: number,
    name: string,
    description: string,
    price: number,
    categoryId: number,
    category?: CategoryType,
    image: File | null,
    imagePath?: string,
    quantity: number,
    stockQuantity?: number
}

export default ItemType;