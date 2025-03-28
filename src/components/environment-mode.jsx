import { Chip } from "@heroui/react";
import React from "react";

export default function EnvironmentMode({ mode = "UAT" }) {
  return (
    <Chip
      variant="solid"
      color={mode == "prod" ? "success" : "warning"}
      className="text-white capitalize z-30"
    >
      {mode == "prod" ? "Active Mode" : "Staging Mode"}
    </Chip>
  );
}
