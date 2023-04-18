import { Input } from "@/components/ui/input";
import type { NextPage } from "next";
import Head from "next/head";
import { useFieldArray, useForm } from "react-hook-form";
import PlusCircleSolid from "@/public/icons/plus-circle-solid.svg";
import { cn } from "@/lib/cn";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import { Transition } from "@headlessui/react";
import Cross from "@/public/icons/close-outline.svg";
import { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { event } from "@/lib/ga";

const schema = z.object({
  ingredients: z.array(z.object({ value: z.string().min(3) })),
});

const ingredientPlaceholders: string[] = [
  "3 củ cà rốt",
  "hai quả trứng",
  "3ml sữa",
  "bột mì",
  "kim chi",
  "mì gói",
  "2 lạng thịt heo",
  "sốt cà chua",
  "5 lạng thịt bò",
  "nửa con gà",
];

type FormState = {
  ingredients: { value: string }[];
};

const Home: NextPage = () => {
  const [tokenSaved] = useLocalStorage("token_saved", false);

  const [text, setText] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<FormState>({
    resolver: zodResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const recipeMutation = useMutation({
    mutationFn: (items: string[]) =>
      fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }),
    onSuccess: async (data) => {
      if (data.ok) {
        const body = data.body;
        const reader = body?.getReader();
        const decoder = new TextDecoder();
        let done = false;

        if (reader) {
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);

            setText((prev) => prev + chunkValue);
          }
        }
      }
    },
  });

  const generateRecipe = (data: FormState) => {
    event({
      action: "submit_form",
      category: "user_interaction",
      label: "Submit form",
    });
    setText("");
    recipeMutation.mutate(
      data.ingredients.map((ingredient) => ingredient.value)
    );
  };

  return (
    <div>
      <Head>
        <title>Hôm nay ăn gì?</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content="Hôm nay anh muốn ăn gì?🧑‍🍳" />
        <meta
          name="og:description"
          content="Giúp vợ nấu ăn"
        />
        <meta
          name="og:image"
          content={`${
            process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""
          }/og-image.png`}
        />
      </Head>

      <main className="w-full min-h-screen px-5 bg-top bg-cover py-8">
        <section className="md:max-w-prose mx-auto min-h-[45vh] flex flex-col justify-center">
          <h1 className="text-4xl font-bold lg:text-6xl text-slate-700 dark:text-white">
          Hôm nay <span className="text-orange-500">ăn gì</span>? 🧑‍🍳
          </h1>

          <p className="mt-3 text-xl font-light dark:text-slate-100 font-lato">
          Em không biết nấu món gì hôm nay đúng không? Chỉ cần liệt kê các nguyên liệu em
          có và anh sẽ giúp em chọn món và chỉ em cách nấu nha.
          </p>

          <form
            className="w-full mt-8 mb-6 space-y-10"
            onSubmit={handleSubmit(generateRecipe)}
          >
            <div className="items-center justify-center w-full gap-5 p-4 dark:p-0 bg-white shadow-md rounded-xl dark:bg-transparent dark:shadow-none">
              <div
                className={cn(
                  "lg:overflow-auto pb-2 lg:border-r border-transparent transition-colors hidden",
                  {
                    "w-full block":
                      fields.length !== 0,
                  }
                )}
              >
                <fieldset className="flex flex-wrap items-center gap-4 mx-auto lg:flex-row">
                  {fields.map((field, index) => (
                    <div
                      className="relative w-full group lg:w-auto"
                      key={field.id}
                    >
                      <Input
                        {...register(`ingredients.${index}.value`)}
                        className="min-w-[190px]"
                        placeholder={
                          ingredientPlaceholders[
                            Math.floor(
                              Math.random() * ingredientPlaceholders.length
                            )
                          ]
                        }
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-2 transition-opacity opacity-100 lg:opacity-0 group-hover:opacity-100"
                        onClick={() => remove(index)}
                      >
                        <PlusCircleSolid className="w-6 h-6 text-red-500 rotate-45 hover:text-red-400" />
                      </button>
                    </div>
                  ))}
                </fieldset>
              </div>
              <button
                className="flex w-full justify-center items-center gap-3 px-3 py-2 transition-colors border border-orange-500 rounded-lg lg:self-start dark:transition-opacity hover:bg-orange-100 dark:bg-orange-600 dark:bg-opacity-30 group dark:hover:bg-opacity-50"
                onClick={() =>
                  append({
                    value: "",
                  })
                }
                type="button"
              >
                <PlusCircleSolid className="w-6 h-6 text-orange-500 dark:text-orange-100" />
                <span className="text-sm font-semibold text-orange-500 dark:text-orange-100 whitespace-nowrap">
                  Thêm nguyên liệu
                </span>
              </button>
            </div>

            <button
              className="block w-full px-5 py-3 mx-auto text-sm font-semibold text-white transition-colors border border-green-500 rounded-lg dark:transition-opacity bg-green-500 hover:bg-green-600 dark:text-green-100 dark:bg-green-700 dark:bg-opacity-30 dark:hover:bg-opacity-50 disabled:bg-slate-400 disabled:opacity-30 dark:disabled:bg-gray-700 disabled:text-white disabled:border-gray-400"
              type="submit"
              disabled={
                !isValid ||
                isSubmitting ||
                recipeMutation.isLoading ||
                fields.length === 0 
                // ||
                // !tokenSaved
              }
            >
              Nấu gì đây anh ơi?
            </button>
          </form>
        </section>
        <div className="flex flex-wrap justify-center mx-auto sm:w-full">
          <Transition
            show={!!text && !recipeMutation.isError}
            className="max-w-prose"
          >
            <Transition.Child
              className="flex items-center w-full mb-10 lg:mb-10 lg:flex-row-reverse"
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
            </Transition.Child>
            <Transition.Child
              className="w-full"
              enter="transition ease-in-out duration-300 transform"
              enterFrom="scale-0 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-0"
            >
              <ReactMarkdown className="w-full px-5 mb-12 prose-sm prose bg-white shadow-md md:prose-lg dark:bg-transparent dark:shadow-none py-7 rounded-xl prose-headings:text-orange-500 dark:prose-p:text-slate-200 dark:prose-li:text-slate-300 dark:prose-strong:text-orange-500">
                {text ?? ""}
              </ReactMarkdown>
              <button
                onClick={() => {
                  event({
                    action: "clear_text",
                    category: "user_interaction",
                    label: "Clear recipe text",
                  });
                  setText("");
                }}
                className="flex items-center gap-2 px-4 py-1 mx-auto text-sm text-white transition-opacity border border-red-400 rounded-full lg:gap-0 bg-rose-600 dark:bg-red-600 dark:text-red-300 hover:gap-2 group w-fit dark:bg-opacity-30 dark:hover:bg-opacity-70 flex-nowrap"
              >
                <span className="w-auto lg:w-0 lg:opacity-0 overflow-hidden transition-all group-hover:w-[50px] group-hover:opacity-100">
                  Xóa
                </span>{" "}
                <Cross className="w-3 h-3" />
              </button>
            </Transition.Child>
          </Transition>
        </div>
      </main>
    </div>
  );
};

export default Home;
