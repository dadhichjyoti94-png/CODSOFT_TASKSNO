import axios from "axios";
import iziToast from "izitoast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function AddFaq() {

    const [faqId, setFaqId] = useState('');
    const [faqDetails, setFaqDetails] = useState({});
    const [errors, setErrors] = useState([]);

    const pageNavigate = useNavigate();
    const params = useParams();

    useEffect(() => {

        setFaqId(params.id);

        if (params.id) {

            axios.get(`${import.meta.env.VITE_API_BASE_URL}/faq/details/${params.id}`)
                .then((result) => {

                    if (result.data._status) {
                        setFaqDetails(result.data._data);
                    }
                    else {
                        iziToast.error({
                            title: "Error",
                            message: result.data._message,
                            position: "topRight"
                        });
                    }

                })
                .catch(() => {

                    iziToast.error({
                        title: "Error",
                        message: "Something went wrong",
                        position: "topRight"
                    });

                });

        }

    }, [params]);


    const formhandler = (event) => {

        event.preventDefault();

        let form = event.target;

        let fields = form.querySelectorAll("input, textarea");

        let newErrors = [];

        fields.forEach((field) => {

            if (!field.value.trim()) {
                newErrors.push(field.name);
            }

        });


        setErrors([...new Set(newErrors)]);


        if (newErrors.length === 0) {


            let data = {

                question: form.question.value,
                answer: form.answer.value,
                order: form.order.value

            };


            if (faqId) {


                axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/faq/update/${faqId}`,
                    data
                )

                    .then((result) => {

                        if (result.data._status) {

                            iziToast.success({
                                title: "Success",
                                message: result.data._message,
                                position: "topRight"
                            });

                            pageNavigate("/faq/view-faq");

                        }
                        else {

                            iziToast.error({
                                title: "Error",
                                message: result.data._message,
                                position: "topRight"
                            });

                        }

                    })


            }
            else {


                axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/faq/create`,
                    data
                )

                    .then((result) => {


                        if (result.data._status) {

                            iziToast.success({
                                title: "Success",
                                message: result.data._message,
                                position: "topRight"
                            });

                            event.target.reset();

                            pageNavigate("/Faq/View-Faq");

                        }
                        else {

                            iziToast.error({
                                title: "Error",
                                message: result.data._message,
                                position: "topRight"
                            });

                        }


                    })

                    .catch(() => {

                        iziToast.error({
                            title: "Error",
                            message: "Something went wrong",
                            position: "topRight"
                        });

                    })


            }


        }

    };



    const ErrorHandler = (event) => {

        let fieldName = event.target.name;


        if (event.target.value.trim() === "") {

            if (!errors.includes(fieldName)) {

                setErrors([...errors, fieldName]);

            }

        }
        else {

            setErrors(
                errors.filter((v) => v !== fieldName)
            );

        }

    };



    return (

        <div className="min-h-screen bg-gray-100 p-6 rounded-lg">


            <div className="bg-white border-b px-6 py-4 mb-6">

                <p className="text-2xl font-semibold">

                    Home | FAQ |

                    <span className="text-purple-500">

                        {faqId ? " Update FAQ" : " Add FAQ"}

                    </span>

                </p>

            </div>



            <div className="bg-white p-6 rounded-lg shadow">


                <h3 className="text-xl bg-blue-500 text-white p-3 rounded">

                    {faqId ? "Update FAQ" : "Add FAQ"}

                </h3>



                <form onSubmit={formhandler} className="mt-5">


                    <label>Question</label>

                    <input

                        type="text"

                        name="question"

                        defaultValue={faqDetails.question || ""}

                        onKeyUp={ErrorHandler}

                        className="border w-full p-3 rounded mb-2"

                    />


                    {
                        errors.includes("question") &&

                        <p className="text-red-600">

                            Question is required

                        </p>

                    }



                    <label className="block mt-5">

                        Answer

                    </label>


                    <textarea

                        name="answer"

                        defaultValue={faqDetails.answer || ""}

                        onKeyUp={ErrorHandler}

                        className="border w-full p-3 rounded"

                    />



                    {
                        errors.includes("answer") &&

                        <p className="text-red-600">

                            Answer is required

                        </p>

                    }




                    <label className="block mt-5">

                        Order

                    </label>


                    <input

                        type="number"

                        name="order"

                        defaultValue={faqDetails.order || ""}

                        className="border w-full p-3 rounded"

                    />



                    <button

                        type="submit"

                        className="mt-5 bg-blue-500 text-white px-6 py-3 rounded"

                    >

                        {
                            faqId ? "Update" : "Submit"
                        }

                    </button>



                </form>


            </div>


        </div>

    )

}