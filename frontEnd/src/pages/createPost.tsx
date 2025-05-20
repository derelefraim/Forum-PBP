import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../components/navbar.tsx";
const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  

  const initialValues = {
    title: '',
    content: '',
    user_id: '', //ini nanti pake yang session
    // user_id: localStorage.getItem("user_id") || '', // ini buat nanti kalau udah ada sistem login
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Judul wajib diisi'),
    content: Yup.string().required('Isi konten wajib diisi'),
    user_id: Yup.string().required('ini hrsnya auto generate berdasarkan id session(?), tpi sistem login kan blm ada ya'),
  });

  const onSubmit = (data: typeof initialValues) => {
    // const userId = localStorage.getItem("user_id"); ini buat nanti kalau udah ada sistem login
    // const postData = { ...data, user_id: userId };

    const postData = { ...data }; 
    console.log("postData", postData);
    axios.post("http://localhost:3000/post/CreatePost", postData).then(() => {
      alert("Post Created");
      navigate("/home");
    }).catch(err => {
      console.error(err);
    });
  };
  

  

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <Navbar />
  
      <div className="max-w-xl mx-auto p-8 bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Buat Post Baru</h2>
  
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Judul
              </label>
              <Field
                id="title"
                name="title"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="content">
                Konten
              </label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows="5"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="user_id">
                User ID
              </label>
              <Field
                id="user_id"
                name="user_id"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="user_id"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
  
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
              >
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default CreatePost;
