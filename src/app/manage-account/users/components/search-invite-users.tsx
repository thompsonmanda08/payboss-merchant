import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { SingleSelectionDropdown } from "@/components/ui/dropdown-button";
import { Input } from "@/components/ui/input-field";
import Search from "@/components/ui/search";

function SearchOrInviteUsers({
  setSearchQuery,
  resolveAddToWorkspace,
}: {
  setSearchQuery: (query: string) => void;
  resolveAddToWorkspace: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set([["admin"]]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys],
  );

  return (
    <div className="relative flex min-h-20 w-full flex-col justify-between gap-4 py-8 md:flex-row">
      {/*  USER SEARCH */}
      <Search
        placeholder={"Search users..."}
        onChange={(v) => setSearchQuery(v)}
      />

      {/******** ADD USER TO WORKSPACE ************/}

      <form
        className={"group relative flex h-fit w-full flex-grow-0 justify-end"}
        onSubmit={resolveAddToWorkspace}
      >
        <Input
          className={
            "h h-12 w-full max-w-lg rounded-r-none text-base placeholder:text-sm placeholder:font-normal placeholder:text-slate-400"
          }
          placeholder={"Invite users to workspace..."}
          // value={value}
          // onChange={onChange}
        />
        <SingleSelectionDropdown
          className={"max-w-[280px]"}
          classNames={{
            chevronIcon: "text-foreground/50",
            dropdownItem: "w-[260px]",
            trigger:
              "rounded-none border-px h-auto border border-input bg-transparent p-2 px-3 min-w-[110px]",
          }}
          dropdownItems={["admin"]}
          selectedKeys={selectedKeys}
          selectedValue={selectedValue}
          setSelectedKeys={setSelectedKeys}
        />

        <Button className={"h-12 rounded-l-none px-8"} type="submit">
          Invite
        </Button>
      </form>
    </div>
  );
}

export default SearchOrInviteUsers;
