import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetails";
import ListRating from "./ListRating";
import { products } from "@/utils/products";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/NullData";
import AddRating from "./AddRating";
import { getCurrentUser } from "@/actions/getCurrentUser";


interface IParams {
    productId?: string;
}

const Product = async ({ params }: { params: IParams }) => {

    const product = await getProductById(params)
    const user = await getCurrentUser()

    if (!product) return <NullData title="Ối! Sản phẩm có id đã cho không tồn tại" />

    // const productId = Object.values(params)[0];
    // const product = products.find((item) => item.id === productId);

    // // Kiểm tra nếu không tìm thấy sản phẩm
    // if (!product) {
    //     return <div>Sản phẩm không tồn tại.</div>;
    // }

    return (
        <div className="p-8" >
            <Container>
                <ProductDetails product={product} />
                <div className="flex flex-col mt-20 gap-4">
                    <AddRating product={product} user={user} />
                    <ListRating product={product} />
                </div>
            </Container>
        </div>
    );
};

export default Product;
