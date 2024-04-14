"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";
import { FaKissWinkHeart } from "react-icons/fa";


interface LoginFormProps {
    currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
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
        signIn("credentials", {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                router.push("/cart");
                router.refresh();
                toast.success("Logged In");
            }
            if (callback?.error) {
                toast.error(callback.error);
            }
        });

    };

    if (currentUser) {
        return <p className="text-center">Đã đăng nhập. Đang chuyển hướng ...</p>;
    }

    return (
        <>
            <Heading title="Trang Đăng Nhập Form MayAnhGT With Love " />
            <FaKissWinkHeart />
            <Button
                outline
                label="Đăng Nhập bằng Google"
                icon={AiOutlineGoogle}
                onClick={() => { signIn("google") }}
            />
            <hr className="bg-slate-300 w-full h-px" />

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
                label={isLoading ? "Đang tải ..." : "Đăng Nhập"}
                onClick={handleSubmit(onSubmit)}
            />

            <p className="text-sm">
                Bạn đã có tài khoản chưa? {""}<Link className="underline" href="/register">
                    Đăng Ký
                </Link>
            </p>
        </>

    );
};

export default LoginForm;