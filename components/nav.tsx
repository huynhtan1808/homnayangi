import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/cn";

import { useTheme } from "next-themes";
import Sun from "@/public/icons/sun-outline.svg";
import Moon from "@/public/icons/moon-outline.svg";



export default function Nav() {

  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  {/** 

  const onSubmit = (data: FormState) => {
    event({
      action: "set_api_key",
      category: "user_interaction",
      label: "User sets OpenAI API key",
    });
    tokenMutation.mutate(data?.token ?? "");
    setOpen(false);
  };
  
  **/}
  
  return (
    <header className="top-0 flex items-center justify-between max-w-xl mx-auto px-5 py-5 lg:px-0">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={cn(
          "my-3 transition-colors rounded-lg hover:bg-orange-100 dark:hover:bg-slate-700",
          {
            "text-slate-700": theme === "light",
            "text-slate-100": theme === "dark",
          }
        )}
      >
        {mounted ? (
          <>
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </>
        ) : (
          <span className="block w-5 h-5" />
        )}
      </button>

      {/** 
      <div className="flex items-center gap-4 ">
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            event({
              action: "toggle_api_modal",
              category: "user_interaction",
              label: "User toggles the set api modal",
              value: open,
            });
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={cn({
                "animate-ring ease-in-out direction-alternate delay-100 justify-self-end":
                  !tokenSaved,
              })}
            >
              Add Open AI API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Open AI Token</DialogTitle>
              <DialogDescription className="font-lato">
                In order to this app to work, you should set{" "}
                <a
                  className="text-orange-500 underline"
                  href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  your Open AI API Key
                </a>
                . Don&apos;t worry, we will never store it anywhere else than
                your browser.
              </DialogDescription>
            </DialogHeader>
            <form className="py-4" onSubmit={handleSubmit(onSubmit)}>
              <Label
                htmlFor="token"
                className="text-right dark:text-white font-lato"
              >
                Your Open AI API Key
              </Label>
              <Input id="token" {...register("token")} className="col-span-3" />
              <span className="block mt-2 min-h-[20px] text-sm font-light text-rose-600">
                {errors.token?.message}
              </span>
              <Button type="submit" className="block mt-5 ml-auto">
                Save changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      **/}
    </header>
  );
}
