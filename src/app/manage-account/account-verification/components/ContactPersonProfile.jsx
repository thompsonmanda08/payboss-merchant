"use client";

import CardHeader from "@/components/base/card-header";
import React from "react";

function ContactPersonProfile() {
  return (
    <div className="w-full lg:px-8 mx-auto p-2">
      <CardHeader
        title="Business Signatory Information"
        infoText="Please provide the name of the person who will be signing the contract on behalf of your business."
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
      />

      <p>
        Content for Business Signatory Information will be implemented here.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        This section is currently a placeholder. The UI and functionality will
        be built out as per future requirements.
      </p>
    </div>
  );
}

export default ContactPersonProfile;
