import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineDriveFolderUpload } from "react-icons/md";


export default function AddSubCategory() {

  let [categories, setCategories] = useState([]);

  let [parent_category_id, setParentCategoryid] = useState('');
  let [subCategory, SetSubCategory] = useState('');
  let [subCategoryDetailes, SetSubCategoryDetailes] = useState({});
  let [subCategoryId, setSubCategoryId] = useState()
  let [SelectedImage, setSelectedImage] = useState('');
  let [errors, setErrors] = useState([]);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-category/parent-category`, {
      status: true,
      id: parent_category_id
    })
      .then((result) => {
        if (result.data._status) {
          setCategories(result.data._data);
        } else {
          setCategories([])
        }
      })
      .catch(() => {
        iziToast.error({
          title: "error",
          message: "something went wrong",
          position: "topRight",
        })
      })
  }, [parent_category_id])

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

  // DETAILS API
  useEffect(() => {

    setSubCategoryId(params.id)

    if (params.id) {

      // axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-Category/details/${params.id}`)
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-category/details/${params.id}`)
        .then((result) => {

          if (result.data._status == true) {

            SetSubCategoryDetailes(result.data._data)

            setParentCategoryid(result.data._data.parent_category_id)
            if (result.data._data.image) {

              console.log("image path ", result.data._image_path + "/" + result.data._data.image)

              setSelectedImage(
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

    let form = event.target;

    let fields = form.querySelectorAll(["input, select"]);

    let newErrors = [];

    fields.forEach((field) => {
      if (field.name != 'image') {
        if (
          !field.value.trim()) {
          newErrors.push(field.name);
        }

      };

    })


    // FILE INPUT SKIP

    // IMAGE VALIDATION
    if (!SelectedImage) {
      newErrors.push("image");
    }

    newErrors = [...new Set(newErrors)];

    setErrors(newErrors);
    // IF NO ERROR
    if (newErrors.length === 0) {

      // UPDATE API
      if (params.id) {

        axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/sub-category/update/${subCategoryId}`,
          event.target
        )
          .then((result) => {

            console.log("UPDATE RESPONSE =>", result.data);

            if (result.data._status == true) {

              event.target.reset();

              navigate('/SubCategory/View-SubCategory')

              iziToast.success({
                title: "success",
                message: result.data._message,
                position: "topRight"
              })

            } else {

              iziToast.error({
                title: 'error',
                message: 'something went wrong',
                position: 'topRight',
              })

            }

          })

          .catch((error) => {
            console.log("UPDATE ERROR =>", error);
            console.log("UPDATE ERROR DATA =>", error.response?.data);
            iziToast.error({
              title: 'error',
              message: 'something went wrong',
              position: 'topRight',
            })

          })

      }

      // CREATE API
      else {

        axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/sub-category/create`,
          event.target
        )
          .then((result) => {

            if (result.data._status == true) {

              event.target.reset()



              navigate('/SubCategory/View-SubCategory')

              iziToast.success({
                title: "success",
                message: result.data._message,
                position: "topRight"
              })

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
    }
  };


  return (
    <>
      <section className="w-full">

        {/* Breadcrumb */}
        <nav className="sticky top-0 flex overflow-x-auto border-b bg-white px-4 py-3 shadow-sm sm:px-6">
          <ol className="inline-flex items-center space-x-2 text-gray-600">
            <li><a className="text-md font-medium hover:text-indigo-600">Home</a></li>
            <li>/</li>
            <li><a className="text-md font-medium hover:text-indigo-600">Sub Category</a></li>
            <li>/</li>
            <li className="font-semibold text-gray-900">
              {

                subCategoryId
                  ?
                  'update sub Category'
                  :
                  'Add sub Category'
              }
            </li>
          </ol>
        </nav>

        {/* Body */}
        <div className="min-h-[680px] w-full bg-slate-50 px-4 py-6 sm:px-5 sm:py-10">
          <div className="mx-auto">

            <h3 className="text-[24px] font-semibold 
                        bg-gradient-to-r from-indigo-600 to-indigo-500
                        py-3 px-5 rounded-t-lg text-white border border-indigo-500">
              {

                subCategoryId
                  ?
                  'update sub Category'
                  :
                  'Add sub Category'
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
                    accept="image/*"
                    name='image'
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

                {/* Select Category */}
                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Select Parent Category
                  </label>

                  <select
                    onChange={ErrorHandler}
                    name="parent_category_id"
                    defaultValue=""
                    className="text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                        block w-full py-2.5 px-3"
                  >
                    <option value="">Select Category</option>
                    {
                      categories.map((v, i) => {
                        return (
                          <option value={v._id} selected={v._id == parent_category_id ? 'selected' : ''}>{v.name}</option>

                        )
                      })
                    }

                  </select>

                  {errors.includes("parent_category_id") && (
                    <p className="text-red-600 text-sm mt-1">parent-category is required</p>
                  )}
                </div>


                {/* Sub Category Name */}
                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Sub Category Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    defaultValue={subCategoryDetailes.name}
                    autoComplete="off"
                    onKeyUp={ErrorHandler}
                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                                        block w-full py-2.5 px-3"
                    placeholder="Enter category name"
                  />

                  {errors.includes("name") && (
                    <p className="text-red-600 text-sm mt-1">Name is required</p>
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
                    onKeyUp={ErrorHandler}
                    defaultValue={subCategoryDetailes.order}
                    autoComplete="off"
                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                                        block w-full py-2.5 px-3"
                    placeholder="Enter order number"
                  />
                  {errors.includes("order") && (
                    <p className="text-red-600 text-sm mt-1">Order is required</p>
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

                      subCategoryId
                        ?
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
