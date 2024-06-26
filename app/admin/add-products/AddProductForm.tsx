"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckbox from "@/app/components/inputs/CustomCheckbox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import firebaseApp from "@/libs/firebase";
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
    image: string
}

const AddProductForm = () => {

    const [isLoading, setisLoading] = useState(false)

    const [images, setimages] = useState<ImageType[] | null>()
    const [isProductCreated, setisProductCreated] = useState(false)

    const router = useRouter();

    // console.log("Images -----",images) 


    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            description: "",
            brand: "",
            category: "",
            inStock: false,
            images: [],
            price: 0
        }
    });


    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        // console.log("product data - - ",data);

        // upload images firebase
        setisLoading(true);
        let uploadedImages: UploadedImageType[] = [];

        if (!data.category) {
            setisLoading(false);
            return toast.error("Category is not selected");
        }

        if (!data.images || data.images.length === 0) {
            setisLoading(false);
            return toast.error("No selected image");
        }

        const handleImageUploads = async() => {
            toast("Creating Product... Please wait.");
            try {
                for (const item of data.images) {
                    if (item.image) {
                        const fileName = new Date().getTime() + " - " + item.image.name;
                        const storage = getStorage(firebaseApp);
                        const storageRef = ref(storage, `products/${fileName}`)
                        const uploadTask = uploadBytesResumable(storageRef, item.image);

                        await new Promise<void>((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log('Upload is ' + progress + '% done');
                                    switch (snapshot.state) {
                                        case "paused":
                                            console.log("Upload is paused");
                                            break;

                                        case "running":
                                            console.log("Upload is running");
                                            break;
                                    }
                                },
                                (error) => {
                                    //handle error
                                    console.log("Error uploading image : ", error)
                                    reject(error);
                                },
                                async() => {
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                        uploadedImages.push({
                                            ...item,
                                            image: downloadURL
                                        })
                                        console.log("File available at : ", downloadURL)
                                        resolve();
                                    }).catch((error) => {
                                        console.log("Error getting download URL : ", error)
                                        reject(error);
                                    })

                                }
                            )
                        })
                    }
                }
            }catch(error){
                setisLoading(false);
                console.log("Error uploading images : ", error)
                return toast.error("Error handling image uploads")
            }
        }

        await handleImageUploads();
        const productData = {...data, images: uploadedImages}
        console.log("Product data - ", productData)
        // setisLoading(false);

        axios.post("/api/product",productData).then(()=>{
            toast.success("Product created successfully")
            setisProductCreated(true);
            router.refresh();
        }).catch((error)=>{
            toast.error("Something went wrong")
        }).finally(()=>setisLoading(false))
    }

        const category = watch("category");

            const setCustomValue = (id: string, value: any) => {
                setValue(id, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                })
            }

            useEffect(() => {
                setCustomValue("images", images)
            }, [images])

            useEffect(() => {
                if (isProductCreated) {
                    reset();
                    setimages(null);
                    setisProductCreated(false);
                }
            }, [isProductCreated])


            const addImageToState = useCallback((value: ImageType) => {
                setimages((prev) => {
                    if (!prev) {
                        return [value]
                    }
                    return [...prev, value]
                })
            }, [])

            const removeImageFromState = useCallback((value: ImageType) => {
                setimages((prev) => {
                    if (prev) {
                        const filteredImages = prev.filter((item) => item.color !== value.color)
                        return filteredImages
                    }
                    return prev
                })
            }, [])
            return (
                <>
                    <Heading title="Add a Product" center />
                    <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required />
                    <Input id="price" label="Price" disabled={isLoading} register={register} errors={errors} required type="number" />
                    <Input id="brand" label="Brand" disabled={isLoading} register={register} errors={errors} required />
                    <TextArea id="description" label="Description" disabled={isLoading} register={register} errors={errors} required />
                    <CustomCheckbox id="inStock" register={register} label="This product is in stock" />

                    {/* categories section */}
                    <div className="w-full font-medium">
                        <div className="mb-2 font-semibold">Select a category</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 max-h-[50vh] gap-3 overflow-y-auto">
                            {categories.map((item) => {
                                if (item.label === "All") {
                                    return null
                                }

                                return (
                                    <div key={item.label} className="col-span">
                                        <CategoryInput
                                            onClick={(category) => setCustomValue("category", category)}
                                            selected={category === item.label}
                                            label={item.label}
                                            icon={item.icon} />

                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* colors */}
                    <div className="w-full flex flex-col flex-wrap gap-4">
                        <div>
                            <div className="font-bold">Select the available product colors and upload their images.</div>
                            <div className="text-sm">You must upload an image for each of the colors selected otherwise your color selection will be ignored.</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {colors.map((item, index) => {
                                return <SelectColor key={index} item={item} addImageToState={addImageToState} removeImageFromState={removeImageFromState} isProductCreated={isProductCreated} />
                            })}
                        </div>
                    </div>
                    <Button label={isLoading ? "Loading" : "Add Product"} onClick={handleSubmit(onSubmit)} />
                </>
            );
        }

        export default AddProductForm;