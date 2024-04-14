"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Heading from "../components/Heading";
import Button from "../components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "@/utils/formatPrice";
import { SafeUser } from "@/types";
import { useRouter } from "next/navigation";


interface CartClientProps {
    currentUser: SafeUser | null
}
const CartClient: React.FC<CartClientProps> = ({ currentUser }) => {
    const { cartProducts, handleClearCart, cartTotalAmount } = useCart();

    const router = useRouter();

    if (!cartProducts || cartProducts.length === 0) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-2xl">Giỏ hàng của bạn đang trống</div>
                <div>
                    <Link href={"/"} className="text-blue-500 flex items-center gap-1 mt-2">
                        <MdArrowBack />
                        <span>Bắt đầu mua sắm</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Heading title="Giỏ hàng" center />
            <div className="grid grid-cols-5 text-sm gap-4 pb-2 items-center mt-8">
                <div className="col-span-2 justify-self-start">SẢN PHẨM</div>
                <div className="justify-self-center">GIÁ</div>
                <div className="justify-self-center">SỐ LƯỢNG</div>
                <div className="justify-self-center">TỔNG</div>
            </div>
            <div>
                {cartProducts && cartProducts.map((item) => {
                    return <ItemContent key={item.id} item={item} />;
                })}
            </div>
            <div className="border-t border-gray-200 py-4 flex justify-between gap-4">
                <div className="w-[90px]">
                    <Button
                        label="Xóa giỏ hàng"
                        onClick={() => {
                            handleClearCart();
                        }}
                        small
                        outline
                    />
                </div>
                <div className="text-sm flex flex-col gap-1 items-start">
                    <div>
                        <div className="flex justify-between w-full text-base font-semibold">
                            <span>Tổng cộng</span>
                            <span>{formatPrice(cartTotalAmount)}</span>
                        </div>
                        <p className="text-gray-500">
                            Thuế và vận chuyển sẽ được tính khi thanh toán
                        </p>
                        <Button
                            label={currentUser ? "Thanh toán" : "Đăng Nhập Để Thanh Toán"}
                            outline={currentUser ? false : true}
                            onClick={() => {
                                currentUser ? router.push('/checkout') : router.push('/login')
                            }}
                        />
                        <Link href={"/"} className="text-blue-500 flex items-center gap-1 mt-2">
                            <MdArrowBack />
                            <span>Tiếp tục mua sắm</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartClient;

