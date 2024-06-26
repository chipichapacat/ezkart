"use client"

import { ImageType } from "@/app/admin/add-products/AddProductForm"
import { useCallback, useEffect, useState } from "react"
import SelectImage from "./SelectImage"
import Button from "../Button"

interface SelectColorProps {
    item: ImageType
    addImageToState: (value: ImageType) => void
    removeImageFromState: (value: ImageType) => void
    isProductCreated: boolean
}

const SelectColor: React.FC<SelectColorProps> = ({ item, addImageToState, removeImageFromState, isProductCreated }) => {
    const [isSelected, setisSelected] = useState(false);
    const [file, setfile] = useState<File | null>(null)

    useEffect(() => {
        if (isProductCreated) {
            setisSelected(false);
            setfile(null);
        }

    }, [isProductCreated])

    const handleFileChange = useCallback((value: File) => {
        setfile(value)
        addImageToState({ ...item, image: value })
    }, [])

    const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setisSelected(e.target.checked)
        if (!e.target.checked) {
            setfile(null);
            removeImageFromState(item)
        }
    }, [])

    return (
        <div className="grid grid-cols-1 overflow-y-auto border-b-[2px] border-slate-200 items-center p-2">
            <div className="flex flex-row gap-2 items-center h-[60px]">
                <input id={item.color} type="checkbox" checked={isSelected} onChange={handleCheck} className="cursor-pointer"/>
                <label htmlFor={item.color} className="font-medium cursor-pointer">{item.color}</label>
            </div>
            <>
                {isSelected && !file &&(
                    <div className="col-span-2 text-center">
                        <SelectImage item={item} handleFileChange={handleFileChange}/>
                    </div>
                )}
                {file && (
                    <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
                        <p>{file?.name}</p>
                        <div className="w-[70px]">
                            <Button small outline label="Cancel" onClick={()=>{
                                setfile(null)
                                removeImageFromState(item)
                            }}/>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
}

export default SelectColor;