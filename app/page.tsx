export const revalidate = 0;


import Container from "./components/Container";
import HomeBanner from "./components/HomeBanner";
import { truncateText } from "@/utils/truncateText";
import { products } from "@/utils/products";
import ProductCard from "./components/products/ProductCard";
import getProducts, { IProductParams } from "@/actions/getProducts";
import NullData from "./components/NullData";


interface HomeProps {
  searchParams: IProductParams
}
export default async function Home({ searchParams }: HomeProps) {

  const products = await getProducts(searchParams)

  if (products.length === 0) {
    return <NullData title='Ối! Không tìm thấy sản phẩm nào Nhấp vào "Tất cả" để xóa bộ lọc ' />
  }

  //Thuật toán xáo trộn Fisher-Yates
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }

    return array
  }

  const shuffledProducts = shuffleArray(products)

  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {shuffledProducts.map((product: any) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
