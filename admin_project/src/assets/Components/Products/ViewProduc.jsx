import React, { useCallback, useEffect, useState } from 'react'
import { FaFilter, FaEdit } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { TbListDetails } from "react-icons/tb";
import iziToast from "izitoast";
import Select from "react-select";
import axios from 'axios';
import { IoPencilSharp } from "react-icons/io5";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';




export default function ViewProducts() {
  const [openFilter, setOpenFilter] = useState(false);
  let [deatailpopup, setdeatailpopup] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState([]);
  let [colors, setColors] = useState([]);
  let [parentCategory, setParentCategory] = useState([])
  let [subCategory, setSubCategory] = useState([])
  let [SubSubCategory, setSubSubCategory] = useState([])
  let [parentCategoryId, setParentCategoryId] = useState('')
  let [materials, setMaterials] = useState([]);
  let [product, setProduct] = useState([])
  let [subCategoryId, setSubCategoryId] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [apiStatus, setApiStatus] = useState(0)
  const [imagePath, setImagePath] = useState("");
  const [detailsImagePath, setDetailsImagePath] = useState("");
  const [totalPages, setTotalpages] = useState();
  // let[filterData,setFilterData]=useState('')

  const emptyFilters = {
    name: "",
    parent_category_id: "",
    sub_category_id: "",
    sub_sub_category_id: "",
    material_id: "",
    color_id: "",
    price_from: "",
    price_to: ""
  };
  const [filterData, setFilterData] = useState(emptyFilters);
  const [filterValues, setFilterValues] = useState(emptyFilters);

  const getColorName = (colorData) => {
    if (Array.isArray(colorData)) {
      return colorData.map((color) => getColorName(color)).filter(Boolean).join(', ');
    }

    if (colorData && typeof colorData === 'object') {
      return colorData.name || colorData.color_name || colorData.colour_name || colorData.color_code || 'N/A';
    }

    const selectedColor = colors.find((color) => color._id === colorData || color.value === colorData);
    return selectedColor?.name || selectedColor?.label || selectedColor?.color_name || selectedColor?.colour_name || selectedColor?.color_code || 'N/A';
  };

  const filterProductsByOptionalFields = useCallback((products) => products.filter((item) => {
    const getRecordId = (value) => (value && typeof value === 'object'
      ? value._id || value.value || ''
      : value || '');
    const materialMatches = !filterData.material_id || getRecordId(item.material_id) === filterData.material_id;
    const colorMatches = !filterData.color_id || getRecordId(item.color_id) === filterData.color_id;
    const productPrice = Number(item.sale_price ?? item.actual_price);
    const priceFromMatches = !filterData.price_from || (Number.isFinite(productPrice) && productPrice >= Number(filterData.price_from));
    const priceToMatches = !filterData.price_to || (Number.isFinite(productPrice) && productPrice <= Number(filterData.price_to));

    return materialMatches && colorMatches && priceFromMatches && priceToMatches;
  }), [filterData]);




  //parent category  id hata di sare record aayge

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/parent-category`, {
      status: true,

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

  //sub category id hata di sare record aayge

  useEffect(() => {

    if (!parentCategoryId) {
      setSubCategory([]);
      return;
    }

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/sub-category`, {
      status: true,
      parent_category_id: parentCategoryId
    })
      .then((result) => {
        if (result.data._status) {
          setSubCategory(result.data._data);
        } else {
          setSubCategory([])
        }
      })
      .catch(() => {
        iziToast.error({
          title: "error",
          message: "something went wrong",
          position: "topRight",
        })
      })
  }, [parentCategoryId])
  // sub sub category

  useEffect(() => {
    if (parentCategoryId && subCategoryId) {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/sub-sub-category`, {
        status: true,
        parent_category_id: parentCategoryId,
        sub_category_id: subCategoryId
      })
        .then((result) => {
          if (result.data._status) {
            setSubSubCategory(result.data._data);
          } else {
            setSubSubCategory([])
          }
        })
        .catch(() => {
          iziToast.error({
            title: "error",
            message: "something went wrong",
            position: "topRight",
          })
        })
    } else {
      setSubSubCategory([]);
    }

  }, [subCategoryId, parentCategoryId])

  //material

  useEffect(() => {

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/material`, {
      status: true,
    })
      .then((result) => {
        if (result.data._status) {
          var newData = result.data._data.map((v) => {
            v.value = v._id
            v.label = v.name

            return v;

          })

          setMaterials(newData);
        } else {
          setMaterials([])
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

  //ParentCATegory k dropDOWEN se valu select karne par sub category k dropdown s valu select ho

  const handleParentCategory = ((e) => {
    if (e.target.value != '') {
      setParentCategoryId(e.target.value)
    } else {
      setParentCategoryId('')
    }

  })

  //colours

  useEffect(() => {

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/colour/view`, {
      status: true,
    })
      .then((result) => {
        if (result.data._status) {
          const colorData = result.data._data.map((v) => ({
            ...v,
            value: v._id,
            label: v.name || v.color_name || v.colour_name || v.color_code
          }));

          setColors(colorData);
        } else {
          setColors([])
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

  //product

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/view`, {   //API CALL
      name: filterData.name,             //BACKEND M DATA JA RAHA H NAME SE FILTER
      parent_category_id: filterData.parent_category_id,
      sub_category_id: filterData.sub_category_id,
      sub_sub_category_id: filterData.sub_sub_category_id,
      material_id: filterData.material_id,
      color_id: filterData.color_id,
      price_from: filterData.price_from,
      price_to: filterData.price_to,
      page: currentPage,
      limit: 0
    })
      .then((result) => {
        console.log("PRODUCT RESPONSE", result.data)
        if (result.data._status == true) {           //BACKEND M CHECK KAREGA KI STATUS TRUE
          setProduct(filterProductsByOptionalFields(result.data._data))
          setTotalpages(result.data._paginate.total_pages)
          setImagePath(result.data._image_path)
        } else {
          setProduct([]);
          iziToast.error({
            title: 'error',
            message: 'something went wrong',
            position: 'topRight',
          });
        }
      })
      .catch(() => {
        setProduct([]);
        iziToast.error({
          title: 'error',
          message: 'something went wrong',
          position: 'topRight',
        });
      });

  }, [filterData, currentPage, apiStatus, filterProductsByOptionalFields]);





  const applyFilter = (e) => {
    e.preventDefault();

    setCurrentPage(1);
    setFilterData(filterValues);

    iziToast.success({
      title: "Success",
      message: "Filter applied successfully!",
      position: "topRight",
    });
  };

  const clearFilter = () => {
    setFilterValues(emptyFilters);
    setFilterData(emptyFilters);
    setCurrentPage(1);
    setParentCategoryId('');
    setSubCategoryId('');
    setSubCategory([]);
    setSubSubCategory([]);

    iziToast.info({
      title: "Cleared",
      message: "All filters removed",
      position: "topRight",
    });
  };




  const SingleCheckSelect = (id) => {
    if (selectedRecord.includes(id)) {
      let finalData = selectedRecord.filter((v) => v != id);
      setSelectedRecord(finalData);
    } else {
      let finalData = [...selectedRecord, id];
      setSelectedRecord(finalData);
    }
  };

  //All check box

  const selectAllCheckBox = () => {
    if (product.length == selectedRecord.length) {
      setSelectedRecord([]);
    } else {
      setSelectedRecord([]);
      var checkboxValues = [];
      product.forEach(element => {
        checkboxValues.push(element._id)
      })
      setSelectedRecord([...checkboxValues]);
    }
  }


  const changeStatus = () => {
    if (selectedRecord.length > 0) {

      axios.put(`${import.meta.env.VITE_API_BASE_URL}/product/change-status`, {
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
        .catch((error) => {

          console.log(error)
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
              axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/delete`, {
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
                    setProduct([]);
                    iziToast.error({
                      title: 'error',
                      message: 'something went wrong',
                      position: 'topRight',
                    });
                  }
                })
                .catch(() => {
                  setProduct([]);
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

  const [productDetails, setproductDetails] = useState({})
  const getproductDetails = (product_id) => {
    // Clear the previous product before loading the newly selected product.
    setproductDetails({});
    setDetailsImagePath("");

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/details/${product_id}`)

      .then((result) => {
        if (result.data._status == true) {

          setproductDetails(result.data._data)
          setDetailsImagePath(result.data._image_path)
          setdeatailpopup(true)


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

  return (
    <>
      <DetailPopUp deatailpopup={deatailpopup} setdeatailpopup={setdeatailpopup}
        productDetails={productDetails} imagePath={detailsImagePath} colors={colors} />
      
      <section className="w-full">

        {/* Breadcrumb */}
        <nav className="flex border-b bg-white px-6 py-3 shadow-sm">
          <ol className="inline-flex items-center space-x-2 text-gray-600">
            <li><a className="text-md font-medium hover:text-indigo-600">Home</a></li>
            <li>/</li>
            <li><a className="text-md font-medium hover:text-indigo-600">Product</a></li>
            <li>/</li>
            <li className="text-md font-medium text-gray-900">View Product</li>
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
              onClick={() => setOpenFilter(false)}
              className="absolute right-4 top-4 text-[28px] text-gray-600 hover:text-black cursor-pointer"
            >
              <MdOutlineClose />
            </button>

            <p className="font-semibold py-2 text-[20px]">Filter</p>

            <div className="flex flex-wrap items-center gap-6">

              {/* Name */}
              <div className="mb-5  basis-full  ">
                <label className="block mb-2 font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={filterValues.name}
                  onChange={(e) => setFilterValues((previous) => ({ ...previous, name: e.target.value }))}
                  autoComplete="off"
                  placeholder="Enter Name"
                  className="text-[17px] border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                  block w-full py-2.5 px-3"
                />
              </div>

              {/* Parent Category Name */}
              <div className='flex gap-3'>

                <div className="mb-6 basis-[33%]">
                  <label className="block mb-2 text-md font-medium text-gray-700">Parent Category</label>
                  <select
                    value={filterValues.parent_category_id}
                    onChange={(e) => {
                      handleParentCategory(e);
                      setSubCategoryId('');
                      setSubSubCategory([]);
                      setFilterValues((previous) => ({
                        ...previous,
                        parent_category_id: e.target.value,
                        sub_category_id: '',
                        sub_sub_category_id: ''
                      }));
                    }}
                    name="parent_category_id"
                    className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3"
                  >
                    <option value=''>Select Parent Category</option>

                    {
                      parentCategory.map((v, i) => {
                        return (
                          <option value={v._id} key={i}>{v.name}</option>
                        )
                      })
                    }
                  </select>

                </div>

                <div className="mb-6 basis-[33%]">
                  <label className="block mb-2 text-md font-medium text-gray-700">Sub Category</label>
                  <select
                    value={filterValues.sub_category_id}
                    onChange={(e) => {
                      setSubCategoryId(e.target.value);
                      setFilterValues((previous) => ({ ...previous, sub_category_id: e.target.value, sub_sub_category_id: '' }));
                    }}
                    name="sub_category_id"
                    className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3"
                  >
                    <option value=''>Select Sub Category</option>
                    {
                      subCategory.map((v, i) => {
                        return (
                          <option value={v._id} key={i}>{v.name}</option>
                        )
                      })
                    }
                  </select>

                </div>

                <div className="mb-6 basis-[33%]">
                  <label className="block mb-2 text-md font-medium text-gray-700">Sub Sub Category</label>
                  <select
                    value={filterValues.sub_sub_category_id}
                    onChange={(e) => setFilterValues((previous) => ({ ...previous, sub_sub_category_id: e.target.value }))}
                    name="sub_sub_category_id"
                    className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3"
                  >
                    <option value=''>Select Sub Sub Category</option>
                    {
                      SubSubCategory.map((v, i) => {
                        return (
                          <option value={v._id} key={i}>{v.name}</option>
                        )
                      })
                    }
                  </select>

                </div>

              </div>


              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Materials
                </label>
                <Select
                  options={materials}
                  name="material_id"
                  value={materials.find((material) => material._id === filterValues.material_id) || null}
                  isSearchable={true}
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(option) => {
                    setFilterValues((previous) => ({ ...previous, material_id: option?._id || option?.value || '' }));
                  }}
                />

                {/* <Select
                  options={materials}
                  name="material_id"
                  isSearchable={true}
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(value) => {
                    setMaterials(value._id);

                    if (value?._id) {
                      (errors.filter(e => e !== "material_id"));
                    }
                  }}
                /> */}


              </div>



              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Colors
                </label>

                <Select
                  options={colors}
                  name="color_id"
                  value={colors.find((color) => color._id === filterValues.color_id || color.value === filterValues.color_id) || null}
                  onChange={(option) => setFilterValues((previous) => ({ ...previous, color_id: option?._id || option?.value || '' }))}
                />


              </div>
              <div className="mb-6 basis-[20%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Price from</label>
                <input type="number" name="price_from" value={filterValues.price_from} onChange={(e) => setFilterValues((previous) => ({ ...previous, price_from: e.target.value }))} placeholder="Enter price" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />

              </div>
              <div className="mb-6 basis-[20%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Price to</label>
                <input type="number" name="price_to" value={filterValues.price_to} onChange={(e) => setFilterValues((previous) => ({ ...previous, price_to: e.target.value }))} placeholder="Enter price" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />

              </div>

            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={clearFilter} className="text-white bg-slate-500 hover:bg-slate-600 px-6 py-2.5 rounded-lg transition-all"
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
            <div className="text-[26px] font-semibold">View Product</div>

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

                <thead className="text-sm uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-2 w-[100px] py-3">
                      <input
                        type="checkbox"
                        type="checkbox" checked={product.length == selectedRecord.length ? 'checked' : ''}
                        onClick={selectAllCheckBox}
                        className="mr-2 w-4 h-4 cursor-pointer text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500" />
                      Select
                    </th>
                    <th className="px-2 w-[60px] py-3">S. No.</th>
                    <th className="px-2 py-3">Name</th>
                    <th className="px-2 py-3"> Category Details</th>
                    <th className="px-2 py-3">material name</th>
                    <th className="px-2 py-3">Color Name</th>
                    <th className="px-2 py-3">Product Type</th>
                    <th className="px-2 w-[100px] py-3">Image</th>
                    <th className="px-2 w-[100px] py-3">Actual Price</th>
                    <th className="px-2 w-[100px] py-3">Sale Price</th>
                    <th className="px-2 w-[50px] py-3">Order</th>
                    <th className="px-2 w-[100px] py-3">Status</th>
                    <th className="px-2 w-[100px] py-3">Action</th>
                  </tr>
                </thead>


                <tbody>
                  {
                    product.length > 0
                      ?
                      product.map((v, i) => {
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
                              {i + 1}
                            </td>
                            <td className="px-2 py-4 ">{v.name}</td>
                            <td className="px-2 py-4 whitespace-nowrap min-w-[250px]">
                              {v.parent_category_id?.name}{' >>> '}
                              {v.sub_category_id?.name}{' >>> '}
                              {v.sub_sub_category_id?.name}
                            </td>
                            {/* <td className="px-2 py-4">{v.parent_category_id?.name}{'>>>'}{v.sub_category_id?.name}{v.sub_sub_category_id?.name}{'>>>'}</td> */}
                            <td className="px-2 py-4">{v.material_id?.name || 'N/A'}</td>
                            <td className="px-2 py-4">{getColorName(v.color_id)}</td>
                            <td className="px-2 py-4">
                              {
                               v.product_type == 1
                                  ?
                                  <>Featured</>
                                  :
                                  v.product_type == 2
                                    ?
                                    'New Arrivals'
                                    :
                                    'On Sale'
                              }
                            </td>

                            <td>
                              {
                                v.image
                                  ?
                                  <img
                                    className="w-[50px] rounded"
                                    src={`${imagePath}/${v.image}`}
                                    alt=""
                                  />
                                  :
                                  'N/A'
                              }

                            </td>
                            <td className="px-2 py-4">{v.actual_price}</td>
                            <td className="px-2 py-4">{v.sale_price}</td>
                            <td className="px-2 py-4">{v.order}</td>


                            {
                              v.status == 1
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
                              <TbListDetails onClick={() => getproductDetails(v._id)} />
                              <Link to={`/Products/update/${v._id}`}>
                                <IoPencilSharp />
                              </Link>
                            </td>

                          </tr>
                        )
                      })
                      :

                      <tr className="bg-white border-b">
                        <td className="px-2 py-4 text-center font-bold" colSpan={13}>
                          No Record
                        </td>
                      </tr>
                  }


                </tbody>


                {/* Row 1 */}
                { }

                {/* Row 2 */}



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
  );
}


function DetailPopUp({ deatailpopup, setdeatailpopup, productDetails, imagePath, colors = [] }) {
  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string" && image.startsWith("http")) return image;

    const imageName = typeof image === "string" ? image : image.image;
    return imageName ? `${imagePath}/${imageName}` : "";
  };

  const mainImageUrl = getImageUrl(productDetails?.image);
  const galleryImages = Array.isArray(productDetails?.images)
    ? productDetails.images.filter(Boolean)
    : [];

  const getColorName = (colorData) => {
    if (Array.isArray(colorData)) {
      return colorData.map((color) => getColorName(color)).filter(Boolean).join(', ');
    }

    if (colorData && typeof colorData === 'object') {
      return colorData.name || colorData.color_name || colorData.colour_name || colorData.color_code || 'N/A';
    }

    const selectedColor = colors.find((color) => color._id === colorData || color.value === colorData);
    return selectedColor?.name || selectedColor?.label || selectedColor?.color_name || selectedColor?.colour_name || selectedColor?.color_code || 'N/A';
  };

  return (

    <>
      <div
        className={`${deatailpopup ? "" : "hidden"
          } fixed inset-0 z-50 flex items-center justify-center bg-black/40`}
      >
        <div className="max-h-[90vh] w-[95%] max-w-6xl overflow-y-auto rounded-lg bg-white shadow-lg">

          {/* HEADER */}
          <div className="flex items-center justify-between border-b bg-slate-100 px-4 py-4 sm:px-6 rounded-t-lg">
            <h2 className="text-[22px] font-semibold text-gray-800">
              Product Details
            </h2>

            <button
              onClick={() => setdeatailpopup(false)}
              className="text-gray-600 hover:text-black text-2xl"
            >
              ×
            </button>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-3">

            {/* MAIN IMAGE */}
            <div className="border border-slate-200 rounded-lg p-4 shadow-sm">
              {mainImageUrl && (
                <img
                  className="w-full h-[250px] object-cover rounded"
                  src={mainImageUrl}
                  alt={productDetails?.name || "product"}
                />
              )}
            </div>

            {/* MULTIPLE IMAGES */}
            <div className="border border-slate-200 rounded-lg p-4 shadow-sm flex flex-wrap gap-3">
              {galleryImages.map((image, index) => {
                const imageUrl = getImageUrl(image);

                return imageUrl ? (
                  <img
                    key={`${imageUrl}-${index}`}
                    className="w-24 h-24 object-cover rounded"
                    src={imageUrl}
                    alt={`${productDetails?.name || "product"} ${index + 1}`}
                  />
                ) : null;
              })}
            </div>

            {/* DETAILS */}
            <div className="border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-center text-[20px] font-semibold text-gray-800 mb-4">
                Product Info
              </h3>

              <ul className="space-y-3 text-[16px]">
                <li>
                  <span className="font-semibold">Product Name</span>
                  <span className="ml-2 text-gray-700">{productDetails?.name}</span>
                </li>
                <li>
                  <span className="font-semibold">Actual prize</span>
                  <span className="ml-2 text-gray-700">{productDetails?.actual_price}</span>
                </li>

                <li>
                  <span className="font-semibold">sale Price:</span>
                  <span className="ml-2 text-gray-700">{productDetails?.sale_price}</span>
                </li>

                <li>
                  <span className="font-semibold">MRP:</span>
                  <span className="ml-2 text-gray-700 line-through">₹ 1499</span>
                </li>

                <li>
                  <span className="font-semibold">Stock:</span>
                  <span className="ml-2 text-green-600 font-medium">In Stock</span>
                </li>

                <li>
                  <span className="font-semibold">Brand:</span>
                  <span className="ml-2 text-gray-700">Levi's</span>
                </li>

                <li>
                  <span className="font-semibold">Size:</span>
                  <span className="ml-2 text-gray-700">S, M, L, XL</span>
                </li>

                <li>
                  <span className="font-semibold">Color:</span>
                  <span className="ml-2 text-gray-700">{getColorName(productDetails?.color_id)}</span>
                </li>

              </ul>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t bg-slate-50 px-4 py-4 sm:px-6 rounded-b-lg">
            <button
              onClick={() => setdeatailpopup(false)}
              className="px-5 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg"
            >
              Close
            </button>

            {/* <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow">
              Edit Product
            </button> */}
          </div>
        </div>
      </div>
    </>
  )
}
