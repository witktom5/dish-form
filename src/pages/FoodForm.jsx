import { useState } from 'react';
import { Form, Field } from 'react-final-form';

const FoodForm = () => {
  const [serverError, setServerError] = useState({});
  //  There is client side HTML validation but this form also supports validation responses from API
  const [clientSideValidation, setClientSideValidation] = useState(false);

  //  On form submission

  const onSubmit = async (values) => {
    //  Clear previous error if present
    setServerError({});

    //  Parse correct data types

    if (values.no_of_slices) {
      values.no_of_slices = parseInt(values.no_of_slices);
    }
    if (values.diameter) {
      values.diameter = parseFloat(values.diameter);
    }

    if (values.spiciness_scale) {
      values.spiciness_scale = parseInt(values.spiciness_scale);
    }
    if (values.slices_of_bread) {
      values.slices_of_bread = parseInt(values.slices_of_bread);
    }

    // POST request with form data

    try {
      const API_URL = 'https://frosty-wood-6558.getsandbox.com:443/dishes';
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };
      const res = await fetch(API_URL, options);
      const data = await res.json();

      //  For validation through server response (this API seems to only return one validation error at a time)

      if (res.status === 400) {
        setServerError(data);
      } else {
        alert(`Success! Here's your dish: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ type: 'pizza' }}
      render={({ handleSubmit, values }) => {
        //  Clear values from form data of conditional fields if these are hidden

        if (values.type !== 'pizza') {
          delete values.no_of_slices;
          delete values.diameter;
        }
        if (values.type !== 'soup') {
          delete values.spiciness_scale;
        } else {
          if (!values.spiciness_scale) values.spiciness_scale = '5'; // default value
        }
        if (values.type !== 'sandwich') {
          delete values.slices_of_bread;
        }

        return (
          <form
            className='col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3'
            noValidate={clientSideValidation ? false : true}
            onSubmit={handleSubmit}
          >
            <h2 className='mt-5 mb-4 text-center'>Select your dish</h2>
            <div className='mb-3'>
              <label htmlFor='name' className='form-label'>
                Name
              </label>
              <Field
                className='form-control'
                name='name'
                id='name'
                component='input'
                type='text'
                placeholder='Please enter dish name'
                required
              />
              {serverError.name && (
                <p className='error-feedback'>{serverError.name}</p>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='preparation_time' className='form-label'>
                Preparation time
              </label>
              <Field
                className='form-control'
                name='preparation_time'
                id='preparation_time'
                component='input'
                type='text'
                placeholder='Format: hh:mm:ss'
                pattern='[0-9]{2}:[0-9]{2}:[0-9]{2}'
                title='hh:mm:ss'
                required
              />
              {serverError.preparation_time && (
                <p className='error-feedback'>{serverError.preparation_time}</p>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='type' className='form-label'>
                Type
              </label>
              <Field
                className='form-control'
                name='type'
                id='type'
                component='select'
                required
              >
                <option value='pizza'>Pizza</option>
                <option value='soup'>Soup</option>
                <option value='sandwich'>Sandwich</option>
              </Field>
            </div>

            {values.type === 'pizza' && (
              <>
                <div className='mb-3'>
                  <label htmlFor='no_of_slices' className='form-label'>
                    Slices of pizza
                  </label>
                  <Field
                    className='form-control'
                    name='no_of_slices'
                    id='no_of_slices'
                    type='number'
                    min='0'
                    placeholder='Please enter a number'
                    component='input'
                    required
                  />
                  {serverError.no_of_slices && (
                    <p className='error-feedback'>{serverError.no_of_slices}</p>
                  )}
                </div>
                <div className='mb-3'>
                  <label htmlFor='diameter' className='form-label'>
                    Diameter
                  </label>
                  <Field
                    className='form-control'
                    name='diameter'
                    id='diameter'
                    placeholder='Please enter the diameter'
                    type='number'
                    step='0.1'
                    min='0'
                    component='input'
                    required
                  />
                  {serverError.diameter && (
                    <p className='error-feedback'>{serverError.diameter}</p>
                  )}
                </div>
              </>
            )}

            {values.type === 'soup' && (
              <div className='mb-3'>
                <label htmlFor='spiciness_scale' className='form-label'>
                  Spiciness
                </label>

                <Field
                  className='form-control'
                  name='spiciness_scale'
                  id='spiciness_scale'
                  type='range'
                  min='1'
                  max='10'
                  component='input'
                  required
                />
                <p className='form-text mt-1'>
                  Selected spiciness level: {values.spiciness_scale}
                </p>
                {serverError.spiciness_scale && (
                  <p className='error-feedback'>
                    {serverError.spiciness_scale}
                  </p>
                )}
              </div>
            )}

            {values.type === 'sandwich' && (
              <div className='mb-3'>
                <label htmlFor='slices_of_bread' className='form-label'>
                  Slices of bread
                </label>
                <Field
                  className='form-control'
                  name='slices_of_bread'
                  id='slices_of_bread'
                  min='0'
                  type='number'
                  component='input'
                  placeholder='Please enter a number'
                  required
                />
                {serverError.slices_of_bread && (
                  <p className='error-feedback'>
                    {serverError.slices_of_bread}
                  </p>
                )}
              </div>
            )}

            <button type='submit' className='btn btn-primary col-12'>
              Submit
            </button>
            <div className='mt-3 d-flex'>
              <label htmlFor='clientSideValidationCheckbox'>
                Client-side validation:
              </label>
              <div className='ms-3'>
                <input
                  type='checkbox'
                  id='clientSideValidationCheckbox'
                  className='form-check-input'
                  onChange={() =>
                    setClientSideValidation(!clientSideValidation)
                  }
                />
                <span>{clientSideValidation ? ' Enabled' : ' Disabled'}</span>
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};

export default FoodForm;
