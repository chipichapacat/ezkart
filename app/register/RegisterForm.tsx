"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps {
    currentUser: SafeUser | null | undefined
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
    const [isLoading, setisLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            router.push("/cart");
            router.refresh();
        }

    }, [])


    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setisLoading(true);
        console.log(data)
        axios.post("/api/register", data).then(() => {
            toast.success("Account created successfully");

            signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false
            }).then((callback) => {
                if (callback?.ok) {
                    // yahan pe change karna hai if required
                    router.push("/cart")
                    router.refresh();
                    toast.success("Logged In");
                }
                if (callback?.error) {
                    toast.error(callback.error)
                }
            })
        }).catch(() => toast.error("Something went wrong")).finally(() => setisLoading(false))
    }

    if(currentUser){
        return <p className="text-center">Logged in... Redirecting</p>
    }

    return (
        <>
            <Heading title="Sign up for EZKart" />
            <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() => {signIn("google",{callbackUrl:"/cart"})}} />
            <hr className="bg-slate-600 w-full h-px" />
            <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} />
            {/* <TextField
                required
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                autoComplete='given-name'
                color="success"
                className="border-slate-700"/> */}

            <Input id="email" label="E-Mail" disabled={isLoading} register={register} errors={errors} />
            <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} />
            <Button label={isLoading ? "Loading" : "Sign Up"} onClick={handleSubmit(onSubmit)} />
            <p className="text-sm">Already have an account? <Link className="underline" href="/login">Log In</Link></p>
        </>
    );
}

export default RegisterForm;