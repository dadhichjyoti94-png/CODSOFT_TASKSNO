import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import axios from "axios";
import iziToast from "izitoast";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";


export default function NewsLetter(){

    const [newsletter,setNewsletter] = useState([]);

    const [selectedRecord,setSelectedRecord] = useState([]);

    const [apiStatus,setApiStatus] = useState(false);

    const [currentPage,setCurrentPage] = useState(1);

    const [totalPages,setTotalPages] = useState(1);

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/newsletter`;



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

                setNewsletter(result.data._data);
                setTotalPages(result.data._paginate?.total_pages || 1);

            }
            else{

                setNewsletter([]);
                setTotalPages(1);

            }


        })
        .catch(()=>{

            iziToast.error({
                title:"Error",
                message:"Something went wrong",
                position:"topRight"
            })

        })


    },[apiUrl,currentPage,apiStatus]);





    // Single Select

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


        if(selectedRecord.length === newsletter.length){

            setSelectedRecord([]);

        }
        else{

            let ids=[];


            newsletter.forEach((item)=>{

                ids.push(item._id);

            })


            setSelectedRecord(ids);

        }


    }






    // Change Status

    const changeStatus=()=>{


        if(selectedRecord.length===0){

            iziToast.error({

                title:"Error",
                message:"Please select record",
                position:"topRight"

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
                message:result.data._message,
                position:"topRight"

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
                message:"Please select record",
                position:"topRight"

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

                message:result.data._message,

                position:"topRight"

            })


            setSelectedRecord([]);

            setApiStatus(!apiStatus);



        })


    }





return(

<>


<div className="min-h-screen bg-gray-100">


{/* Breadcrumb */}

<div className="bg-white border-b px-6 py-4">

<p className="text-2xl font-semibold text-gray-800">

Home | Enquiry |

<span className="text-violet-500">

News Letter

</span>

</p>

</div>





<section className="p-5">


<div className="bg-white rounded shadow">



<div className="flex justify-end gap-3 p-5">


<button

className="bg-blue-500 text-white p-3 rounded"

>

<FaFilter/>

</button>



<button

onClick={changeStatus}

className="bg-green-500 text-white px-4 rounded"

>

Change Status

</button>




<button

onClick={deleteRecords}

className="bg-red-500 text-white px-4 rounded"

>

Delete

</button>



</div>






<div className="overflow-x-auto">


<table className="w-full text-left">


<thead className="bg-sky-100">


<tr>


<th className="p-3">

<input

type="checkbox"

checked={
newsletter.length>0 &&
selectedRecord.length===newsletter.length
}

onChange={selectAll}

/>

</th>



<th className="p-3">
EMAIL
</th>



<th className="p-3">
STATUS
</th>


</tr>


</thead>




<tbody>



{

newsletter.length>0 ?


newsletter.map((item)=>(


<tr

key={item._id}

className="border-b"

>


<td className="p-3">


<input

type="checkbox"

checked={selectedRecord.includes(item._id)}

onChange={()=>singleCheck(item._id)}

/>


</td>




<td className="p-3">

{item.email}

</td>





<td className="p-3">


{

item.status==1 ?

<span className="bg-green-500 text-white px-3 py-1 rounded">

ACTIVE

</span>


:

<span className="bg-red-500 text-white px-3 py-1 rounded">

INACTIVE

</span>


}


</td>



</tr>


))


:


<tr>

<td

colSpan="3"

className="text-center p-5"

>

No Record Found

</td>

</tr>



}


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


</section>



</div>


</>


)

}
