import Container from "@/app/components/Container";
import NullData from "@/app/components/NullData";
import OrdersClient from "./OrderClient";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getOrdersByUserId from "@/actions/getOrdersByUserId";

const Orders = async () => {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return <NullData title="Ối! quyền truy cập bị từ chối" />;
    }

    const orders = await getOrdersByUserId(currentUser.id)
    if (!orders) {
        return <NullData title="Chưa có đơn đặt hàng nào ..." />;
    }

    return (
        <div className="pt-8">
            <Container>
                <OrdersClient orders={orders} />
            </Container>
        </div>
    );
}

export default Orders;
