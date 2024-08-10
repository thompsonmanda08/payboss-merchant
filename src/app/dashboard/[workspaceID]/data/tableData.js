import { Tooltip } from "@/components/base";
import Progress from "@/components/progress";
import React from "react";

const CustomTooltip = ({ title, children }) => (
  <Tooltip content={title}>
    {children}
  </Tooltip>
);

export default function data() {
  return {
    columns: [
      { name: "batch", },
      { name: "created", },
      { name: "budget", },
      { name: "completion", },
    ],

    rows: [
      {
        batch: ["UI XD Version"],
        created: <div className="flex py-1">10 Jun, 2024</div>,
        budget: <span className="text-sm font-medium">K14,000</span>,
        completion: <div className="w-32"><Progress value={60} color="primary from-primary to-black/50" /></div>,
      },
      {
        batch: ["Add Progress Track"],
        created: <div className="flex py-1">20 Jan,2024</div>,
        budget: <span className="text-sm font-medium">K3,000</span>,
        completion: <div className="w-32"><Progress value={10} color="red-500 from-red-500 to-white/50" /></div>,
      },
      {
        batch: ["Fix Platform Errors"],
        created: <div className="flex py-1">12 Sep, 2023</div>,
        budget: <span className="text-sm font-medium">Not set</span>,
        completion: <div className="w-32"><Progress value={100} color="green-600 from-green-600 to-green-500" /></div>,
      },
      {
        batch: ["Launch our Mobile App"],
        created: <div className="flex py-1">15 Dec, 2023</div>,
        budget: <span className="text-sm font-medium">K20,500</span>,
        completion: <div className="w-32"><Progress value={100} color="green-600 from-green-600 to-green-500" /></div>,
      },
      {
        batch: ["Add the New Pricing Page"],
        created: <div className="flex py-1">05 Aug, 2023</div>,
        budget: <span className="text-sm font-medium">K500</span>,
        completion: <div className="w-32"><Progress value={25} color="red-500 from-red-500 to-white/50" /></div>,
      },
      {
        batch: ["Redesign New Online Shop"],
        created: <div className="flex py-1">11 Nov, 2024</div>,
        budget: <span className="text-sm font-medium">K2,000</span>,
        completion: <div className="w-32"><Progress value={40} color="primary from-primary to-black/50" /></div>,
      },
    ],
  };
}

