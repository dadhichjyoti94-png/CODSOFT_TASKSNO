import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/style.css'
import 'izitoast/dist/css/iziToast.min.css'
import './utils/adminAxios'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Login from './assets/Components/Login'
import ViewUser from './assets/Components/Users/ViewUser'
import UpdateUser from './assets/Components/Users/UpdateUser'
import CommonLayout from './assets/Components/Common/CommonLayout'
import ContentEnquiry from './assets/Components/Enquiry/ContentEnquiry'
import NewsLetter from './assets/Components/Enquiry/NewsLetter'
import DashBoard from './assets/Components/DashBord'
import AddColour from './assets/Components/Colour/AddColour'
import ViewColour from './assets/Components/Colour/ViewColour'
import AddMaterial from './assets/Components/Material/AddMaterial'
import ViewMaterial from './assets/Components/Material/ViewMaterial'
import AddCategory from './assets/Components/Category/AddCategory'
import ViewCategory from './assets/Components/Category/ViewCategory'
import AddSubCategory from './assets/Components/SabCategory/AddSubCategory'
import ViewSubCategory from './assets/Components/SabCategory/ViewSubCategory'
import AddSubSubCategory from './assets/Components/SabSab Category/AddSubSubCategory'
import ViewSubSubCategory from './assets/Components/SabSab Category/ViewSubSubCategory'

import AddProducts from './assets/Components/Products/AddProduct'
import ViewProducts from './assets/Components/Products/ViewProduc'
import AddChooseUs from './assets/Components/WhyChoose_us/AddChooseUs'
import ViewChooseUs from './assets/Components/WhyChoose_us/ViewChooseUs'
// import OrderList from './assets/Components/Order/OrderList'
import AddSlider from './assets/Components/Slider/AddSlider'
import ViewSlider from './assets/Components/Slider/ViewSlider'
import AddCountry from './assets/Components/country/AddCountry'
import ViewCountry from './assets/Components/country/ViewCountry'
import AddTestimonial from './assets/Components/Testimonial/AddTestimonial'
import ViewTestimonial from './assets/Components/Testimonial/ViewTestimonial'
import AddFaq from './assets/Components/Faq/AddFaq'
import ViewFaq from './assets/Components/Faq/ViewFaq'
import MainContext from "./assets/Components/MainContext";
import ViewOrders from './assets/Components/Order/ViewOrders'
import MyProfile from './assets/Components/Profile/MyProfile'
import MyCompany from './assets/Components/Profile/MyCompany'

createRoot(document.getElementById('root')).render(
  <>
    <MainContext>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />

          <Route element={<CommonLayout />}>
            <Route path='dashboard' element={<DashBoard />} />
            <Route path='my-profile' element={<MyProfile />} />
            <Route path='my-company' element={<MyCompany />} />
            <Route path='user'>
              <Route path='view' element={<ViewUser />} />
              <Route path='update/:id' element={<UpdateUser />} />
            </Route>
            <Route path='enquiry'>
              <Route path='content-enquiry' element={<ContentEnquiry />} />
              <Route path='news-letter' element={<NewsLetter />} />
            </Route>
            <Route path='Colour'>
              <Route path='Add-Colour' element={<AddColour />} />
              <Route path='update/:id' element={<AddColour />} />
              <Route path='View-Colour' element={<ViewColour />} />
            </Route>

            <Route path='Material'>
              <Route path='Add-Material' element={<AddMaterial />} />
              <Route path='update/:id' element={<AddMaterial />} />
              <Route path='View-Material' element={<ViewMaterial />} />
            </Route>
            <Route path='Category'>
              <Route path='Add-Category' element={<AddCategory />} />
              <Route path='update/:id' element={<AddCategory />} />
              <Route path='View-Category' element={<ViewCategory />} />
            </Route>
            <Route path='SubCategory'>
              <Route path='Add-SubCategory' element={<AddSubCategory />} />
              <Route path='update/:id' element={<AddSubCategory />} />
              <Route path='View-SubCategory' element={<ViewSubCategory />} />
            </Route>
            <Route path='SubSubCategory'>
              <Route path='Add-Sub-Sub-Category' element={<AddSubSubCategory />} />
              <Route path='update/:id' element={<AddSubSubCategory />} />
              <Route path='View-Sub-Sub-Category' element={<ViewSubSubCategory />} />
            </Route>
            <Route path='Products'>
              <Route path='AddProducts' element={<AddProducts />} />
              <Route path='update/:id' element={<AddProducts />} />
              <Route path='ViewProducts' element={<ViewProducts />} />
            </Route>
            <Route path='WhyChooseUs'>
              <Route path='AddChoose-us' element={<AddChooseUs />} />
              <Route path='update/:id' element={<AddChooseUs />} />
              <Route path='ViewChoose-us' element={<ViewChooseUs />} />
            </Route>
            <Route path='Order' element={<ViewOrders />} />
            <Route path='Slider'>
              <Route path='Add-Slider' element={<AddSlider />} />
              <Route path='update/:id' element={<AddSlider />} />
              <Route path='View-Slider' element={<ViewSlider />} />
            </Route>
            <Route path='Country'>
              <Route path='Add-Country' element={<AddCountry />} />
              <Route path='update/:id' element={<AddCountry />} />
              <Route path='View-Country' element={<ViewCountry />} />
            </Route>
            <Route path='Testimonial'>
              <Route path='Add-Testimonial' element={<AddTestimonial />} />
              <Route path='update/:id' element={<AddTestimonial />} />
              <Route path='View-Testimonial' element={<ViewTestimonial />} />
            </Route>
            <Route path='Faq'>
              <Route path='Add-Faq' element={<AddFaq />} />
              <Route path='update/:id' element={<AddFaq />} />
              <Route path='View-Faq' element={<ViewFaq />} />
            </Route>
          </Route>

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </MainContext>

  </>,
)
