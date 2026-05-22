const formatZodErrors = (zodError) => {
  const formattedErrors = {};

  if (zodError.issues && Array.isArray(zodError.issues)) {
    zodError.issues.forEach((error) => {
      const field = error.path.length > 0 ? error.path.join(".") : "general";

      if (!formattedErrors[field]) {
        formattedErrors[field] = error.message;
      }
    });
  }

  return formattedErrors;
};

export default formatZodErrors;
