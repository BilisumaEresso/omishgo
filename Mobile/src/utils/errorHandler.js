export const mergeErrors = (frontendErrors, backendErrors) => {
  if (!backendErrors) return frontendErrors;

  return {
    ...frontendErrors,
    ...backendErrors,
  };
};

export const getFieldError = (fieldName, errors) => {
  return errors && errors[fieldName] ? errors[fieldName] : null;
};

export const hasErrors = (errors) => {
  if (!errors) return false;
  return Object.values(errors).some((error) => error);
};
