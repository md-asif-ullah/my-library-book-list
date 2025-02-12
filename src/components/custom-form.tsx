"use client";

import {
  FormControl,
  FormField as RHFFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Control } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export enum FormFieldTypes {
  Input = "input",
  TextArea = "textarea",
  PHONEINPUT = "phoneInput",
  PAYMENTMETHOD = "paymentMethod",
  SWITCH = "switch",
  SWITCH2 = "switch2",
  select = "select",
  RATING = "rating",
}

interface FormProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  FieldType: FormFieldTypes;
  type?: string;
  title?: string;
  value?: string[];
  showInfo?: boolean;
}

type FormFieldProps = {
  props: FormProps;
  field: any;
  id: string;
};

function FormField({ props, field, id }: FormFieldProps) {
  const [hover, setHover] = useState<number | null>(null);
  const { placeholder, FieldType, type, title, value } = props;

  switch (FieldType) {
    case FormFieldTypes.Input:
      return (
        <FormControl>
          <Input
            type={type}
            value={field.value}
            disabled={props.showInfo}
            className="text-black focus-visible:ring-0 focus-visible:border-primary2"
            id={id}
            placeholder={placeholder}
            {...field}
          />
        </FormControl>
      );

    case FormFieldTypes.SWITCH:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, index) => (
                <SelectItem
                  key={index}
                  value={String(index + 1)}
                  className="uppercase"
                >
                  {String(index + 1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldTypes.SWITCH2:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={title} />
            </SelectTrigger>
            <SelectContent>
              {value?.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldTypes.select:
      return (
        <>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              disabled={props.showInfo}
              className="flex space-x-5 mt-2"
            >
              {value?.map((item) => (
                <FormItem
                  key={item}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={item} />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {item}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </>
      );

    case FormFieldTypes.RATING:
      return (
        <div className="flex space-x-1 my-4">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;

            return (
              <label key={index} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => field.onChange(ratingValue)}
                  className="hidden"
                />
                <FaStar
                  size={20}
                  className="transition-colors duration-200"
                  color={
                    ratingValue <= (hover || field.value)
                      ? "#ffc107"
                      : "#e4e5e9"
                  }
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>
      );

    default:
      return null;
  }
}

function CustomForm(props: FormProps) {
  const { control, name, label } = props;
  const id = `field-${name}`;

  return (
    <RHFFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="text-black" htmlFor={id}>
              {label}
            </FormLabel>
          )}

          <FormField props={props} field={field} id={id} />

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomForm;
