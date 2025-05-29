import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../components/navbar.tsx";
import React, { useEffect, useState } from "react";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";


const CATEGORY_OPTIONS = ["Teknis", "Entertain", "Marketplace", "General"];

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchFromAPI("/user/getCurrentUser", "GET");
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
    category: '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Judul wajib diisi'),
    content: Yup.string().required('Isi konten wajib diisi'),
    category: Yup.string().required('Kategori wajib diisi'),
  });

  const onSubmit = async (values: typeof initialValues) => {
    console.log("Submitting post with values:", values.category, "and file:", file?.name);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("category", values.category);
      formData.append("user_id", userId!);
      if (file) formData.append("image", file);

      await axios.post("http://localhost:3000/post/CreatePost", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      alert("Post Created");
      navigate("/home");
    } catch (err) {
      console.error("Error creating post:", err);
    }
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
          {({ setFieldValue, values }) => (
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

              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <div className="flex gap-2">
                  {CATEGORY_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`px-4 py-2 rounded ${
                        values.category === option
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-200"
                      } border border-gray-600 focus:outline-none`}
                      onClick={() => setFieldValue("category", option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">Gambar</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full text-white"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
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
          )}
        </Formik>
      </div>
    </div>
  );
}
export default CreatePost;