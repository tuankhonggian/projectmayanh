"use client";

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";
import Status from "@/app/components/Status";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import moment from "moment";

interface OrdersOrdersClientProps {
    orders: ExtendedOrder[]
}

type ExtendedOrder = Order & {
    user: User;
}

const OrdersClient: React.FC<OrdersOrdersClientProps> = ({ orders }) => {

    const router = useRouter();
    let rows: any = [];

    if (orders) {
        rows = orders.map((order) => {
            return {
                id: order.id,
                customer: order.user.name,
                amount: formatPrice(order.amount / 100),
                paymentStatus: order.status,
                date: moment(order.createDate).fromNow(),
                deliveryStatus: order.deliveryStatus,
            };
        });
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'customer', headerName: 'Tên khách hàng', width: 220 },
        {
            field: 'amount', headerName: 'Số lượng', width: 150,
            renderCell: (params) => {
                return (
                    <div className="font-cold text-slate-800">
                        {params.row.amount}
                    </div>
                )
            }
        },

        {
            field: 'paymentStatus', headerName: 'Tình trạng thanh toán', width: 150,
            renderCell: (params) => {
                return (
                    <div>{params.row.paymentStatus === 'pending' ? (
                        <Status
                            text="Chưa giải quyết "
                            icon={MdAccessTimeFilled}
                            bg="bg-slate-200"
                            color="teal-slate-700"
                        />) : params.row.paymentStatus === 'complete' ? (
                            <Status
                                text="Hoàn thành "
                                icon={MdDone}
                                bg="bg-green-200"
                                color="teal-green-700"
                            />
                        )
                        : (
                            <></>
                        )}
                    </div>
                )
            }
        },
        {
            field: 'deliverStatus', headerName: 'Tình trạng giao hàng', width: 150,
            renderCell: (params) => {
                return (
                    <div>{params.row.deliverStatus === 'pending' ? (
                        <Status
                            text="Chưa giải quyết "
                            icon={MdAccessTimeFilled}
                            bg="bg-slate-200"
                            color="teal-slate-700"
                        />) : params.row.deliverStatus === 'dispatched' ? (
                            <Status
                                text="Đang đi đơn hàng "
                                icon={MdDeliveryDining}
                                bg="bg-purple-200"
                                color="teal-purple-700"
                            />
                        ) : params.row.deliverStatus === 'delivered' ?
                        (
                            <Status
                                text="Đã giao hàng "
                                icon={MdDone}
                                bg="bg-green-200"
                                color="teal-green-700"
                            />
                        )
                        : <></>}
                    </div>
                )
            }
        },
        {
            field: "date",
            headerName: "Date",
            width: 130,
        },
        {
            field: 'action',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="flex justify-between gap-4 w-full">
                        <ActionBtn icon={MdRemoveRedEye} onClick={() => {
                            router.push(`order/${params.row.id}`);
                        }} />
                    </div>
                )
            }
        },
    ]

    return (
        <div className="max-w-[1150px m-auto text-xl" >
            <div className="mb-4 mt-8">
                <Heading title="Quản lý đơn hàng" center />
            </div>

            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[9, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>

        </div>
    );
}

export default OrdersClient;