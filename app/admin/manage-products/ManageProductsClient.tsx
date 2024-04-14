"use client";

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from "react-icons/md";
import Status from "@/app/components/Status";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";

interface ManageProductsClientProps {
    products: Product[]
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({ products }) => {

    const router = useRouter();
    const storage = getStorage(firebaseApp);
    let rows: any = [];
    if (products) {
        rows = products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                price: formatPrice(product.price),
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                images: product.images,
            }
        })
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'name', headerName: 'Name', width: 220 },
        {
            field: 'price', headerName: 'Price(USD)', width: 150,
            renderCell: (params) => {
                return (
                    <div className="font-cold text-slate-800">
                        {params.row.price}
                    </div>
                )
            }
        },
        { field: 'category', headerName: 'Category', width: 100 },
        { field: 'brand', headerName: 'Brand', width: 100 },
        {
            field: 'inStock', headerName: 'inStock', width: 150,
            renderCell: (params) => {
                return (
                    <div>{params.row.inStock === true ? (
                        <Status
                            text="Trong Kho "
                            icon={MdDone}
                            bg="bg-teal-200"
                            color="teal-teal-700"
                        />) : (
                        <Status
                            text="Hết Hàng "
                            icon={MdClose}
                            bg="bg-rose-200"
                            color="teal-rose-700"
                        />
                    )}</div>
                )
            }
        },
        {
            field: 'action',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="flex justify-between gap-4 w-full">
                        <ActionBtn icon={MdCached} onClick={() => {
                            handleToggleStock(params.row.id, params.row.inStock)
                        }} />
                        <ActionBtn icon={MdDelete} onClick={() => {
                            handleDelete(params.row.id, params.row.images)
                        }} />
                        <ActionBtn icon={MdRemoveRedEye} onClick={() => {
                            router.push(`product/${params.row.id}`);
                        }} />
                    </div>
                )
            }
        },
    ]

    const handleToggleStock = useCallback((id: string, inStock: boolean) => {
        axios.put('/api/product', {
            id,
            inStock: !inStock,
        }).then((res) => {
            toast.success('Trạng thái sản phẩm đã thay đổi');
            router.refresh();
        }).catch((err) => {
            toast.error('Ối! Đã xảy ra lỗi');
            console.log(err);
        });
    }, [router]);

    const handleDelete = useCallback(async (id: string, images: any[]) => {
        toast('Đang xóa sản phẩm, vui lòng chờ!');

        const handleImageDelete = async () => {
            try {
                for (const item of images) {
                    if (item.image) {
                        const imageRef = ref(storage, item.image);
                        await deleteObject(imageRef);
                        console.log("Đã xóa hình ảnh", item.image)
                    }
                }
            } catch (error) {
                return console.log("Lỗi xóa hình ảnh!", error)
            }
        };

        await handleImageDelete();

        axios.delete(`/api/product/${id}`).then(
            (res) => {
                toast.success('Đã xóa sản phẩm');
                router.refresh();
            }
        ).catch((err) => {
            toast.error("Không thể xóa sản phẩm");
            console.log(err);
        });

    }, [router, storage])

    return (
        <div className="max-w-[1150px m-auto text-xl" >
            <div className="mb-4 mt-8">
                <Heading title="Quản lý sản phẩm" center />
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

export default ManageProductsClient;