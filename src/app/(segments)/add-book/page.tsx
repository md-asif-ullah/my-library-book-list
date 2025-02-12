"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import CustomForm, { FormFieldTypes } from "@/components/custom-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import ProssingAnimation from "@/components/prossing-animation";
import axios from "axios";
import { formSchema } from "@/lib/validate";
import { categoryText } from "@/lib/utils";

function AddBook() {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      writer: "",
      rating: "",
      image: undefined,
    },
  });

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  // Get image from user
  const pic = watch("image");
  useEffect(() => {
    if (pic && pic.length > 0) {
      setImage(URL.createObjectURL(pic[0]));
    }
  }, [pic]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, price, image, rating, writer, category } = values;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price.toString());
    formData.append("rating", rating);
    formData.append("writer", writer);
    formData.append("image", image[0]);

    try {
      setLoading(true);

      const res = await axios.post("/api/book", formData);

      if (res.data.payload.length > 0) {
        toast({
          title: "Book Added",
          description: "Book has been added successfully",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] h-full w-full bg-white py-20 xl:px-0 md:px-10 lg:px-20">
      <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl ml-4 md:ml-10 lg:ml-20">
        Add Book
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid xl:grid-cols-3 mt-10 md:mt-20 "
        >
          {/* Image Upload */}
          <section className="mx-auto col-span-1">
            <div>
              <div className="border border-[#1e293b] p-3 w-[315px] h-[315px] rounded-lg">
                <label htmlFor="input-image" className="block">
                  <div className="sm:w-72 h-72 border-2 border-[#f8ab2a] border-dotted rounded-xl flex items-center justify-center">
                    {image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt="Preview"
                          height={300}
                          width={300}
                          className="w-full h-full pb-10 object-cover rounded-xl"
                        />
                        <i
                          className="absolute bottom-3 left-1/2 cursor-pointer"
                          onClick={() => setImage("")}
                        >
                          <ImCross className="text-white" />
                        </i>
                      </div>
                    ) : (
                      <p className="text-[#f8ab2a]">Upload Image</p>
                    )}
                  </div>
                  <input
                    className="hidden"
                    type="file"
                    id="input-image"
                    accept="image/*"
                    {...register("image", { required: true })}
                  />
                </label>
              </div>
              <p className="dark:text-white text-center mt-2">
                (PNG/JPG/JPEG, Max. 3MB)
              </p>
            </div>
            {errors.image && (
              <span className="text-sm text-[#f45f55]">
                This field is required
              </span>
            )}
          </section>

          {/* Product Details */}
          <div className="xl:col-span-2 mt-14 xl:mt-0 xl:mr-20 px-4 md:px-0">
            <div className="mb-5">
              <CustomForm
                FieldType={FormFieldTypes.Input}
                control={form.control}
                name="name"
                label="Book Name"
                type="text"
                placeholder="Enter Book name"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="mb-5">
                <CustomForm
                  FieldType={FormFieldTypes.Input}
                  control={form.control}
                  name="writer"
                  label="Writer"
                  type="text"
                  placeholder="Enter writer's name"
                />
              </div>
              <div className=" mb-5">
                <CustomForm
                  FieldType={FormFieldTypes.SWITCH2}
                  control={form.control}
                  label="Category"
                  name="category"
                  title="select category"
                  value={categoryText}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <CustomForm
                  FieldType={FormFieldTypes.Input}
                  control={form.control}
                  name="price"
                  label="Price"
                  type="number"
                  placeholder="Enter book price"
                />
              </div>
              <div className="relative z-0 w-full mb-5">
                <CustomForm
                  FieldType={FormFieldTypes.SWITCH}
                  control={form.control}
                  label="Rating"
                  name="rating"
                  title="select Rating"
                  value={categoryText}
                />
              </div>
            </div>

            <Button className="w-full text-white font-semibold bg-[#f8ab2a] hover:bg-[#d8931b] mt-10 h-10 duration-500">
              {loading ? <ProssingAnimation /> : " Add Item"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddBook;
