import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineDriveFolderUpload } from "react-icons/md";

export default function AddCategory() {

    let [SelectImage, setSelectImage] = useState("")
    let [errors, setErrors] = useState([]);

    var [CategoryId, setCategoryId] = useState('');
    var [Categoryedetails, setCategorydetails] = useState({});

    var navigate = useNavigate()

    const params = useParams();

    // IMAGE CHANGE
    let handleimagechange = (event) => {

        const file = event.target.files[0];

        if (file) {

            const reader = new FileReader();

            reader.onloadend = () => {

                setSelectImage(reader.result);

                let updated = errors.filter((v) => v !== 'image');
                setErrors(updated);

            };

            reader.readAsDataURL(file);
        }
    };

    // DETAILS API
    useEffect(() => {

        setCategoryId(params.id)

        if (params.id) {

            axios.post(`${import.meta.env.VITE_API_BASE_URL}/Category/details/${params.id}`)

                .then((result) => {

                    if (result.data._status == true) {

                        setCategorydetails(result.data._data)

                        if (result.data._data.image) {

                            console.log("image path ", result.data._image_path + "/" + result.data._data.image)

                            setSelectImage(
                                result.data._image_path + '/' + result.data._data.image
                            )

                        }

                    } else {

                        iziToast.error({
                            title: 'error',
                            message: 'something went wrong',
                            position: 'topRight',
                        })
                    }

                })

                .catch(() => {

                    iziToast.error({
                        title: 'error',
                        message: 'something went wrong',
                        position: 'topRight',
                    })

                })
        }

    }, [params.id])


    // VALIDATION
    let ErrorHandler = (event) => {

        let fieldName = event.target.name;

        if (event.target.value === "") {

            if (!errors.includes(fieldName)) {
                setErrors([...errors, fieldName]);
            }

        } else {

            let updated = errors.filter((v) => v !== fieldName);
            setErrors(updated);

        }
    };


    // FORM SUBMIT
    let formhandler = (event) => {

        event.preventDefault();

        const form = event.currentTarget;
        const fields = form.querySelectorAll('input');

        let newErrors = [];

        fields.forEach((field) => {
            if (field.name !== 'image' && !field.value.trim()) {
                newErrors.push(field.name);
            }
        });

        if (!SelectImage) {
            newErrors.push("image");
        }

        newErrors = [...new Set(newErrors)];
        setErrors(newErrors);

        if (newErrors.length > 0) {
            return;
        }

        const formData = new FormData(form);
        const isUpdateMode = Boolean(CategoryId);
        const requestUrl = isUpdateMode
            ? `${import.meta.env.VITE_API_BASE_URL}/category/update/${CategoryId}`
            : `${import.meta.env.VITE_API_BASE_URL}/Category/create`;

        const request = isUpdateMode
            ? axios.put(requestUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            : axios.post(requestUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

        request
            .then((result) => {
                const response = result.data;

                if (response._status === true) {
                    form.reset();
                    navigate('/Category/View-Category');

                    iziToast.success({
                        title: isUpdateMode ? "Success" : "success",
                        message: response._message || "Operation completed successfully",
                        position: "topRight"
                    });
                } else {
                    iziToast.error({
                        title: "error",
                        message: response._message || "Something went wrong",
                        position: "topRight"
                    });
                }
            })
            .catch((error) => {
                console.log(error);

                iziToast.error({
                    title: "error",
                    message: error.response?.data?._message || "Something went wrong",
                    position: "topRight"
                });
            });
    };



    return (
        <>
            <section className="w-full">

                {/* Breadcrumb */}
                <nav className="flex overflow-x-auto border-b bg-white px-4 py-3 shadow-sm sm:px-6">
                    <ol className="inline-flex items-center space-x-2 text-gray-600">

                        <li>
                            <a className="text-md font-medium hover:text-indigo-600">
                                Home
                            </a>
                        </li>

                        <li>/</li>

                        <li>
                            <a className="text-md font-medium hover:text-indigo-600">
                                Category
                            </a>
                        </li>

                        <li>/</li>

                        <li className="font-semibold text-gray-900">
                            {CategoryId ? 'update Category' : 'Add Category'}
                        </li>

                    </ol>
                </nav>


                {/* Body */}
                <div className="min-h-[680px] w-full bg-slate-50 px-4 py-6 sm:px-5 sm:py-10">

                    <div className="mx-auto">

                        <h3 className="text-[24px] font-semibold 
                        bg-gradient-to-r from-indigo-600 to-yellow-500
                        py-3 px-5 rounded-t-lg text-white border border-indigo-500">

                            {CategoryId ? 'update Category' : 'Add Category'}

                        </h3>


                        <form
                            onSubmit={formhandler}
                            encType="multipart/form-data"
                            className="flex flex-col gap-6 rounded-b-lg border border-slate-200 border-t-0 bg-white p-4 shadow-sm sm:p-6 md:flex-row"
                        >

                            {/* IMAGE AREA */}
                            <div className='flex flex-col'>

                                <label className="block mb-2 text-md font-medium text-gray-700">
                                    Image
                                </label>

                                <div className="relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100">

                                    {!SelectImage && (

                                        <div className="relative w-full z-0 h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4">

                                            <div className="absolute inset-0 bg-slate-300 animate-pulse"></div>

                                            <div className="absolute inset-0 bg-gradient-to-r 
                                            from-transparent via-white/40 to-transparent
                                            animate-[shimmer_1.8s_linear_infinite]">
                                            </div>

                                            <div className="relative z-10 flex flex-col items-center gap-3">

                                                <MdOutlineDriveFolderUpload
                                                    className="text-slate-600"
                                                    size={55}
                                                />

                                                <div className="w-28 h-3 bg-slate-400 rounded-full"></div>

                                                <div className="w-20 h-3 bg-slate-400 rounded-full"></div>

                                            </div>

                                        </div>
                                    )}

                                    {SelectImage && (

                                        <img
                                            src={SelectImage}
                                            alt="Select"
                                            className="w-full h-full object-cover"
                                        />

                                    )}

                                    <input
                                        type="file"
                                        name='image'
                                        accept="image/*"
                                        onChange={handleimagechange}
                                        className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                                    />

                                </div>

                                {errors.includes("image") && (

                                    <p className="text-red-600 text-sm mt-1">
                                        image is required
                                    </p>

                                )}

                            </div>


                            {/* FORM FIELDS */}
                            <div className='w-full md:basis-[100%]'>

                                {/* CATEGORY NAME */}
                                <div className="mb-6">

                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Category Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={Categoryedetails.name}
                                        autoComplete="off"
                                        onKeyUp={ErrorHandler}
                                        className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                                        block w-full py-2.5 px-3"
                                        placeholder="Enter category name"
                                    />

                                    {errors.includes("name") && (

                                        <p className="text-red-600 text-sm mt-1">
                                            Name is required
                                        </p>

                                    )}

                                </div>


                                {/* ORDER */}
                                <div className="mb-6">

                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Order
                                    </label>

                                    <input
                                        type="number"
                                        name="order"
                                        defaultValue={Categoryedetails.order}
                                        min={1}
                                        autoComplete="off"
                                        onKeyUp={ErrorHandler}
                                        className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                                        block w-full py-2.5 px-3"
                                        placeholder="Enter order number"
                                    />

                                    {errors.includes("order") && (

                                        <p className="text-red-600 text-sm mt-1">
                                            Order is required
                                        </p>

                                    )}

                                </div>


                                <div className='flex justify-end'>

                                    <button
                                        type="submit"
                                        className="mt-3 cursor-pointer text-white 
                                        bg-indigo-600 hover:bg-indigo-700
                                        focus:ring-4 focus:ring-indigo-300
                                        font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all"
                                    >
                                        {CategoryId ? 'update' : 'Submit'}
                                    </button>

                                </div>

                            </div>

                        </form>

                    </div>

                </div>

            </section>
        </>
    )
}
