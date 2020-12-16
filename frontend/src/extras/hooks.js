import { useEffect, useState } from "react";

export const useServerErrors = () => {
  const [serverErrors, setServerErrors] = useState(null);
  const [fieldError, setFieldError] = useState({});

  useEffect(() => {
    let errors = {};
    for (const err in serverErrors) {
      errors[err] = serverErrors[err][0];
    }

    setFieldError(errors);
  }, [serverErrors]);

  const isError = (field) => {
    return fieldError[field] ? true : false;
  };

  const nonFieldError = () =>
    fieldError["non_field_errors"] ? fieldError["non_field_errors"] : "";

  return [isError, nonFieldError, fieldError, setServerErrors];
};
