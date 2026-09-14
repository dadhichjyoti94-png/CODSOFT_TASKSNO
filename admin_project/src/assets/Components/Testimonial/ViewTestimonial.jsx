


import React, { useEffect, useState } from "react";
import { FaFilter, FaPen } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import iziToast from "izitoast";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";

export default function ViewTestimonial() {

    const [testimonial, setTestimonial] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);

    const [filterData, setFilterData] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [apiStatus, setApiStatus] = useState(false);

    const [selectedRecord, setSelectedRecord] = useState([]);

    useEffect(() => {

        axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/testimonial/view`,
            {
                name: filterData.name,
                page: currentPage,
                limit: 5,
            }
        )
            .then((result) => {

                if (result.data._status) {

                    setTestimonial(result.data._data);
                    setTotalPages(result.data._paginate.total_pages);

                } else {

                    setTestimonial([]);

                }

            })
            .catch(() => {

                iziToast.error({
                    title: "Error",
                    message: "Something went wrong",
                    position: "topRight",
                });

            });

    }, [filterData, currentPage, apiStatus]);

    // Filter

    const applyFilter = (e) => {

        e.preventDefault();

        setCurrentPage(1);

        setFilterData({
            name: e.target.name.value,
        });

    };

    // Checkbox

    const SingleCheckSelect = (id) => {

        if (selectedRecord.includes(id)) {

            setSelectedRecord(
                selectedRecord.filter((v) => v !== id)
            );

        } else {

            setSelectedRecord([...selectedRecord, id]);

        }

    };

    // Select All

    const selectAllCheckBox = () => {

        if (testimonial.length === selectedRecord.length) {

            setSelectedRecord([]);

        } else {

            let ids = [];

            testimonial.forEach((item) => {

                ids.push(item._id);

            });

            setSelectedRecord(ids);

        }

    };

    // Change Status

    const changeStatus = () => {

        if (selectedRecord.length === 0) {

            iziToast.error({
                title: "Error",
                message: "Please select record",
                position: "topRight",
            });

            return;
        }

        axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/testimonial/change-status`,
            {
                ids: selectedRecord,
            }
        )
            .then((result) => {

                if (result.data._status) {

                    iziToast.success({
                        title: "Success",
                        message: result.data._message,
                        position: "topRight",
                    });

                    setSelectedRecord([]);
                    setApiStatus(!apiStatus);

                }

            });

    };


    // Delete

const deleteRecords = () => {

    if (selectedRecord.length === 0) {

        iziToast.error({
            title: "Error",
            message: "Please select record",
            position: "topRight",
        });

        return; // ✅ Important
    }

    iziToast.question({

        timeout: 20000,
        overlay: true,
        close: true,
        displayMode: "once",

        title: "Delete",

        message: "Are you sure?",

        position: "center",

        buttons: [

            [

                "<button>Yes</button>",

                function (instance, toast) {

                    axios.delete(
                        `${import.meta.env.VITE_API_BASE_URL}/testimonial/delete`,
                        {
                            data: {
                                id: selectedRecord,
                            },
                        }
                    )
                    .then((result) => {

                        if (result.data._status) {

                            const remainingTestimonials = testimonial.filter((item) => !selectedRecord.includes(item._id));
                            setTestimonial(remainingTestimonials);

                            iziToast.success({

                                title: "Deleted",

                                message: result.data._message,

                                position: "topRight",

                            });

                            setSelectedRecord([]);
                            setApiStatus(!apiStatus);

                        }

                        instance.hide({}, toast);

                    })
                    .catch(() => {
                        iziToast.error({
                            title: "Error",
                            message: "Something went wrong",
                            position: "topRight",
                        });

                        instance.hide({}, toast);
                    });

                },

                true,

            ],

            [

                "<button>Cancel</button>",

                function (instance, toast) {

                    instance.hide({}, toast);

                },

            ],

        ],

    });

};
        return (
            
                <>
                    <div className="min-h-screen bg-gray-100">

                        {/* Breadcrumb */}
                        <div className="bg-white border-b px-6 py-4">
                            <p className="text-2xl font-semibold text-gray-800">
                                Home | Testimonial |{" "}
                                <span className="text-violet-500">
                                    View Testimonial
                                </span>
                            </p>
                        </div>

                        {/* Filter */}
                        {openFilter && (
                            <div className="p-4">

                                <form
                                    onSubmit={applyFilter}
                                    className="bg-white p-5 rounded shadow relative"
                                >

                                    <button
                                        type="button"
                                        onClick={() => setOpenFilter(false)}
                                        className="absolute right-4 top-4 text-xl"
                                    >
                                        <MdOutlineClose />
                                    </button>

                                    <h2 className="text-xl font-semibold mb-4">
                                        Filter
                                    </h2>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter Name"
                                        className="border p-2 rounded w-full mb-4"
                                    />

                                    <button
                                        className="bg-blue-500 text-white px-5 py-2 rounded"
                                    >
                                        Apply
                                    </button>

                                </form>

                            </div>
                        )}

                        <section className="p-3 sm:p-5">

                            <div className="mx-auto max-w-screen-xl">

                                <div className="bg-white shadow rounded">

                                    <div className="flex justify-between items-center p-4">

                                        <h2 className="font-bold text-xl">
                                            View Testimonial
                                        </h2>

                                        <div className="flex gap-3">

                                            <button
                                                onClick={() => setOpenFilter(!openFilter)}
                                                className="bg-blue-500 text-white p-3 rounded-full"
                                            >
                                                <FaFilter />
                                            </button>

                                            <button
                                                onClick={changeStatus}
                                                className="bg-red-500 text-white px-4 rounded"
                                            >
                                                Change Status
                                            </button>

                                            <button
                                                onClick={deleteRecords}
                                                className="bg-green-600 text-white px-4 rounded"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                    <div className="overflow-x-auto">

                                        <table className="w-full text-left">

                                            <thead className="bg-gray-100">

                                                <tr>

                                                    <th className="p-3">

                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                testimonial.length > 0 &&
                                                                testimonial.length ===
                                                                selectedRecord.length
                                                            }
                                                            onChange={selectAllCheckBox}
                                                        />

                                                    </th>

                                                    <th>Name</th>

                                                    <th>Image</th>

                                                    <th>Designation</th>

                                                    <th>Rating</th>

                                                    <th>Order</th>

                                                    <th>Status</th>

                                                    <th>Action</th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {testimonial.length > 0 ? (

                                                    testimonial.map((item) => (

                                                        <tr
                                                            key={item._id}
                                                            className="border-b"
                                                        >

                                                            <td className="p-3">

                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRecord.includes(item._id)}
                                                                    onChange={() =>
                                                                        SingleCheckSelect(item._id)
                                                                    }
                                                                />

                                                            </td>

                                                            <td>{item.name}</td>

                                                            <td>

                                                                <img
                                                                    src={`http://localhost:5000/uploads/testimonial/${item.image}`}
                                                                    className="w-16 h-16 rounded object-cover"
                                                                    alt=""
                                                                />

                                                            </td>

                                                            <td>{item.designation}</td>

                                                            <td>{item.rating}</td>

                                                            <td>{item.order}</td>

                                                            <td>

                                                                {item.status == 1 ? (

                                                                    <span className="bg-green-500 text-white px-3 py-1 rounded">
                                                                        Active
                                                                    </span>

                                                                ) : (

                                                                    <span className="bg-red-500 text-white px-3 py-1 rounded">
                                                                        Inactive
                                                                    </span>

                                                                )}

                                                            </td>

                                                            <td>

                                                                <Link
                                                                    to={`/Testimonial/update/${item._id}`}
                                                                >
                                                                    <FaPen />
                                                                </Link>

                                                            </td>

                                                        </tr>

                                                    ))

                                                ) : (

                                                    <tr>

                                                        <td
                                                            colSpan={8}
                                                            className="text-center py-5"
                                                        >
                                                            No Record Found
                                                        </td>

                                                    </tr>

                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                    <div className="p-5">

                                        <ResponsivePagination
                                            current={currentPage}
                                            total={totalPages}
                                            onPageChange={setCurrentPage}
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>
                </>        
        )
    }
