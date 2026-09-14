
import React, { useEffect, useState } from "react";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import iziToast from "izitoast";
import { useNavigate, useParams } from "react-router-dom";

export default function AddTestimonial() {
    const navigate = useNavigate();
    const params = useParams();

    const [testimonialId, setTestimonialId] = useState("");
    const [errors, setErrors] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [details, setDetails] = useState({
        name: "",
        designation: "",
        message: "",
        rating: "",
        order: "",
        image: "",
    });

    const isUpdate = params.id ? true : false;

    useEffect(() => {
        setTestimonialId(params.id || "");

        if (params.id) {
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/testimonial/details/${params.id}`)
                .then((result) => {
                    if (result.data._status) {
                        setDetails(result.data._data);

                        if (result.data._data.image) {
                            setSelectedImage(
                                `http://localhost:5000/uploads/testimonial/${result.data._data.image}`
                            );
                        }
                    } else {
                        iziToast.error({
                            title: "Error",
                            message: result.data._message,
                            position: "topRight",
                        });
                    }
                })
                .catch(() => {
                    iziToast.error({
                        title: "Error",
                        message: "Something went wrong",
                        position: "topRight",
                    });
                });
        }
    }, [params.id]);

    const handleimagechange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImageFile(file);

            const reader = new FileReader();

            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };

            reader.readAsDataURL(file);

            setErrors(errors.filter((v) => v !== "image"));
        }
    };

    const ErrorHandler = (event) => {
        let fieldName = event.target.name;

        if (event.target.value.trim() === "") {
            if (!errors.includes(fieldName)) {
                setErrors([...errors, fieldName]);
            }
        } else {
            setErrors(errors.filter((v) => v !== fieldName));
        }
    };

    const inputHandler = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value,
        });
    };

    const formhandler = (event) => {
        event.preventDefault();

        let form = event.target;
        let fields = form.querySelectorAll("input, textarea");

        let newErrors = [];

        fields.forEach((field) => {
            if (
                field.type !== "file" &&
                field.value.trim() === ""
            ) {
                newErrors.push(field.name);
            }
        });

        // Image validation (sirf create me)
        if (!testimonialId && !imageFile) {
            newErrors.push("image");
        }

        newErrors = [...new Set(newErrors)];
        setErrors(newErrors);

        if (newErrors.length > 0) return;

        const formData = new FormData();

        formData.append("name", details.name);
        formData.append("designation", details.designation);
        formData.append("message", details.message);
        formData.append("rating", details.rating);
        formData.append("order", details.order);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        // UPDATE
        if (testimonialId) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/testimonial/update/${testimonialId}`,
                    formData
                )
                .then((result) => {
                    if (result.data._status) {
                        iziToast.success({
                            title: "Success",
                            message: result.data._message,
                            position: "topRight",
                        });

                        navigate("/Testimonial/View-Testimonial");
                    } else {
                        iziToast.error({
                            title: "Error",
                            message: result.data._message,
                            position: "topRight",
                        });
                    }
                })
                .catch(() => {
                    iziToast.error({
                        title: "Error",
                        message: "Something went wrong",
                        position: "topRight",
                    });
                });
        }

        // CREATE
        else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/testimonial/create`,
                    formData
                )
                .then((result) => {
                    if (result.data._status) {
                        iziToast.success({
                            title: "Success",
                            message: result.data._message,
                            position: "topRight",
                        });

                        form.reset();

                        setDetails({
                            name: "",
                            designation: "",
                            message: "",
                            rating: "",
                            order: "",
                            image: "",
                        });

                        setSelectedImage("");
                        setImageFile(null);

                        navigate("/Testimonial/View-Testimonial");
                    } else {
                        iziToast.error({
                            title: "Error",
                            message: result.data._message,
                            position: "topRight",
                        });
                    }
                })
                .catch(() => {
                    iziToast.error({
                        title: "Error",
                        message: "Something went wrong",
                        position: "topRight",
                    });
                });
        }
    };
    return (
        <>
            <div>
                <div className="min-h-screen bg-gray-100  p-6 rounded-lg">

                    {/* Breadcrumb */}
                    <p className="text-2xl font-semibold text-white p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                    Home | Testimonial |
                    <span className="">
                        {isUpdate ? "Update Testimonial" : "Add Testimonial"}
                    </span>
                </p>

                {/* Header */}
                <h2 className="text-2xl font-bold text-white">
                    {isUpdate ? "Update Testimonial" : "Add Testimonial"}
                </h2>
                <section className="grid grid-cols-1 gap-8 rounded-b-lg px-4 py-6 sm:px-6 sm:py-8 md:grid-cols-3">
                    <div className="md:col-span-1">

                        <label className="block text-xl font-semibold mb-3 pl-4">
                            Testimonial Image
                        </label>

                        <input
                            type="file"
                            id="testimonialImage"
                            accept="image/*"
                            onChange={handleimagechange}
                            className="hidden"
                        />

                        <label
                            htmlFor="testimonialImage"
                            className="h-52 w-60 max-w-full border bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer sm:ml-4"
                        >
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="testimonial"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <MdOutlineDriveFolderUpload size={50} />
                                    <p className="mt-2">Upload Image</p>
                                </div>
                            )}
                        </label>

                        {errors.includes("image") && (
                            <p className="text-red-600 mt-2 ml-4">
                                Image is required
                            </p>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <form
                            onSubmit={formhandler}
                            className="space-y-8"
                        >
                            <div className="mb-6">
                                <label className="block text-xl font-semibold mb-2">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={details.name}
                                    onChange={inputHandler}
                                    onKeyUp={ErrorHandler}
                                    autoComplete="off"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                    placeholder="Name"
                                />

                                {errors.includes("name") && (
                                    <p className="text-red-600 text-sm mt-1">
                                        Name is required
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="designation"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Designation
                                </label>

                                <input
                                    type="text"
                                    id="designation"
                                    name="designation"
                                    value={details.designation}
                                    onChange={inputHandler}
                                    onKeyUp={ErrorHandler}
                                    autoComplete="off"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="Designation"
                                />

                                {errors.includes("designation") && (
                                    <p className="text-red-600 text-sm mt-1">
                                        Designation is required
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="rating"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Rating
                                </label>

                                <input
                                    type="number"
                                    id="rating"
                                    name="rating"
                                    min="1"
                                    max="5"
                                    value={details.rating}
                                    onChange={inputHandler}
                                    onKeyUp={ErrorHandler}
                                    autoComplete="off"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="Rating"
                                />

                                {errors.includes("rating") && (
                                    <p className="text-red-600 text-sm mt-1">
                                        Rating is required
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="order"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Order
                                </label>

                                <input
                                    type="number"
                                    id="order"
                                    name="order"
                                    value={details.order}
                                    onChange={inputHandler}
                                    onKeyUp={ErrorHandler}
                                    autoComplete="off"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="Order"
                                />

                                {errors.includes("order") && (
                                    <p className="text-red-600 text-sm mt-1">
                                        Order is required
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="message"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={details.message}
                                    onChange={inputHandler}
                                    onKeyUp={ErrorHandler}
                                    autoComplete="off"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="Message"
                                />

                                {errors.includes("message") && (
                                    <p className="text-red-600 text-sm mt-1">
                                        Message is required
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="mt-6 bg-gray-700 hover:bg-gray-900 text-white px-5 py-3 rounded-xl transition-all"                            >
                                <button>
                                    {isUpdate ? "Update Testimonial" : "Add Testimonial"}
                                </button>
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div >
        </>
    )
}
