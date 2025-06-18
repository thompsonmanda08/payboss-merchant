import { Chip } from "@heroui/react";

export default function EnvironmentMode({ mode = "UAT" }) {
  return (
    <Chip
      className="text-white capitalize z-30"
      color={mode == "prod" ? "success" : "warning"}
      variant="solid"
    >
      {mode == "prod" ? "Active Mode" : "Staging Mode"}
    </Chip>
  );
}
