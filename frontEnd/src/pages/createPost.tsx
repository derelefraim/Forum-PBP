import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  

  const initialValues = {
    title: '',
    content: '',
    user_id: '',
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
      navigate("/");
    }).catch(err => {
      console.error(err);
    });
  };
  

  


  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className='formContainer'>
          <div>
            <label>Judul:</label>
            <Field id="inputCreatePost" name="title"  />
            <ErrorMessage name="title" component="errspan" className="error" />
          </div>

          <div>
            <label>Konten:</label>
            <Field as="textarea" id="inputCreatePost" name="content" />
            <ErrorMessage name="content" component="errspan" className="error" />
          </div>

          <div>
            <label>userid:</label>
            <Field id="inputCreatePost" name="user_id" />
            <ErrorMessage name="user_id" component="errspan" className="error" />
          </div>

          <button type="submit" className="btn btn-primary">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreatePost;
