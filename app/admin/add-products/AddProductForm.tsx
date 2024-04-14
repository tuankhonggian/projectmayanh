"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import firebaseApp from "@/libs/firebase";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import axios from "axios";
import { useRouter } from "next/navigation";

export type ImageType = {
    color: string,
    colorCode: string,
    image: File | null
}

export type UploadedImageType = {
    color: string,
    colorCode: string,
    image: string,
}

const AddProductForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<ImageType[] | null>();
    const [isProductCreated, setIsProductCreated] = useState(false)
    const router = useRouter();

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            description: '',
            brand: '',
            category: false,
            images: [],
            price: '',
        }
    })

    useEffect(() => {
        setCustomValue('images', images);
    }, [images]);

    useEffect(() => {
        if (isProductCreated) {
            reset();
            setImages(null);
            setIsProductCreated(false);
        }
    }, [isProductCreated, reset])

    const onsubmit: SubmitHandler<FieldValues> = async (data) => {
        console.log("Product Data", data);
        //Tải hình ảnh lên db
        //lưu sản phẩm vào mongodb
        setIsLoading(true)
        let uploadedImages: UploadedImageType[] = []

        if (!data.category) {
            setIsLoading(false)
            return toast.error('Danh mục không được chọn')
        }

        if (!data.images || data.images.length === 0) {
            setIsLoading(false)
            return toast.error('Không có hình ảnh được chọn!')
        }

        const handleImageUploads = async () => {
            toast('Đang tạo sản phẩm, vui lòng chờ ...')
            try {
                for (const item of data.images) {
                    if (item.image) {
                        const fileName = new Date().getTime() + '-' + item.image.name;
                        const storage = getStorage(firebaseApp)
                        const storageRef = ref(storage, `products/${fileName}`);
                        const uploadTask = uploadBytesResumable(storageRef, item.image);

                        await new Promise<void>((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log('Tải lên là ' + progress + '% xong');
                                    switch (snapshot.state) {
                                        case 'paused':
                                            console.log('Tải lên bị tạm dừng');
                                            break;
                                        case 'running':
                                            console.log('Tải lên đang chạy');
                                            break;
                                    }
                                },
                                (error) => {
                                    // Xử lý tải lên không thành công
                                    console.log('Lỗi gửi hình ảnh', error)
                                    reject(error)
                                },
                                () => {
                                    // Xử lý tải lên thành công khi hoàn tất
                                    // Ví dụ: tải xuống URL: https://firebasestorage.googleapis.com/...
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                        uploadedImages.push({
                                            ...item,
                                            image: downloadURL
                                        })
                                        console.log('Tập tin có sẵn tại', downloadURL);
                                        resolve()
                                    }
                                    ).catch((error) => {
                                        console.log('Lỗi nhận URL tải xuống', error);
                                        reject(error);
                                    });
                                }
                            )
                        })
                    }
                }
            } catch (error) {
                setIsLoading(false)
                console.log('Lỗi xử lý tải lên hình ảnh', error);
                return toast.error('Lỗi xử lý tải lên hình ảnh');
            }
        }

        await handleImageUploads();
        const productData = { ...data, images: uploadedImages }

        axios.post('/api/product', productData).then(() => {
            toast.success('Sản phẩm đã được tạo thành công');
            setIsProductCreated(true);
            router.refresh();
        }).catch((error) => {
            toast.error('Đã xảy ra lỗi khi lưu sản phẩm vào db', error);
        }).finally(() => {
            setIsLoading(false);
        })

    }

    const category = watch("category")

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const addImageToState = useCallback((value: ImageType) => {
        setImages((prev) => {
            if (!prev) {
                return [value]
            }

            return [...prev, value]
        })
    }, [])

    const removeImageFromState = useCallback((value: ImageType) => {
        setImages((prev) => {
            if (prev) {
                const filteredImages = prev.filter((item) => item.color != value.color)
                return filteredImages;
            }

            return prev;
        })
    }, [])

    return (
        <>
            <Heading title="Thêm Sản Phẩm" center />
            <Input
                id="name"
                label="Tên Sản Phẩm"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="price"
                label="Giá"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="number"
                required
            />
            <Input
                id="brand"
                label="Thương Hiệu"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <TextArea
                id="description"
                label="Mô tả sản phẩm"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <CustomCheckBox
                id="inStock"
                register={register}
                label="Sản phẩm này còn hàng"
            />
            <div className="w-full font-medium">
                <div className="mb-2 font-semibold">Chọn một danh mục</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
                    {categories.map((item) => {
                        if (item.label === 'All') {
                            return null;
                        }

                        return (
                            <div
                                key={item.label}
                                className="col-span"
                            >
                                <CategoryInput
                                    onClick={(category) => setCustomValue('category', category)}
                                    selected={category === item.label}
                                    label={item.label}
                                    icon={item.icon}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full flex flex-col flex-wrap gap-4">
                <div>
                    <div className="font-bold">
                        Chọn màu sắc sản phẩm có sẵn và tải lên hình ảnh của sản phẩm.
                    </div>
                    <div className="text-sm">
                        Bạn phải tải lên hình ảnh cho mỗi màu đã chọn nếu không lựa chọn màu của bạn sẽ bị bỏ qua.
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {colors.map((item, index) => {
                        return (
                            <SelectColor
                                key={index}
                                item={item}
                                addImageToState={addImageToState}
                                removeImageFromState={removeImageFromState}
                                isProductCreated={isProductCreated}
                            />
                        );
                    })}
                </div>
            </div>
            <Button
                label={isLoading ? 'Đang Tải...' : 'Thêm Sản Phẩm'}
                onClick={handleSubmit(onsubmit)}
            />
        </>
    );
}

export default AddProductForm;