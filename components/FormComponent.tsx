// components/FormComponent.tsx
"use client";

import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, MinusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function FormComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Use isValidEmail to validate email format
    if (!isValidEmail(data.email)) {
      toast("FAILED!", {
        description: "Invalid email format.",
      });
      return; // Exit if email is invalid
    }

    // Validate password field
    if (!data.password) {
      toast("FAILED!", {
        description: "Password is required.",
      });
      return; // Exit if password is missing
    }

    try {
      setIsLoading(true);

      const formActionData = new FormData();
      formActionData.append("email", data.email);
      formActionData.append("password", data.password);

      await login(formActionData);
    } catch (error) {
      console.log("ErrorMsg: ", error);
      toast("ERROR!", { description: "!Failed to log in. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-4 w-full'>
        <div>
          <label htmlFor='email' className='text-[16px] text-gray-400'>
            Email:
          </label>

          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Enter your email'
            className='w-full bg-sky-100 mt-1.5'
          />
        </div>

        <div>
          <label htmlFor='password' className='text-[16px] text-gray-400'>
            Password:
          </label>
          <div className='flex items-center justify-center gap-3'>
            <Input
              id='password'
              name='password'
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              className='w-full bg-sky-100 mt-1.5'
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='ml-2  border-blue-500 text-white rounded p-2'>
              {showPassword ? (
                <EyeOffIcon className='w-5 h-5 text-red-500' />
              ) : (
                <EyeIcon className='w-5 h-5 text-blue-500' />
              )}
            </button>
          </div>
        </div>

        <div>
          <Button
            type='submit'
            className={`w-full ${
              isLoading ? "bg-sky-950" : "bg-sky-500 hover:bg-sky-700"
            } text-white`}
            disabled={isLoading}>
            {isLoading ? <MinusIcon className='animate-spin' /> : "Log in"}
          </Button>
        </div>
      </form>
    </>
  );
}
