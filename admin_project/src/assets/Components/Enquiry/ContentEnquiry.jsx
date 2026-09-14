import React, { useEffect, useState } from "react";
import { FaFilter, FaPen } from "react-icons/fa";
import axios from "axios";
import iziToast from "izitoast";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";


export default function ContentEnquiry(){

    const [enquiry,setEnquiry]=useState([]);

    const [selectedRecord,setSelectedRecord]=useState([]);

    const [apiStatus,setApiStatus]=useState(false);

    const [currentPage,setCurrentPage]=useState(1);

    const [totalPages,setTotalPages]=useState(1);

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/content-enquiry`;



    useEffect(()=>{

        axios.post(
            `${apiUrl}/view`,
            {
                page:currentPage,
                limit:10
            }
        )
        .then((result)=>{

            if(result.data._status){

                setEnquiry(result.data._data);
                setTotalPages(result.data._paginate?.total_pages || 1);

            }
            else{

                setEnquiry([]);
                setTotalPages(1);

            }

        })


    },[apiUrl,currentPage,apiStatus]);




    // Single Checkbox

    const singleCheck=(id)=>{

        if(selectedRecord.includes(id)){

            setSelectedRecord(
                selectedRecord.filter(v=>v!==id)
            )

        }
        else{

            setSelectedRecord([
                ...selectedRecord,
                id
            ])

        }

    }




    // Select All

    const selectAll=()=>{

        if(selectedRecord.length===enquiry.length){

            setSelectedRecord([]);

        }
        else{

            let ids=[];

            enquiry.map((item)=>{

                ids.push(item._id)

            })

            setSelectedRecord(ids);

        }

    }




    // Status

    const changeStatus=()=>{


        if(selectedRecord.length===0){

            iziToast.error({
                title:"Error",
                message:"Please select record"
            })

            return;

        }


        axios.put(
            `${apiUrl}/change-status`,
            {
                ids:selectedRecord
            }
        )
        .then((result)=>{

            iziToast.success({
                title:"Success",
                message:result.data._message
            })


            setSelectedRecord([]);

            setApiStatus(!apiStatus);

        })


    }




    // Delete

    const deleteRecords=()=>{


        if(selectedRecord.length===0){

            iziToast.error({
                title:"Error",
                message:"Please select record"
            })

            return;

        }


        axios.delete(
            `${apiUrl}/delete`,
            {
                data:{
                    id:selectedRecord
                }
            }
        )
        .then((result)=>{


            iziToast.success({
                title:"Deleted",
                message:result.data._message
            })


            setSelectedRecord([]);

            setApiStatus(!apiStatus);


        })


    }





return (
  <div className="p-4">

    {/* Breadcrumb */}
    <div className="mb-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Content Enquiry
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Home / Enquiry / Content Enquiry
      </p>
    </div>

    {/* Main Box */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

      {/* Top Buttons */}
      <div className="flex justify-end items-center gap-3 p-5">

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-md flex items-center justify-center"
        >
          <FaFilter />
        </button>

        <button
          onClick={changeStatus}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md"
        >
          Change Status
        </button>

        <button
          onClick={deleteRecords}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md"
        >
          Delete
        </button>

      </div>


      {/* Table */}
      <div className="w-full overflow-x-auto">

        <table className="w-full table-fixed border-collapse">

          {/* Header */}
          <thead>

            <tr className="bg-blue-100">

              <th className="w-[5%] px-3 py-4 text-left">
                <input
                  type="checkbox"
                  checked={
                    enquiry.length > 0 &&
                    selectedRecord.length === enquiry.length
                  }
                  onChange={selectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>

              <th className="w-[17%] px-3 py-4 text-left text-[17px] font-semibold">
                Name
              </th>

              <th className="w-[20%] px-3 py-4 text-left text-[17px] font-semibold">
                Email
              </th>

              <th className="w-[15%] px-3 py-4 text-left text-[17px] font-semibold">
                Phone
              </th>

              <th className="w-[17%] px-3 py-4 text-left text-[17px] font-semibold">
                Subject
              </th>

              <th className="w-[16%] px-3 py-4 text-left text-[17px] font-semibold">
                Message
              </th>

              <th className="w-[10%] px-3 py-4 text-left text-[17px] font-semibold">
                Status
              </th>

            </tr>

          </thead>


          {/* Body */}
          <tbody>

            {enquiry.length > 0 ? (

              enquiry.map((item) => (

                <tr
                  key={item._id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >

                  {/* Checkbox */}
                  <td className="px-3 py-5 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedRecord.includes(item._id)}
                      onChange={() => singleCheck(item._id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>


                  {/* Name */}
                  <td className="px-3 py-5 align-middle break-words">
                    {item.name}
                  </td>


                  {/* Email */}
                  <td className="px-3 py-5 align-middle break-words">
                    {item.email}
                  </td>


                  {/* Phone */}
                  <td className="px-3 py-5 align-middle">
                    {item.phone}
                  </td>


                  {/* Subject */}
                  <td className="px-3 py-5 align-middle break-words">
                    {item.subject}
                  </td>


                  {/* Message */}
                  <td className="px-3 py-5 align-middle break-words whitespace-normal">
                    {item.message}
                  </td>


                  {/* Status */}
                  <td className="px-3 py-5 align-middle">

                    {item.status == 1 ? (

                      <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                        ACTIVE
                      </span>

                    ) : (

                      <span className="inline-block bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                        INACTIVE
                      </span>

                    )}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500"
                >
                  No enquiry found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* Pagination */}
      {enquiry.length > 0 && (
        <div className="flex justify-end p-5">

          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>
      )}

    </div>

  </div>
);

}
