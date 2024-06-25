"use client";
import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn} from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface LoginFormProps{
    currentUser: SafeUser | null | undefined
}

const LoginForm: React.FC<LoginFormProps> = ({currentUser}) => {
    const [isLoading, setisLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const router = useRouter();
    // const {data:session}=useSession();

    useEffect(() => {
      if (currentUser) {
        router.push("/cart");
        router.refresh();
    }
    
    }, [])
  
    

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setisLoading(true);
        // console.log(data)
        signIn("credentials", {
            ...data,
            redirect: false
        }).then((callback) => {
            setisLoading(false);
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
    }

    if(currentUser){
        return <p className="text-center">Logged in... Redirecting</p>
    }

    return (
        <>
            <Heading title="Log in to EZKart" />
            <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() => {signIn("google",{callbackUrl:"/cart"})}} />
            <hr className="bg-slate-600 w-full h-px" />


            <Input id="email" label="E-Mail" disabled={isLoading} register={register} errors={errors} />
            <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} />
            <Button label={isLoading ? "Loading" : "Log In"} onClick={handleSubmit(onSubmit)} />
            <p className="text-sm">Do not have an account? <Link className="underline" href="/register">Sign Up</Link></p>
        </>
    );
}

export default LoginForm;