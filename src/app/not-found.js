"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthLayout from "./(auth)/layout";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import Logo from "@/components/base/logo";
import { useRouter } from "next/navigation";

export default function NotFound({ title, message, goBack }) {
  const router = useRouter();
  return (
    <AuthLayout>
      <Card className="mx-auto -mt-40 aspect-square w-full max-w-sm flex-auto p-6 font-inter">
        <CardHeader>
          <Logo
            href="/"
            className="mx-auto"
            classNames={{ wrapper: "mx-auto" }}
          />
        </CardHeader>
        <CardBody className="flex cursor-pointer select-none flex-col items-center justify-center p-0">
          <p className="text-[clamp(32px,5vw,60px)] font-bold leading-normal  text-primary-700">
            404
          </p>
          <h1 className="text-lg font-semibold capitalize text-gray-900">
            {title || "Page not found"}
          </h1>
          <p className="text-center text-sm font-medium text-foreground/70">
            {message || `Sorry, we couldn’t find the page you’re looking for.`}
          </p>
        </CardBody>

        <CardFooter>
          {goBack ? (
            <Button onPress={() => router.back()} className="w-full">
              Go back
            </Button>
          ) : (
            <Button as={Link} href="/" className="w-full">
              Go back home
            </Button>
          )}
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
