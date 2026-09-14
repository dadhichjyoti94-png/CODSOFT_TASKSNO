import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function AddMaterial() {

  var [material, setMaterial] = useState('');
  var [details, setdetails] = useState({ name: '', order: '' });     //details ka data

  var navigate = useNavigate()      //view page par jane k liye

  const params = useParams();        //URL  S ID NIKALNA

  useEffect(() => {                          //CHECKED URL M ID H YA NAHI
    setMaterial(params.id || '')      

    if (params.id) {                            //URL M ID H TO DETAIL API CHLEGE
      axios.post(`http://localhost:5000/api/admin/material/details/${params.id}`)
        .then((result) => {
          if (result.data._status == true) {
            setdetails(result.data._data)
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

      if (material) {
        axios.post(`http://localhost:5000/api/admin/material/update/${material}`, {
          name: event.target.name.value,
          order: event.target.order.value
        })
          .then((result) => {
            if (result.data._status == true) {
              event.target.reset()
              navigate('/Material/View-Material')

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
        axios.post('http://localhost:5000/api/admin/material/create', {
          name: event.target.name.value,
          order: event.target.order.value
        })
          .then((result) => {
            if (result.data._status == true) {
              event.target.reset()
              navigate('/Material/View-Material')

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
                Material
              </a>
            </li>
            <li>/</li>

            <li aria-current="page">
              <span className="text-md font-semibold text-gray-900">
                {material ? 'update material' : 'Add material'}
              </span>
            </li>
          </ol>
        </nav>

        <div className="w-full min-h-[680px] px-4 bg-slate-50 py-10">
          <div className="mx-auto">

            <h3 className="text-[24px] font-semibold 
            bg-gradient-to-r from-indigo-600 to-indigo-500
            py-3 px-5 rounded-t-lg text-white border border-indigo-500">
              {material ? 'update material' : 'Add material'}
            </h3>

            <form onSubmit={formhandler} className="border border-slate-200 border-t-0 bg-white p-6 rounded-b-lg shadow-sm">

              <div className="mb-6">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Material Name
                </label>

                <input
                  type="text"
                  name="name"
                  defaultValue={details.name}
                  autoComplete="off"
                  onKeyUp={ErrorHandler}
                  className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                  focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                  block w-full py-2.5 px-3"
                  placeholder="Enter Material name"
                />

                {errors.includes("name") && (
                  <p className="text-red-600 text-sm mt-1">
                    Name is required
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Order
                </label>

                <input
                  type="number"
                  name="order"
                  defaultValue={details.order}
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
                {material ? 'update' : 'submit'}
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  )
}