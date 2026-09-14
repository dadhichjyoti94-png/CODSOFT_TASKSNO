
import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineDriveFolderUpload } from "react-icons/md";


export default function AddSubSubCategory() {
    let [categories, setCategories] = useState([]);

    let [parentCategoryid, setParentCategoryid] = useState('');
    let [subCategory, SetSubCategory] = useState([]);
    let [subCategoryDetailes, SetSubCategoryDetailes] = useState({});
    let [subCategoryId, setSubCategoryId] = useState()
    let [SubSubCategoryId, setSubSubCategoryId] = useState('')
    let [SubSubCategory, setSubSubCategory] = useState([])
    let [SelectedImage, setSelectedImage] = useState('');
    let [errors, setErrors] = useState([]);
    let [parentCategory, setParentCategory] = useState([])

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        setSubSubCategoryId(params.id)
    }, [])

    const [formData, setFormData] = useState({
        parent_category_id: "",
        sub_category_id: "",
        name: "",
        order: ""
    });


    //parent category

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/parent-category`, {
            status: true,
            id: parentCategoryid
        })
            .then((result) => {
                if (result.data._status) {
                    setParentCategory(result.data._data);
                } else {
                    setParentCategory([])
                }
            })
            .catch(() => {
                iziToast.error({
                    title: "error",
                    message: "something went wrong",
                    position: "topRight",
                })
            })

    }, [])



    //sub category

    useEffect(() => {
        if (parentCategoryid) {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/sub-category`, {
                status: true,
                id: subCategoryId,
                parent_category_id: parentCategoryid
            })
                .then((result) => {
                    if (result.data._status) {
                        SetSubCategory(result.data._data);
                    } else {
                        SetSubCategory([]);
                    }
                })


                .catch((error) => {

                    console.log(                    //error ko console m chek karne k liye
                        "SUB CATEGORY ERROR =",
                        error.response?.data || error.message
                    );

                    iziToast.error({
                        title: "error",
                        message: "something went wrong",
                        position: "topRight",
                    });

                })
        }



    }, [parentCategoryid])


    //drop dowen s value select karne k liye

    const handleParentCategory = ((e) => {
        ErrorHandler(e)
        if (e.target.value != '') {
            setParentCategoryid(e.target.value)
        } else {
            setParentCategoryid('')
            SetSubCategory([])
        }

    })




    let handleimagechange = (event) => {

        const file = event.target.files[0];

        if (file) {

            const reader = new FileReader();

            reader.onloadend = () => {

                setSelectedImage(reader.result);

                let updated = errors.filter((v) => v !== 'image');
                setErrors(updated);

            };

            reader.readAsDataURL(file);
        }

    };
    let ErrorHandler = (event) => {

        let fieldName = event.target.name;
        let value = event.target.value;

        if (!value || value.trim() === "") {

            if (!errors.includes(fieldName)) {
                setErrors([...errors, fieldName]);
            }

        } else {

            let updated = errors.filter((v) => v !== fieldName);
            setErrors(updated);

        }
    };

    let formhandler = (event) => {
        event.preventDefault();

        let form = event.target;
        // Existing image is already stored during an update. The file input is
        // intentionally empty unless the user chooses a replacement image, so
        // validate it separately below.
        let fields = form.querySelectorAll('input:not([type="file"]), textarea, select')

        let newErrors = [];

        fields.forEach((field) => {
            if (!field.value.trim()) {
                newErrors.push(field.name);
            }
        });

        if (!SelectedImage && !SubSubCategoryId) {
            newErrors.push("image");
        }
        newErrors = [...new Set(newErrors)];
        setErrors(newErrors);

        if (newErrors.length === 0) {

            if (SubSubCategoryId) {

                // UPDATE API
                axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/update/${SubSubCategoryId}`,
                    event.target
                )
                    .then((result) => {

                        if (result.data._status === true) {

                            event.target.reset();

                            navigate('/SubSubCategory/View-Sub-Sub-Category');

                            iziToast.success({
                                title: "success",
                                message: result.data._message,
                                position: "topRight"
                            });

                        } else {

                            iziToast.error({
                                title: "error",
                                message: "something went wrong",
                                position: "topRight"
                            });

                        }

                    });

            } else {

                // CREATE API
                axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/create`,
                    event.target
                )
                    .then((result) => {

                        if (result.data._status === true) {

                            event.target.reset();

                            // navigate('/sub-sub-category/view');
                            navigate('/SubSubCategory/View-Sub-Sub-Category')

                            iziToast.success({
                                title: "success",
                                message: result.data._message,
                                position: "topRight"
                            });

                        } else {

                            iziToast.error({
                                title: "error",
                                message: "something went wrong",
                                position: "topRight"
                            });

                        }

                    });

            }

        }
    };

    useEffect(() => {

        if (!params.id) return;

        axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/details/${params.id}`
        )
            .then((res) => {

                if (res.data._status) {

                    let data = res.data._data;

                    setFormData({
                        parent_category_id: data.parent_category_id,
                        sub_category_id: data.sub_category_id,
                        name: data.name,
                        order: data.order
                    });

                    setParentCategoryid(data.parent_category_id);
                    setSubCategoryId(data.sub_category_id);

                    if (data.image) {
                        setSelectedImage(
                            res.data._image_path + "/" + data.image
                        );
                    }
                }

            });

    }, [params.id]);


    return (
        <>
            <section className="w-full">

                {/* Breadcrumb */}
                <nav className="flex overflow-x-auto border-b bg-white px-4 py-3 shadow-sm sm:px-6">
                    <ol className="inline-flex items-center space-x-2 text-gray-600">
                        <li><a className="text-md font-medium hover:text-indigo-600">Home</a></li>
                        <li>/</li>
                        <li><a className="text-md font-medium hover:text-indigo-600">Sub Sub Category</a></li>
                        <li>/</li>
                        <li className="font-semibold text-gray-900">Add Sub Sub Category</li>
                    </ol>
                </nav>

                {/* Body */}
                <div className="min-h-[680px] w-full bg-slate-50 px-4 py-6 sm:px-5 sm:py-10">
                    <div className="mx-auto">

                        <h3 className="text-[24px] font-semibold 
                        bg-gradient-to-r from-indigo-600 to-indigo-500
                        py-3 px-5 rounded-t-lg text-white border border-indigo-500">
                            {

                                SubSubCategoryId
                                    ?
                                    'update sub-sub-Category'
                                    :
                                    'Add-sub-sub Category'
                            }
                        </h3>

                        <form
                            onSubmit={formhandler}
                            className="flex flex-col gap-6 rounded-b-lg border border-slate-200 border-t-0 bg-white p-4 shadow-sm sm:p-6 md:flex-row"
                        >
                            {/* IMAGE AREA */}
                            <div className='flex flex-col'>
                                <label className="block mb-2 text-md font-medium text-gray-700">
                                    Image
                                </label>

                                <div className="relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100">

                                    {!SelectedImage && (
                                        <div className="relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4">

                                            <div className="absolute inset-0 bg-slate-300 animate-pulse"></div>

                                            <div className="absolute inset-0 bg-gradient-to-r 
                                                                                                            from-transparent via-white/40 to-transparent
                                                                                                            animate-[shimmer_1.8s_linear_infinite]">
                                            </div>

                                            <div className="relative z-10 flex flex-col items-center gap-3">
                                                <MdOutlineDriveFolderUpload className="text-slate-600" size={55} />
                                                <div className="w-28 h-3 bg-slate-400 rounded-full"></div>
                                                <div className="w-20 h-3 bg-slate-400 rounded-full"></div>
                                            </div>
                                        </div>
                                    )}

                                    {SelectedImage && (
                                        <img
                                            src={SelectedImage}
                                            alt="Selected"
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                    <input
                                        type="file"
                                        name='image'
                                        accept="image/*"
                                        onChange={handleimagechange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>

                                {errors.includes("image") && (
                                    <p className="text-red-600 text-sm mt-1">image is required</p>
                                )}
                            </div>

                            {/* FORM FIELDS */}
                            <div className='w-full'>

                                {/* Select Parent Category */}
                                <div className="mb-6">
                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Select Parent Category
                                    </label>

                                    <select
                                        name="parent_category_id"
                                        value={formData.parent_category_id}
                                        onChange={(e) => {
                                            handleParentCategory(e);

                                            setFormData({
                                                ...formData,
                                                parent_category_id: e.target.value,
                                                sub_category_id: ""
                                            });

                                            SetSubCategory([]);
                                        }} className="text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3"
                                    >
                                        <option value="">Select Parent Category</option>

                                        {
                                            parentCategory.map((v, i) => (
                                                <option value={v._id} key={i}>
                                                    {v.name}
                                                </option>
                                            ))
                                        }
                                    </select>

                                    {errors.includes("parent_category_id") && (
                                        <p className="text-red-600 text-sm mt-1">parent-category is required</p>
                                    )}
                                </div>


                                {/* Select Sub Category */}
                                <div className="mb-6">
                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Select Sub Category
                                    </label>

                                    <select
                                        name="sub_category_id"
                                        value={formData.sub_category_id}
                                        onChange={(e) => {
                                            ErrorHandler(e);

                                            setFormData({
                                                ...formData,
                                                sub_category_id: e.target.value
                                            });

                                            setSubCategoryId(e.target.value);
                                        }}
                                        className="text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg
    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
    block w-full py-2.5 px-3"
                                    >
                                        <option value="">Select Sub Category</option>
                                        {
                                            subCategory.map((v, i) => {
                                                return (
                                                    <option value={v._id} key={i}>{v.name}</option>
                                                )
                                            })
                                        }

                                    </select>

                                    {errors.includes("sub_category_id") && (
                                        <p className="text-red-600 text-sm mt-1">sub-category is required</p>
                                    )}
                                </div>


                                {/* Name */}
                                <div className="mb-6">
                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Sub Sub Category Name
                                    </label>


                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            ErrorHandler(e);

                                            setFormData({
                                                ...formData,
                                                name: e.target.value
                                            });
                                        }}
                                        className="text-[17px] border border-slate-300 text-gray-900 rounded-lg
    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
    block w-full py-2.5 px-3"
                                        placeholder="Enter category name"
                                    />
                                    {errors.includes("name") && (
                                        <p className="text-red-600 text-sm mt-1">sub-sub-category is required</p>
                                    )}
                                </div>


                                {/* Order */}
                                <div className="mb-6">
                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Order
                                    </label>

                                    <input
                                        type="number"
                                        name="order"
                                        min={1}
                                        value={formData.order}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            ErrorHandler(e);

                                            setFormData({
                                                ...formData,
                                                order: e.target.value
                                            });
                                        }}
                                        className="text-[17px] border border-slate-300 text-gray-900 rounded-lg
    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
    block w-full py-2.5 px-3"
                                        placeholder="Enter order number"
                                    />
                                    {errors.includes("order") && (
                                        <p className="text-red-600 text-sm mt-1">order is required</p>
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

                                        {

                                            SubSubCategoryId ?
                                                'update '
                                                :
                                                'Submit'
                                        }

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
