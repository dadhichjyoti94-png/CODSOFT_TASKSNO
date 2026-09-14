
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default function AddColor() {
    

  var [colour, setcolour] = useState('');
  var [colourdetails, setColourdetails] = useState({ name: '', order: '' ,color_code:''});     //details ka data

  var navigate = useNavigate()      //view page par jane k liye

  const params = useParams();        //URL  S ID NIKALNA

  useEffect(() => {                          //CHECKED URL M ID H YA NAHI
    setcolour(params.id || '')      

    if (params.id) {                            //URL M ID H TO DETAIL API CHLEGE
      axios.post(`http://localhost:5000/api/admin/colour/details/${params.id}`)
        .then((result) => {
          if (result.data._status == true) {
            setColourdetails(result.data._data)
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
  }, [params.id])                        //Dependency 

   //VALIDATION ERROR SHOW

  let [errors, setErrors] = useState([]);

  //FORM HANDLER FUNCTION

  let formhandler = (event) => {
    event.preventDefault();              //PAGE RELOAD HONE SE ROKTA 

     // PURA FORM 

    let form = event.target;
    let fields = form.querySelectorAll('input')       

    let newErrors = [];

    fields.forEach((field) => {
      if (!field.value.trim()) {
        newErrors.push(field.name);       
      }
    });

    newErrors = [...new Set(newErrors)];
    setErrors(newErrors);

    if (newErrors.length === 0) {

      if (colour) {
        axios.post(`http://localhost:5000/api/admin/colour/update/${colour}`, {
          name: event.target.name.value,
          order: event.target.order.value,
          color_code: event.target.color_code.value
        })
          .then((result) => {
            if (result.data._status == true) {
              event.target.reset()
              navigate('/colour/View-Colour')

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

      } else {
        axios.post('http://localhost:5000/api/admin/colour/create', {
          name: event.target.name.value,
          order: event.target.order.value,
          color_code: event.target.color_code.value
        })
          .then((result) => {
            if (result.data._status == true) {
              event.target.reset()
              navigate('/colour/View-Colour')

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
      }
    }
  };

       //FORM M VALIDATION ERROR
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


  return (
    <>
      <section className="w-full">

        <nav
          className="flex border-b bg-white px-6 py-3 shadow-sm"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-2 text-gray-600">
            <li>
              <a href="#" className="text-md font-medium hover:text-indigo-600">
                Home
              </a>
            </li>
            <li>/</li>

            <li>
              <a href="#" className="text-md font-medium hover:text-indigo-600">
                colour
              </a>
            </li>
            <li>/</li>

            <li aria-current="page">
              <span className="text-md font-semibold text-gray-900">
                {colour ? 'update colour' : 'Add colour'}
              </span>
            </li>
          </ol>
        </nav>

        <div className="w-full min-h-[680px] px-4 bg-slate-50 py-10">
          <div className="mx-auto">

            <h3 className="text-[24px] font-semibold 
            bg-gradient-to-r from-indigo-600 to-indigo-500
            py-3 px-5 rounded-t-lg text-white border border-indigo-500">
              {colour ? 'update colour' : 'Add colour'}
            </h3>

            <form onSubmit={formhandler} className="border border-slate-200 border-t-0 bg-white p-6 rounded-b-lg shadow-sm">

              <div className="mb-6">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Colour Name
                </label>

                <input
                  type="text"
                  name="name"
                  defaultValue={colourdetails.name}
                  autoComplete="off"
                  onKeyUp={ErrorHandler}
                  className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                  focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                  block w-full py-2.5 px-3"
                  placeholder="Enter Colour name"
                />

                {errors.includes("name") && (
                  <p className="text-red-600 text-sm mt-1">
                    Name is required
                  </p>
                )}
                <div className="mb-6">
      <label className="block mb-2 text-md font-medium text-gray-700">
         Color Code
      </label>

    <input
    type="text"
    name="color_code"
    defaultValue={colourdetails.color_code}
    onKeyUp={ErrorHandler}
    autoComplete="off"
    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
    block w-full py-2.5 px-3"
    placeholder="Enter color code e.g. #FF5733"
  />

  {errors.includes("color_code") && (
    <p className="text-red-600 text-sm mt-1">
      Color code is required
    </p>
  )}
</div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Order
                </label>

                <input
                  type="number"
                  name="order"
                  defaultValue={colourdetails.order}
                  onKeyUp={ErrorHandler}
                  autoComplete='off'
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

              <button
                type="submit"
                className="mt-3 cursor-pointer text-white 
                bg-indigo-600 hover:bg-indigo-700
                focus:ring-4 focus:ring-indigo-300
                font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all"
              >
                {colour ? 'update' : 'submit'}
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  )
}

    

    // return (
    //     <>
    //         <section className="w-full">

    //             {/* Breadcrumb */}
    //             <nav
    //                 className="flex border-b bg-white px-6 py-3 shadow-sm"
    //                 aria-label="Breadcrumb"
    //             >
    //                 <ol className="inline-flex items-center space-x-2 text-gray-600">
    //                     <li>
    //                         <a href="#" className="text-md font-medium hover:text-indigo-600">
    //                             Home
    //                         </a>
    //                     </li>
    //                     <li>/</li>

    //                     <li>
    //                         <a href="#" className="text-md font-medium hover:text-indigo-600">
    //                             Color
    //                         </a>
    //                     </li>
    //                     <li>/</li>

    //                     <li aria-current="page">
    //                         <span className="text-md font-semibold text-gray-900">
    //                             Add Color
    //                         </span>
    //                     </li>
    //                 </ol>
    //             </nav>

    //             {/* BODY */}
    //             <div className="w-full min-h-[680px] px-4 bg-slate-50 py-10">
    //                 <div className="mx-auto ">

    //                     <h3 className="text-[24px] font-semibold 
    //                     bg-gradient-to-r from-indigo-600 to-indigo-500
    //                     py-3 px-5 rounded-t-lg text-white border border-indigo-500">
    //                          {colour ? 'update colour' : 'Add colour'}
    //                     </h3>

    //                     <form onSubmit={formhandler} className="border border-slate-200 border-t-0 bg-white p-6 rounded-b-lg shadow-sm">

    //                         {/* Color Name */}
    //                         <div className="mb-6">
    //                             <label className="block mb-2 text-md font-medium text-gray-700">
    //                                 Color Name
    //                             </label>

    //                             <input
    //                                 type="text"
    //                                 name="name"
    //                                 autoComplete="off"
    //                                 onKeyUp={ErrorHandler}
    //                                 className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
    //                                 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
    //                                 block w-full py-2.5 px-3"
    //                                 placeholder="Enter color name (e.g., Red)"
    //                             />

    //                             {errors.includes("name") && (
    //                                 <p className="text-red-600 text-sm mt-1">
    //                                     Name is required
    //                                 </p>
    //                             )}
    //                         </div>

    //                         {/* Color Code */}
    //                         <div className="mb-6">
    //                             <label className="block mb-2 text-md font-medium text-gray-700">
    //                                 Color Code
    //                             </label>

    //                             <input
    //                                 type="text"
    //                                 name="code"
    //                                 autoComplete="off"
    //                                 onKeyUp={ErrorHandler}
    //                                 className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
    //                                 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
    //                                 block w-full py-2.5 px-3"
    //                                 placeholder="Hex code (e.g., #FF5733)"
    //                             />

    //                             {errors.includes("code") && (
    //                                 <p className="text-red-600 text-sm mt-1">
    //                                     Color code is required
    //                                 </p>
    //                             )}
    //                         </div>

    //                         {/* Order */}
    //                         <div className="mb-6">
    //                             <label className="block mb-2 text-md font-medium text-gray-700">
    //                                 Order
    //                             </label>

    //                             <input
    //                                 type="number"
    //                                 name="order"
    //                                 min={1}
    //                                 autoComplete="off"
    //                                 className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
    //                                 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
    //                                 block w-full py-2.5 px-3"
    //                                 placeholder="Enter order number"
    //                             />
    //                         </div>

    //                         <button
    //                             type="submit"
    //                             className="mt-3 cursor-pointer text-white 
    //                             bg-indigo-600 hover:bg-indigo-700
    //                             focus:ring-4 focus:ring-indigo-300
    //                             font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all"
    //                         >
    //                             {colour ? 'update' : 'submit'}
    //                         </button>

    //                     </form>
    //                 </div>
    //             </div>
    //         </section>
    //     </>
    // );
