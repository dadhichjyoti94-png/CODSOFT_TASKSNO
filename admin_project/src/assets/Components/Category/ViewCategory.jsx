import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import iziToast from "izitoast";
import axios from 'axios';
import { IoPencilSharp } from "react-icons/io5";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { FaFilter, FaEdit } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";


export default function ViewCategory() {
  const [Category, setCategory] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalpages] = useState(0);
  const [apiStatus, setApiStatus] = useState(0)
  const [ImagePath, setImagePath] = useState("")


  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/category/view`, {   //API CALL
      name: filterData.name,             //BACKEND M DATA JA RAHA H NAME SE FILTER
      order: filterData.order,            //""    ORDER DE FILTER
      page: currentPage,                  //""  CURRENT PAGE
      limit: 4
    })
      .then((result) => {
        if (result.data._status == true) {           //BACKEND M CHECK KAREGA KI STATUS TRUE
          setCategory(result.data._data)
          setTotalpages(result.data._paginate.total_pages)
          setImagePath(result.data._image_path)
        } else {
          setCategory([]);                      //STATUS FALSE HOGA TO ESME JAYGA
          iziToast.error({
            title: 'error',
            message: 'something went wrong',
            position: 'topRight',
          });
        }
      })
      .catch(() => {
        setCategory([]);
        iziToast.error({
          title: 'error',
          message: 'something went wrong',
          position: 'topRight',
        });
      });

  }, [filterData, currentPage, apiStatus]);



  const applyFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);

    let obj = {
      name: e.target.name.value,
      order: e.target.order?.value || "",
    };

    setFilterData(obj);

    iziToast.success({
      title: "Success",
      message: "Filter applied successfully!",
      position: "topRight",
    });
  };
  


  //FILTER 
  // const applyFilter = (e) => {
  //   e.preventDefault();
  //   setCurrentPage(1)

  //   let obj = {
  //     name: e.target.name.value,
  //     order: e.target.order?.value || "",
  //   };

  //   setFilterData(obj);
  // };
  //CLEAR FILTER WORK
  const clearFilter = () => {
    setFilterData({});
  };
  // CHANGE STATUS LOGIC
  const changeStatus = () => {
    if (selectedRecord.length > 0) {

      axios.put(`${import.meta.env.VITE_API_BASE_URL}/Category/change-status`, {
        ids: selectedRecord,
      })
        .then((result) => {
          if (result.data._status == true) {
            setApiStatus(!apiStatus)
            iziToast.success({
              title: "status updated",
              message: result.data._message,
              position: "topRight"
            })
            setSelectedRecord([])
          } else {

            iziToast.error({
              title: 'error',
              message: result.data._message,
              position: 'topRight',
            });
          }
        })
        .catch(() => {
          iziToast.error({
            title: 'error',
            message: 'something went wrong',
            position: 'topRight',
          });
        });
    } else {
      iziToast.error({
        title: 'No selection',
        message: 'please select at least one record to change status',
        position: 'topRight'
      });
    }
  };

  //DELETE LOGIC
  const deleteRecords = () => {
    if (selectedRecord.length > 0) {

      iziToast.question({
        timeout: 20000,
        close: true,
        overlay: true,
        displayMode: "once",
        id: "delete-confirm",
        zindex: 999999,
        title: "Confirm Delete",
        message: "Are you sure you want to delete ?",
        position: "center",
        buttons: [
          [
            "<button><b>YES, Delete</b></button>",
            function (instance, toast) {
              axios.post(`${import.meta.env.VITE_API_BASE_URL}/Category/delete`, {
                id: selectedRecord,
              })
                .then((result) => {
                  if (result.data._status == true) {
                    setApiStatus(!apiStatus)
                    iziToast.success({
                      title: 'Record Delete',
                      message: result.data._message,
                      position: 'topRight'
                    });

                    setSelectedRecord([])

                  } else {
                    setCategory([]);
                    iziToast.error({
                      title: 'error',
                      message: 'something went wrong',
                      position: 'topRight',
                    });
                  }
                })
                .catch(() => {
                  setMaterial([]);
                  iziToast.error({
                    title: 'error',
                    message: 'something went wrong',
                    position: 'topRight',
                  });
                });




              instance.hide({ transitionOut: "fadeOut" }, toast);
            },
            true
          ],
          [
            "<button>Cancel</button>",
            function (instance, toast) {

              instance.hide({ transitionOut: "fadeOut" }, toast);
            }
          ]
        ]
      });

    } else {
      iziToast.error({
        title: "No Selection",
        message: "Please select at least one record to delete.",
        position: "topRight",
      });
    }
  };

  // CHECK BOX LOGIC
  const [selectedRecord, setSelectedRecord] = useState([]);

  const SingleCheckSelect = (id) => {
    if (selectedRecord.includes(id)) {
      let finalData = selectedRecord.filter((v) => v !== id);
      setSelectedRecord(finalData);
    } else {
      let finalData = [...selectedRecord, id];
      setSelectedRecord(finalData);
    }
  };
  //All select check box
  const selectAllCheckBox = () => {
    if (Category.length == selectedRecord.length) {
      setSelectedRecord([]);
    } else {
      setSelectedRecord([]);
      var checkboxValues = [];
      Category.forEach(element => {
        checkboxValues.push(element._id)
      })
      setSelectedRecord([...checkboxValues]);
    }
  }


  return (
    <>
      <section className="w-full">

        {/* Breadcrumb */}
        <nav className="flex border-b bg-white px-6 py-3 shadow-sm">
          <ol className="inline-flex items-center space-x-2 text-gray-600">
            <li><a className="text-md font-medium hover:text-indigo-600">Home</a></li>
            <li>/</li>
            <li><a className="text-md font-medium hover:text-indigo-600">Category</a></li>
            <li>/</li>
            <li className="text-md font-medium text-gray-900">View Category</li>
          </ol>
        </nav>

        {/* FILTER */}
        <div
          className={`p-4 overflow-hidden transition-all duration-300 ease-out 
          ${openFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <form
            onSubmit={applyFilter}
            className="py-4 relative px-6 my-3 rounded-lg border border-slate-200 w-full bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenFilter()}
              className="absolute right-4 top-4 text-[28px] text-gray-600 hover:text-black cursor-pointer"
            >
              <MdOutlineClose />
            </button>

            <p className="font-semibold py-2 text-[20px]">Filter</p>

            <div className="flex items-center gap-6">

              {/* Category Name */}
              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  placeholder="Enter Category Name"
                  className="text-[17px] border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                  block w-full py-2.5 px-3"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-700">Category Order</label>
                <input
                  type="text"
                  name="order"
                  autoComplete="off"
                  placeholder="Enter Category Order"
                  className="text-[17px] border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                  block w-full py-2.5 px-3"
                />
              </div>

            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="reset"
                onClick={() => setFilterData({})}
                className="text-white bg-slate-500 hover:bg-slate-600 px-6 py-2.5 rounded-lg transition-all"
              >
                Clear
              </button>

              <button
                type="submit"
                className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-lg 
                shadow-sm transition-all focus:ring-4 focus:ring-indigo-300"
              >
                Apply
              </button>
            </div>
          </form>
        </div>

        {/* MAIN */}
        <div className="p-4">

          {/* Header */}
          <div className="bg-slate-100 flex justify-between items-center py-3 px-4 rounded-t-md border border-slate-300">
            <div className="text-[26px] font-semibold">View Category</div>

            <div className="flex gap-3 items-center">

              {/* Filter */}
              <button
                onClick={() => setOpenFilter(!openFilter)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 
                text-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-300 transition-all"
              >
                <FaFilter /> Filter
              </button>

              {/* Delete */}
              <button
                onClick={deleteRecords}
                disabled={selectedRecord.length === 0}
                className="text-white disabled:bg-slate-400 disabled:cursor-not-allowed 
                bg-indigo-600 hover:bg-indigo-700 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all"
              >
                Delete All
              </button>

              {/* Status */}
              <button
                onClick={changeStatus}
                disabled={selectedRecord.length === 0}
                className="text-white disabled:bg-slate-400 disabled:cursor-not-allowed 
                bg-indigo-600 hover:bg-indigo-700 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all"
              >
                Change Status
              </button>

            </div>
          </div>

          {/* TABLE */}
          <div className="border border-t-0 rounded-b-md border-slate-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-700">

                <thead className="text-sm uppercase bg-gradient-to-r from-yellow-600 to-orange-500 text-white border-b">
                  <tr>
                    <th className="px-2 w-[100px] py-3">
                      <input
                        type="checkbox"
                        type="checkbox" checked={Category.length == selectedRecord.length ? 'checked' : ''}
                        onClick={selectAllCheckBox}
                        className="mr-2 w-4 h-4 cursor-pointer text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500" />

                      Select
                    </th>
                    <th className="px-2 w-[60px] py-3">S. No.</th>
                    <th className="px-2 py-3">Name</th>
                    <th className="px-2 w-[100px] py-3">Image</th>
                    <th className="px-2 w-[50px] py-3">Order</th>
                    <th className="px-2 w-[100px] py-3">Status</th>
                    <th className="px-2 w-[100px] py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    Category.length > 0
                      ?
                      Category.map((v , i) => {
                        return (
                          <tr key={v._id} className="bg-white border-b">

                            <td className="px-2 py-4">
                              <input
                                type="checkbox"
                                checked={selectedRecord.includes(v._id) ?
                                  'checked' : ''
                                }
                                onChange={() => SingleCheckSelect(v._id)}
                                className="w-4 h-4 text-indigo-600 cursor-pointer"
                              />
                            </td>

                            <td>
                              {i+1}
                            </td>
                            <td className="px-2 py-4">{v.name}</td>

                            <td>
                              {
                                v.image
                                  ?
                                  <img
                                    className="w-[50px] rounded"
                                    src={`${ImagePath}/${v.image}`}
                                    alt=""
                                  />
                                  :
                                  'N/A'
                              }

                            </td>

                            <td className="px-2 py-4">{v.order}</td>


                            {
                              v.status == true
                                ?
                                <td className="px-2 py-4 text-green-600 font-semibold">
                                  Active
                                </td>
                                :
                                <td className="px-2 py-4 text-red-600 font-semibold">
                                  Inactive
                                </td>
                            }

                            <td className="px-4 py-3 text-amber-500">
                              <Link to={`/Category/update/${v._id}`}>
                                <IoPencilSharp />
                              </Link>
                            </td>

                          </tr>
                        )
                      })
                      :

                      <tr className="bg-white border-b">
                        <td className="px-2 py-4 text-center font-bold colSpan={5}">No Record</td>
                      </tr>
                  }


                </tbody>
              </table>
            </div>
          </div>
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>
      </section>
    </>
  )
}