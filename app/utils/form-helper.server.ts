type FormDataJSON = {
  [key: string]: any;
};

export const formToJSON = (formData: FormData): FormDataJSON => {
  return Object.fromEntries(formData);
};
