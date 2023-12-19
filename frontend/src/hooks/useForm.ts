import { useEffect, useMemo, useState } from 'react';

export const useForm = <T extends { [key: string]: number | string | string[] | undefined | null }>(
  initialForm: T,
  formValidations: {
    [key: string]: [(data: string | number | string[] | undefined | null) => boolean, string];
  } = {}
) => {
  const [formState, setFormState] = useState<T>(initialForm);
  const [isModified, setIsModified] = useState(false);
  const [formValidation, setFormValidation] = useState<{ [key: string]: string | number | null }>(
    {}
  );

  const createValidators = () => {
    const formCheckedValues: { [key: string]: string | number | null } = {};
    if (formState && typeof formState === 'object' && isModified) {
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
    setIsModified(false);
    setFormState(initialForm);
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }
    return true;
  }, [formValidation]);

  const isModificated = (name: string, value: string | string[]) => {
    if (initialForm[name] !== value) {
      return true;
    }
    for (const key in formState) {
      if (formState[key] !== initialForm[key] && key !== name) {
        return true;
      }
    }
    return false;
  };

  const onInputChange = ({
    target,
  }:
    | React.ChangeEvent<HTMLInputElement>
    | {
        target:
          | (EventTarget & HTMLInputElement)
          | (EventTarget & {
              value: string | string[];
              name: string;
            })
          | {
              value: string | string[];
              name: string;
            };
      }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });

    setIsModified(isModificated(name, value));
  };

  const onResetForm = (formData?: T) => {
    setIsModified(false);
    setFormState(formData ?? initialForm);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    ...formValidation,
    isFormValid,
    isModified,
    setIsModified,
  };
};
