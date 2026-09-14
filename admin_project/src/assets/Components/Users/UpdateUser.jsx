import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateUser() {
    const [userDetails, setUserDetails] = useState({});
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/user`;

    useEffect(() => {
        axios.post(`${apiUrl}/details/${params.id}`)
            .then(({ data }) => {
                if (data._status) {
                    setUserDetails(data._data);
                } else {
                    iziToast.error({ title: 'Error', message: data._message, position: 'topRight' });
                    navigate('/user/view');
                }
            })
            .catch(() => iziToast.error({ title: 'Error', message: 'User details load nahi ho payi.', position: 'topRight' }));
    }, [apiUrl, navigate, params.id]);

    const validate = (form) => {
        const requiredFields = ['name', 'email'];
        const nextErrors = requiredFields.filter((field) => !form[field].value.trim());
        setErrors(nextErrors);
        return nextErrors.length === 0;
    };

    const submitHandler = (event) => {
        event.preventDefault();

        if (!validate(event.target)) return;

        const formData = {
            name: event.target.name.value,
            email: event.target.email.value,
            mobile_number: event.target.mobile_number.value,
            Gender: event.target.Gender.value,
            Address: event.target.Address.value,
            status: event.target.status.value
        };

        axios.put(`${apiUrl}/update/${params.id}`, formData)
            .then(({ data }) => {
                if (data._status) {
                    iziToast.success({ title: 'Success', message: data._message, position: 'topRight' });
                    navigate('/user/view');
                } else {
                    iziToast.error({ title: 'Error', message: data._message, position: 'topRight' });
                }
            })
            .catch((error) => iziToast.error({
                title: 'Error',
                message: error.response?.data?._message || 'User update nahi ho paya.',
                position: 'topRight'
            }));
    };

    return (
        <section className="w-full">
            <nav className="flex border-b bg-white px-6 py-3 shadow-sm">
                <ol className="inline-flex items-center space-x-2 text-gray-600">
                    <li className="text-md font-medium">Home</li>
                    <li>/</li>
                    <li className="text-md font-medium">User</li>
                    <li>/</li>
                    <li className="font-semibold text-gray-900">Update User</li>
                </ol>
            </nav>

            <div className="w-full min-h-[680px] px-5 bg-slate-50 py-10">
                <div className="mx-auto">
                    <h3 className="text-[24px] font-semibold bg-indigo-600 py-3 px-5 rounded-t-lg text-white border border-indigo-500">
                        Update User
                    </h3>

                    <form key={userDetails._id || 'new'} onSubmit={submitHandler} className="border border-slate-200 border-t-0 bg-white p-6 rounded-b-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-md font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={userDetails.name || ''}
                                    className="text-[17px] border border-slate-300 rounded-lg block w-full py-2.5 px-3"
                                    placeholder="Enter name"
                                />
                                {errors.includes('name') && <p className="text-red-600 text-sm mt-1">Name is required</p>}
                            </div>

                            <div>
                                <label className="block mb-2 text-md font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={userDetails.email || ''}
                                    className="text-[17px] border border-slate-300 rounded-lg block w-full py-2.5 px-3"
                                    placeholder="Enter email"
                                />
                                {errors.includes('email') && <p className="text-red-600 text-sm mt-1">Email is required</p>}
                            </div>

                            <div>
                                <label className="block mb-2 text-md font-medium text-gray-700">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobile_number"
                                    defaultValue={userDetails.mobile_number || ''}
                                    className="text-[17px] border border-slate-300 rounded-lg block w-full py-2.5 px-3"
                                    placeholder="Enter mobile number"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-md font-medium text-gray-700">Gender</label>
                                <select
                                    name="Gender"
                                    defaultValue={userDetails.Gender || ''}
                                    className="text-[17px] border border-slate-300 rounded-lg block w-full py-2.5 px-3"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-md font-medium text-gray-700">Status</label>
                                <select
                                    name="status"
                                    defaultValue={String(Boolean(userDetails.status))}
                                    className="text-[17px] border border-slate-300 rounded-lg block w-full py-2.5 px-3"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-2 text-md font-medium text-gray-700">Address</label>
                                <textarea
                                    name="Address"
                                    defaultValue={userDetails.Address || ''}
                                    className="text-[17px] border border-slate-300 rounded-lg block w-full py-2.5 px-3 min-h-28"
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/user/view')}
                                className="text-white bg-slate-500 hover:bg-slate-600 font-medium rounded-lg text-md px-6 py-2.5"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-md px-6 py-2.5"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
