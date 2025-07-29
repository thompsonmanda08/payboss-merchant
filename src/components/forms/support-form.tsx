"use client";
import { useState } from "react";

import { addToast } from "@heroui/react";

import { Button } from "../ui/button";
import Card from "../base/custom-card";
import { Input } from "../ui/input-field";

function SupportForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const mobileNumber = formData.get("MobileNumber")?.toString().trim();
    const fullName = formData.get("FullName")?.toString().trim();
    const email = formData.get("Email")?.toString().trim();
    const message = formData.get("Message")?.toString().trim();

    try {
      // const response = { ok: false };
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ok: true });
        }, 3000);
      });

      if (response?.ok == true) {
        e.currentTarget?.reset();

        addToast({
          color: "success",
          title: "Success",
          description: "Message was sent Successfully!",
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {" "}
      <Card className=" mx-auto max-w-lg">
        {/* <div className="mb-4 flex w-full flex-col justify-between md:flex-row md:items-center">
          <CardHeader
            title={'PayBoss Support'}
            infoText={
              "We're here to assist you! Our team is dedicated to providing prompt and excellent customer support. Your satisfaction is our priority."
            }
            classNames={{
              titleClasses: 'xl:text-2xl lg:text-xl font-bold',
              infoClasses: 'text-[15px] xl:text-base',
            }}
          />
        </div> */}

        <form
          className="mx-auto flex w-full max-w-md flex-col gap-4"
          onSubmit={handleOnSubmit}
        >
          <Input
            required
            label="Full Name"
            name="FullName"
            placeholder="Jonas Banda"
          />
          <Input
            required
            label="Business Name"
            name="BusinessName"
            placeholder="BGS LTD"
          />

          <Input
            required
            label="Mobile Number"
            name="MobileNumber"
            placeholder="0977889910"
          />
          <Input
            required
            label="Email Address"
            name="Email"
            placeholder="bgsgroup@mail.com"
            type="email"
          />
          <div>
            <label
              className="block text-sm font-medium leading-6 text-foreground/50 "
              htmlFor="message"
            >
              Message
            </label>
            <div className="mt-2">
              <textarea
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/80 sm:text-sm sm:leading-6"
                defaultValue={""}
                id="message"
                name="Message"
                rows={4}
              />
            </div>
          </div>
          <Button
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText={"Sending..."}
            type="submit"
          >
            Send
          </Button>
        </form>
      </Card>
    </>
  );
}

export default SupportForm;
