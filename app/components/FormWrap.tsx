"use client";


const FormWrap = ({children} : {children: React.ReactNode}) => {
    return ( 
        <div className="min-h-fit h-full flex items-center justify-center pb-12 pt-24">
            <div className="xl:max-w-[40%] max-w-[500px] w-full flex flex-col gap-6 items-center shadow-xl shadow-slate-300 rounded-md p-4 md:p-8">
                {children}
            </div>
        </div>
     );
}
 
export default FormWrap;