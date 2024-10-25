import CategoryType from "../category/CategoryType";
import ItemType from "../item/ItemType";


interface StockType {

    id?: number,
    quantity: number,
    categoryId: number,
    category?: CategoryType,
    itemId: number,
    item?: ItemType
}

export default StockType;
