import type { MaybeRef } from '@vueuse/core';
import type { FormInstance } from 'element-plus';

export const restoreForm = (
  form: Record<string, any>,
  formRef?: MaybeRef<FormInstance | undefined>
) => {
  Object.keys(form).forEach(key => form[key] = void 0);
  if(!formRef) return;
  const value = unref(formRef);
  if(!value) return;
  const formProps = Object.keys(form);
  value.resetFields(formProps);
};

export const filterFormNull = (form: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(form).filter(([_key, value]) => {
      return Array.isArray(value)
        ? value.length
        : !!value
    })
  );

export const setFormValue = (
  target: Record<string, any>,
  source: MaybeRef<Record<string, any>>
) => {
  const data = unref(source);
  Object.keys(target)
    .forEach(key => target[key] = data[key]);
};
  