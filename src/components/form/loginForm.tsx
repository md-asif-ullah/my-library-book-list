"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import CustomForm, { FormFieldTypes } from "@/components/custom-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authSchema } from "@/lib/validate";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "mdasifullah334@gmail.com",
      password: "12345678",
    },
  });

  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "invalid email or password",
        });
      } else {
        router.push("/book");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-10">
        <CustomForm
          FieldType={FormFieldTypes.Input}
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
        <CustomForm
          FieldType={FormFieldTypes.Input}
          control={form.control}
          name="password"
          label="Password"
          type={`${showPassword ? "text" : "password"}`}
          placeholder="Enter your Password"
        />

        <div className="flex items-center justify-between">
          <label
            onClick={() => setShowPassword((prev) => !prev)}
            className="flex items-center text-sm text-gray-600"
          >
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2">Show Password</span>
          </label>
          <button className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-3 text-white border border-black bg-black rounded-lg"
        >
          Sign in
        </button>
      </form>
    </Form>
  );
};

export default LoginForm;
