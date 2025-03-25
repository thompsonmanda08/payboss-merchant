import { Chip } from "@heroui/react";
import React from "react";

export default function EnvironmentMode({ mode = process.env.NODE_ENV }) {
  return (
    <Chip
      variant="solid"
      color={false ? "success" : "primary"}
      className="text-white capitalize z-30"
    >
      {mode} Mode
    </Chip>
  );
}
