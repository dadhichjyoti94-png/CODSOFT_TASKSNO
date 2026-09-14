import React, { useState, useEffect } from "react";
import axios from "axios";
import iziToast from "izitoast";
import { Link } from "react-router-dom";
import { FaFilter, FaPen } from "react-icons/fa";

export default function ViewSlider() {



  const [sliderData, setSliderData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [apiStatus, setApiStatus] = useState(false);

  const getSlider = () => {

    axios.post("http://localhost:5000/api/admin/slider/view")
      .then((result) => {
        if (result.data._status) {
          setSliderData(result.data._data);
        } else {
          setSliderData([]);
        }
      })
      .catch(() => {
        iziToast.error({
          title: "Error",
          message: "Something went wrong",
          position: "topRight",
        });
      });
  };

  useEffect(() => {
    getSlider();
  }, [apiStatus]);
  const changeStatus = () => {
    if (selectedRecord.length > 0) {

      axios.put('http://localhost:5000/api/admin/slider/change-status', {
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
              axios.post('http://localhost:5000/api/admin/slider/delete', {
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

                    iziToast.error({
                      title: 'error',
                      message: 'something went wrong',
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




              instance.hide({ transitionOut: "fadeOut" }, toast);
            },
            true
          ],
          [
            "<button>Cancel</button>",
            function (instance, toast) {
              iziToast.info({
                title: "Cancelled",
                message: "slider delete action cancelled.",
                position: "topRight",
              });

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
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b px-6 py-4">
        <p className="text-2xl font-semibold text-gray-800">
          Home | Slider |{" "}
          <span className="text-violet-500">View Slider</span>
        </p>
      </div>

      <section className="dark:bg-gray-900 p-3 sm:p-5 w-full">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">

          <div className="bg-white shadow-md rounded-lg overflow-hidden">

            <div className="flex justify-between items-center p-4">
              <h2 className="text-xl font-bold">View Slider</h2>

              <div className="flex gap-3">
                <div className="bg-blue-500 p-2 rounded-full">
                  <FaFilter className="text-white" />
                </div>

                <button
                  onClick={() => {
                    console.log(selectedRecord)
                    changeStatus()
                  }}
                  disabled={selectedRecord.length === 0}
                  className="bg-indigo-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
                >

                  Change Status

                </button>


                <button
                  onClick={deleteRecords}
                  disabled={selectedRecord.length === 0}
                  className="bg-red-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
                >

                  Delete

                </button>

              </div>
            </div>

            <table className="w-full table-auto border-collapse">

              <thead className="bg-gray-200">
                <tr>
                  <th className="w-[60px] p-3 text-center"></th>
                  <th className="p-3 text-center">Title</th>
                  <th className="p-3 text-center">Image</th>
                  <th className="p-3 text-center">Order</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {sliderData.length > 0 ? (
                  sliderData.map((item) => (
                    <tr key={item._id} className="border-b">

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRecord.includes(item._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecord([...selectedRecord, item._id]);
                            } else {
                              setSelectedRecord(
                                selectedRecord.filter((id) => id !== item._id)
                              );
                            }
                          }}
                        />
                      </td>

                      <td className="p-3 text-center">
                        {item.title}
                      </td>

                      <td className="p-3 text-center">
                        {item.image ? (
                          <img
                            src={`http://localhost:5000/uploads/slider/${item.image}`}
                            alt={item.title}
                            className="w-20 h-14 object-cover rounded mx-auto"
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="p-3 text-center">
                        {item.order}
                      </td>

                      <td className="p-3 text-center">
                        {Number(item.status) === 1 ? (
                          <span className="bg-green-500 text-white px-3 py-1 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-3 py-1 rounded">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <Link to={`/Slider/update/${item._id}`}>
                          <FaPen className="mx-auto text-blue-600 text-lg" />
                        </Link>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-5">
                      No Record Found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>

        </div>
      </section>
    </>
  );
}