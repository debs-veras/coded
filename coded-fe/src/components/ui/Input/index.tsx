import { forwardRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import { BiHide, BiShow } from 'react-icons/bi';
import Select from 'react-select';
import { ZodError } from 'zod';
import { formatCep, removeMask } from '../../../utils/formatar';
import type { typeSelectOptions } from '../../../types/select';
import { ufOptions } from '../../../utils/constants';

type InputProps = {
  control?: any;
  register?: any;
  name: string;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  errors?: FieldErrors<any> | ZodError | null;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
};

const inputBaseClass =
  'w-full rounded-lg border border-neutral-200 dark:border-neutral-700 outline-none bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-(--color-secondary) dark:focus:border-(--color-secondary) focus:ring-2 focus:ring-(--color-secondary)/20 dark:focus:ring-(--color-secondary)/40 focus:shadow-[0_0_0_3px_rgba(255,122,0,0.15)] dark:focus:shadow-[0_0_0_3px_rgba(255,122,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed transition-all durati  on-200';

function getInputSizeClass(size: InputProps['size'] = 'md') {
  if (size === 'sm') return 'py-2 text-sm';
  if (size === 'lg') return 'py-4 text-lg';
  return 'py-3 text-base';
}

function getInputClass({
  icon,
  size,
  hasTrailingAction,
}: {
  icon?: React.ReactNode;
  size?: InputProps['size'];
  hasTrailingAction?: boolean;
}) {
  return [
    inputBaseClass,
    icon ? 'pl-10' : 'pl-4',
    hasTrailingAction ? 'pr-10' : 'pr-4',
    getInputSizeClass(size),
  ].join(' ');
}

function getInputErrorMessage(
  errors: unknown,
  name: string
): string | undefined {
  if (!errors) return undefined;

  if (errors instanceof ZodError) {
    const zodIssue = errors.issues.find(
      (issue) => issue.path.join('.') === name
    );
    return zodIssue?.message;
  }

  if (typeof errors === 'object') {
    const parts = name.split('.');
    let current: any = errors;
    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }

    if (current && typeof current === 'object' && 'message' in current) {
      const message = current.message;
      return typeof message === 'string' ? message : undefined;
    }
  }

  return undefined;
}

function InputWrapper({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-2 mt-1 text-xs text-red-500">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          {error}
        </div>
      )}
    </div>
  );
}

// ==================== InputText ====================
export const InputText = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      register,
      name,
      label,
      icon,
      errors,
      placeholder,
      required = true,
      disabled,
      type = 'text',
      step,
      size,
      ...rest
    } = props;

    const error = getInputErrorMessage(errors, name);
    const registerProps = register ? register(name) : undefined;

    return (
      <InputWrapper label={label} required={required} error={error}>
        <div className="relative group w-full">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            {...registerProps}
            {...rest}
            ref={(e) => {
              if (registerProps && typeof registerProps.ref === 'function') {
                registerProps.ref(e);
              }
              if (typeof ref === 'function') ref(e);
              else if (ref) (ref as any).current = e;
            }}
            type={type}
            step={step}
            placeholder={placeholder}
            disabled={disabled}
            className={getInputClass({ icon, size })}
          />
        </div>
      </InputWrapper>
    );
  }
);

InputText.displayName = 'InputText';

// ==================== InputCpf ====================
export const InputCpf = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      control,
      name,
      label,
      icon,
      errors,
      placeholder,
      required = true,
      disabled,
    } = props;

    const error = getInputErrorMessage(errors, name);

    const formatCPF = (value: string = '') => {
      const numbers = removeMask(value);
      if (!numbers) return '';
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6)
        return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9)
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    };

    return (
      <InputWrapper label={label} required={required} error={error}>
        <div className="relative group w-full">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <Controller
            name={name}
            control={control!}
            render={({ field }) => (
              <input
                {...field}
                ref={(e) => {
                  field.ref(e);
                  if (typeof ref === 'function') ref(e);
                  else if (ref) (ref as any).current = e;
                }}
                value={formatCPF(field.value || '')}
                onChange={(e) => field.onChange(formatCPF(e.target.value))}
                placeholder={placeholder}
                disabled={disabled}
                type="text"
                className={getInputClass({ icon, size: 'md' })}
              />
            )}
          />
        </div>
      </InputWrapper>
    );
  }
);

InputCpf.displayName = 'InputCpf';

// ==================== InputPhone ====================
export const InputPhone = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      control,
      name,
      label,
      icon,
      errors,
      placeholder,
      required = true,
      disabled,
    } = props;
    const error = getInputErrorMessage(errors, name);

    const formatPhone = (value: string = '') => {
      const numbers = removeMask(value);
      if (!numbers) return '';
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 6)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      if (numbers.length <= 10)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    return (
      <InputWrapper label={label} required={required} error={error}>
        <div className="relative group w-full">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <Controller
            name={name}
            control={control!}
            render={({ field }) => (
              <input
                {...field}
                ref={(e) => {
                  field.ref(e);
                  if (typeof ref === 'function') ref(e);
                  else if (ref) (ref as any).current = e;
                }}
                value={formatPhone(field.value || '')}
                onChange={(e) => field.onChange(formatPhone(e.target.value))}
                placeholder={placeholder}
                disabled={disabled}
                type="text"
                className={getInputClass({ icon, size: 'md' })}
              />
            )}
          />
        </div>
      </InputWrapper>
    );
  }
);

InputPhone.displayName = 'InputPhone';

// ==================== InputCep ====================
export const InputCep = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      control,
      name,
      label,
      icon,
      errors,
      placeholder = '00000-000',
      required = true,
      disabled,
    } = props;
    const error = getInputErrorMessage(errors, name);

    return (
      <InputWrapper label={label} required={required} error={error}>
        <div className="relative group w-full">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <Controller
            name={name}
            control={control!}
            render={({ field }) => (
              <input
                {...field}
                ref={(e) => {
                  field.ref(e);
                  if (typeof ref === 'function') ref(e);
                  else if (ref) (ref as any).current = e;
                }}
                maxLength={9}
                value={formatCep(field.value || '')}
                onChange={(e) => field.onChange(formatCep(e.target.value))}
                placeholder={placeholder}
                disabled={disabled}
                type="text"
                className={getInputClass({ icon, size: 'md' })}
              />
            )}
          />
        </div>
      </InputWrapper>
    );
  }
);

InputCep.displayName = 'InputCep';

// ==================== InputUf ====================
export function InputUf(props: Omit<InputSelectProps, 'options'>) {
  return (
    <InputSelect
      {...props}
      options={ufOptions}
      defaultOptionLabel="UF"
      noNullOption
    />
  );
}

// ==================== InputPassword ====================
export const InputPassword = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      register,
      name,
      label,
      icon,
      errors,
      placeholder,
      disabled,
      required = true,
    } = props;
    const [showPassword, setShowPassword] = useState(false);
    const error = getInputErrorMessage(errors, name);
    const registerProps = register ? register(name) : undefined;

    const toggleVisibility = () => setShowPassword((prev) => !prev);

    return (
      <InputWrapper label={label} required={required} error={error}>
        <div className="relative group w-full">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            {...registerProps}
            ref={(e) => {
              if (registerProps && typeof registerProps.ref === 'function') {
                registerProps.ref(e);
              }
              if (typeof ref === 'function') ref(e);
              else if (ref) (ref as any).current = e;
            }}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            disabled={disabled}
            className={getInputClass({
              icon,
              size: 'md',
              hasTrailingAction: true,
            })}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            {showPassword ? (
              <BiHide className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <BiShow className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </InputWrapper>
    );
  }
);

InputPassword.displayName = 'InputPassword';

// ==================== InputSelect ====================
type InputSelectProps = {
  control: any;
  name: string;
  label: string;
  errors?: any;
  required?: boolean;
  disabled?: boolean;
  options?: typeSelectOptions[];
  placeholder?: string;
  isLoading?: boolean;
  isFilter?: boolean;
  defaultOptionLabel?: string;
  noNullOption?: boolean;
  onInputChange?: (value: string) => void;
  defaultValue?: string | string[] | null;
  icon?: React.ReactNode;
  isMulti?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export function InputSelect(props: InputSelectProps) {
  const {
    control,
    name,
    label,
    errors,
    required = true,
    disabled,
    options = [],
    placeholder = 'Selecione...',
    isLoading = false,
    defaultOptionLabel,
    noNullOption,
    isFilter,
    onInputChange,
    defaultValue,
    icon,
    isMulti = false,
    size = 'md',
  } = props;

  const error = getInputErrorMessage(errors, name);

  const getSelectOptions = (): typeSelectOptions[] => {
    const baseOption = [{ value: '', label: defaultOptionLabel || '' }];
    if (!options) return baseOption;
    if (!defaultOptionLabel || noNullOption) return options;
    return baseOption.concat(options);
  };

  return (
    <InputWrapper label={label} required={required} error={error}>
      <div className="relative group w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            {icon}
          </div>
        )}

        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue ?? (isMulti ? [] : '')}
          render={({ field }) => {
            const availableOptions = getSelectOptions();

            let selectedOption;
            if (isMulti) {
              selectedOption = availableOptions.filter((opt) =>
                Array.isArray(field.value)
                  ? field.value.includes(opt.value)
                  : false
              );
            } else {
              selectedOption =
                availableOptions.find((opt) => opt.value === field.value) ??
                null;
            }

            return (
              <Select
                className="w-full"
                name={name}
                id={isFilter ? `filter_${name}` : name}
                options={availableOptions}
                placeholder={placeholder}
                isDisabled={disabled}
                isLoading={isLoading}
                isClearable={!isMulti}
                isMulti={isMulti} 
                noOptionsMessage={() => 'Sem opções'}
                value={selectedOption}
                onInputChange={(search) =>
                  onInputChange && onInputChange(search)
                }
                onChange={(option) => {
                  if (Array.isArray(option)) {
                    const values = option.map((o: any) => o.value);
                    field.onChange(values);
                  } else {
                    const selected = option as any;
                    field.onChange(selected?.value ?? '');
                  }
                }}
                menuPlacement="auto"
                unstyled
                classNames={{
                  control: ({ isFocused, isDisabled }) =>
                    [
                      'w-full rounded-lg border outline-none transition-all duration-200',
                      'bg-white dark:bg-neutral-900',
                      'text-neutral-900 dark:text-neutral-100',
                      'border-neutral-200 dark:border-neutral-700',
                      size === 'sm'
                        ? 'min-h-[38px]'
                        : size === 'lg'
                          ? 'min-h-[62px]'
                          : 'min-h-[50px]',
                      'shadow-sm',
                      isDisabled && 'opacity-60 cursor-not-allowed',
                      isFocused &&
                        'border-(--color-secondary) dark:border-(--color-secondary) ring-2 ring-(--color-secondary)/20 dark:ring-(--color-secondary)/40',
                    ]
                      .filter(Boolean)
                      .join(' '),
                  valueContainer: () =>
                    [
                      icon ? 'pl-10' : 'pl-4',
                      'pr-4',
                      size === 'sm' ? 'py-2' : size === 'lg' ? 'py-4' : 'py-3',
                      size === 'sm'
                        ? 'text-sm'
                        : size === 'lg'
                          ? 'text-lg'
                          : 'text-base',
                    ].join(' '),
                  input: () =>
                    [
                      'text-neutral-900 dark:text-neutral-100',
                      size === 'sm'
                        ? 'text-sm'
                        : size === 'lg'
                          ? 'text-lg'
                          : 'text-base',
                    ].join(' '),
                  singleValue: () =>
                    [
                      'text-neutral-900 dark:text-neutral-100',
                      size === 'sm'
                        ? 'text-sm'
                        : size === 'lg'
                          ? 'text-lg'
                          : 'text-base',
                    ].join(' '),
                  placeholder: () =>
                    [
                      'text-neutral-400 dark:text-neutral-500',
                      size === 'sm'
                        ? 'text-sm'
                        : size === 'lg'
                          ? 'text-lg'
                          : 'text-base',
                    ].join(' '),
                  indicatorsContainer: () =>
                    [
                      'text-neutral-400 dark:text-neutral-500',
                      size === 'sm' ? 'px-2' : size === 'lg' ? 'px-4' : 'px-3',
                    ].join(' '),
                  dropdownIndicator: () =>
                    'hover:text-neutral-600 dark:hover:text-neutral-300',
                  clearIndicator: () => 'hover:text-red-500',
                  menu: () =>
                    [
                      'rounded-xl border shadow-lg overflow-hidden',
                      'bg-white dark:bg-neutral-900',
                      'border-neutral-200 dark:border-neutral-700',
                      'animate-in fade-in zoom-in-95 duration-100',
                    ].join(' '),
                  option: ({ isFocused, isSelected }) =>
                    [
                      'px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
                      'text-neutral-900 dark:text-neutral-100',
                      !isSelected &&
                        isFocused &&
                        'bg-neutral-100 dark:bg-neutral-800',
                      !isSelected && !isFocused && 'bg-transparent',
                    ]
                      .filter(Boolean)
                      .join(' '),
                }}
              />
            );
          }}
        />
      </div>
    </InputWrapper>
  );
}
