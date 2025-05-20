
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../components/navbar.tsx";
import React, { useEffect, useState } from "react";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";


const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchFromAPI("/user/getUserById", "GET");
        setUserId(data.user.user_id);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!userId) {
    // Sementara tunggu data userId muncul, kalo ga muncul yaaa LOADING BOS
    return <div>Loading user data...</div>;
  }

  const initialValues = {
    title: '',
    content: '',
    user_id: userId,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Judul wajib diisi'),
    content: Yup.string().required('Isi konten wajib diisi')
  });

  const onSubmit = (data: typeof initialValues) => {
    axios.post("http://localhost:3000/post/CreatePost", data)
      .then(() => {
        alert("Post Created");
        navigate("/home");
      })
      .catch(err => {
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
          enableReinitialize={true} 
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="space-y-6">
            {/* Form fields */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Judul</label>
              <Field
                id="title"
                name="title"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">Konten</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={5}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
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