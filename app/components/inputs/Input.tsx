"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps{
    id:string,
    label:string,
    type?:string,
    disabled?:boolean,
    required?: boolean,
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors
}


const Input : React.FC<InputProps> = ({id,label,type,disabled,required,register,errors})=>{
    return (
        <div className="w-full relative">
            <input autoComplete="off" id={id} disabled={disabled}
            {...register(id,{required})}
            placeholder=""
            type={type}
            className={`
                peer 
                w-full 
                p-4 pt-6 
                outline-none 
                bg-white 
                font-light 
                border-2 
                h-[60px]
                rounded-md 
                transition 
                disabled:opacity-70 disabled:cursor-not-allowed 
                ${errors[id]?"border-rose-600" : "border-slate-400"}
                ${errors[id]?"focus:border-rose-600" : "focus:border-slate-400"}
            `}/>
            <label className={`${errors[id]?"text-rose-600":"text-slate-500"} absolute cursor-text text-sm duration-150 transform  -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:tranlate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4`} htmlFor={id}>{label}</label>
        </div>
    )
}

export default Input;