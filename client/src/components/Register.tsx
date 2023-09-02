import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { HttpClientContext, iHttpClient } from '../provider/HttpClientProvider';

type RegisterUserInfo = {
  firstName: string;
  lastName: string;
  email: string;
};

type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function Register() {
  const [userInfo, setUsetInfo] = useState<RegisterUserInfo>({
    firstName: '',
    lastName: '',
    email: '',
  });
 const [renderForm, setRenderForm] = useState<boolean>(false)
const httpClient = useContext<iHttpClient>(HttpClientContext)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userInfoFromParams: RegisterUserInfo = {
      firstName: queryParams.get('firstName') ?? '',
      lastName: queryParams.get('lastName') ?? '',
      email: queryParams.get('email') ?? '',
    };
    setUsetInfo(userInfoFromParams);
    setRenderForm(true)
  }, []);
  
  if(!renderForm) return <></>

  return (
    <Formik
      initialValues={userInfo}
      validate={(values) => {
        const errors: Errors = {};
        if (!values.email) {
          errors.email = 'Pakollinen kenttä';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Sähköposti on väärin muotoiltu';
        }
        if (!values.firstName) {
          errors.firstName = 'Pakollinen kenttä';
        }
        if (!values.lastName) {
          errors.firstName = 'Pakollinen kenttä';
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const response = await httpClient.postData<RegisterUserInfo, object>("/register", values)
        if(!response.isError){
          //handle success
        } else {
          throw new Error("Register was unsuccessful")
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <label>Etunimi:</label>
          <input
            type="text"
            name="firstName"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.firstName}
          />
          {errors.firstName && touched.firstName && errors.firstName}
          <label>Sukunimi:</label>
          <input
            type="text"
            name="lastName"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.lastName}
          />
          {errors.lastName && touched.lastName && errors.lastName}
          <label>Sähköposti:</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          {errors.email && touched.email && errors.email}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
}
