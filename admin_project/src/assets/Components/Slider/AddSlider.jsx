import React, { useEffect, useState } from "react";
import axios from "axios";
import iziToast from "izitoast";
import { useNavigate, useParams } from "react-router-dom";

export default function AddSlider() {

  const [slider, setSlider] = useState("");

  const [details, setDetails] = useState({
    title: "",
    order: "",
    image: "",
  });

  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {

    setSlider(params.id || "");

    if (params.id) {

      axios
        .post(`http://localhost:5000/api/admin/slider/details/${params.id}`)
        .then((result) => {

          if (result.data._status) {

            setDetails(result.data._data);

            setPreview(
              `http://localhost:5000/uploads/slider/${result.data._data.image}`
            );

          } else {

            iziToast.error({
              title: "Error",
              message: "Something went wrong",
              position: "topRight",
            });

          }

        })
        .catch(() => {

          iziToast.error({
            title: "Error",
            message: "Something went wrong",
            position: "topRight",
          });

        });

    }

  }, [params.id]);

  const imageHandler = (e) => {

    let file = e.target.files[0];

    if (file) {

      setImage(file);
      setPreview(URL.createObjectURL(file));

    }

  };

  const formHandler = (event) => {

    event.preventDefault();

    let form = event.target;
    let fields = form.querySelectorAll("input");

    let newErrors = [];

    fields.forEach((field) => {

      if (
        field.type !== "file" &&
        !field.value.trim()
      ) {
        newErrors.push(field.name);
      }

    });

    newErrors = [...new Set(newErrors)];

    setErrors(newErrors);

    if (newErrors.length !== 0) return;

    let formData = new FormData();

    formData.append("title", event.target.title.value);
    formData.append("order", event.target.order.value);

    if (image) {
      formData.append("image", image);
    }

    if (slider) {

      axios
        .put(
          `http://localhost:5000/api/admin/slider/update/${slider}`,
          formData
        )
        .then((result) => {

          if (result.data._status) {

            iziToast.success({
              title: "Success",
              message: result.data._message,
              position: "topRight",
            });

            navigate("/Slider/View-Slider");

          } else {

            iziToast.error({
              title: "Error",
              message: result.data._message,
              position: "topRight",
            });

          }

        });

    } else {

      if (!image) {

        iziToast.error({
          title: "Error",
          message: "Please select image",
          position: "topRight",
        });

        return;

      }

      formData.append("image", image);

      axios
        .post(
          "http://localhost:5000/api/admin/slider/create",
          formData
        )
        .then((result) => {

          if (result.data._status) {

            iziToast.success({
              title: "Success",
              message: result.data._message,
              position: "topRight",
            });

            event.target.reset();

            setImage("");
            setPreview("");

            navigate("/Slider/View-Slider");

          } else {

            iziToast.error({
              title: "Error",
              message: result.data._message,
              position: "topRight",
            });

          }

        });

    }

  };

  const ErrorHandler = (event) => {

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
      <nav className="flex overflow-x-auto border-b bg-white px-4 py-3 shadow-sm sm:px-6">

        <ol className="inline-flex items-center space-x-2">

          <li>Home</li>

          <li>/</li>

          <li>Slider</li>

          <li>/</li>

          <li className="font-semibold">
            {slider ? "Update Slider" : "Add Slider"}
          </li>

        </ol>

      </nav>

      <div className="min-h-screen bg-slate-100 p-4 sm:p-8">

        <h2 className="bg-pink-500 text-white text-2xl font-bold p-4 rounded-t">

          {slider ? "Update Slider" : "Add Slider"}

        </h2>

        <form
          onSubmit={formHandler}
          className="bg-white p-6 rounded-b shadow"
        >

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

            <div>

              <label className="font-semibold block mb-3">

                Slider Image

              </label>

              <label
                htmlFor="sliderImage"
                className="w-60 h-52 border flex items-center justify-center cursor-pointer overflow-hidden rounded bg-gray-100"
              >

                {preview ? (

                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <span>Click To Upload Image</span>

                )}

              </label>

              <input
                id="sliderImage"
                type="file"
                hidden
                onChange={imageHandler}
              />

            </div>

            <div className="md:col-span-2">

              <div className="mb-6">

                <label className="font-semibold block mb-2">

                  Title

                </label>

                <input
                  type="text"
                  name="title"
                  defaultValue={details.title}
                  onKeyUp={ErrorHandler}
                  className="border rounded w-full p-3"
                />

                {errors.includes("title") && (
                  <p className="text-red-600">
                    Title is required
                  </p>
                )}

              </div>

              <div className="mb-6">

                <label className="font-semibold block mb-2">

                  Order

                </label>

                <input
                  type="number"
                  name="order"
                  defaultValue={details.order}
                  onKeyUp={ErrorHandler}
                  className="border rounded w-full p-3"
                />

                {errors.includes("order") && (
                  <p className="text-red-600">
                    Order is required
                  </p>
                )}

              </div>

              <button
                className="bg-pink-500 text-white px-8 py-3 rounded"
                type="submit"
              >
                {slider ? "Update Slider" : "Add Slider"}
              </button>

            </div>

          </div>

        </form>

      </div>
    </>
  );
}
