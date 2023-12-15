import { useEffect, useMemo, useState } from 'react';

export const useForm = <T extends { [key: string]: number | string }>(
  initialForm: T,
  formValidations: { [key: string]: [(data: string | number) => boolean, string] } = {}
) => {
  const [formState, setFormState] = useState<T>(initialForm);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formValidation, setFormValidation] = useState<{ [key: string]: string | number | null }>(
    {}
  );

  const createValidators = () => {
    const formCheckedValues: { [key: string]: string | number | null } = {};
    if (formState && typeof formState === 'object' && isSubmit) {
      for (const formField of Object.keys(formValidations)) {
        const [fn, errorMessage = 'Este campo es requerido.'] = formValidations[formField];
        formCheckedValues[`${formField}Valid`] =
          formField in formState && fn(formState[formField]) ? null : errorMessage;
      }
    }
    setFormValidation(formCheckedValues);
  };

  useEffect(() => {
    createValidators();
  }, [formState]);

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }
    return true;
  }, [formValidation]);

  const onInputChange = ({
    target,
  }:
    | React.ChangeEvent<HTMLInputElement>
    | {
        target:
          | (EventTarget & HTMLInputElement)
          | (EventTarget & {
              value: string;
              name: string;
            });
      }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
    setIsSubmit(true);
  };

  const onResetForm = () => {
    setIsSubmit(false);
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    ...formValidation,
    isFormValid,
    isSubmit,
  };
};
