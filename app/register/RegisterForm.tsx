"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";
import { FaKissWinkHeart } from "react-icons/fa";


interface RegisterFormProps {
    currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            router.push("/cart");
            router.refresh();

        }
    }, [currentUser, router]);


    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios
            .post("/api/register", data)
            .then(() => {
                toast.success("Tài khoản đã được tạo thành công!");

                signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                }).then((callback) => {

                    if (callback?.ok) {
                        router.push("/cart");
                        router.refresh();
                        toast.success("Logged In");
                    }
                    if (callback?.error) {
                        toast.error(callback.error);
                    }
                });
            })
            .catch(() => toast.error("Đã xảy ra lỗi"))
            .finally(() => {

                setIsLoading(false);
            });

    };

    if (currentUser) {
        return <p className="text-center">Logged in. Redirecting ...</p>;
    }

    return (
        <>
            <Heading title="Trang Đăng Ký Form MayAnhGT With Love " />
            <FaKissWinkHeart />
            <Button
                outline
                label="Tiếp tục Với Google"
                icon={AiOutlineGoogle}
                onClick={() => { signIn("google") }}
            />
            <hr className="bg-slate-300 w-full h-px" />
            <Input
                id="name"
                label="name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <Input
                id="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="password" />
            <Button
                label={isLoading ? "Đang tải ..." : "Đăng ký"}
                onClick={handleSubmit(onSubmit)}
            />

            <p className="text-sm">
                Bạn có sẵn sàng để tạo tài khoản? {""}<Link className="underline" href="/login">
                    Đăng nhập
                </Link>
            </p>
        </>

    );
};

export default RegisterForm;