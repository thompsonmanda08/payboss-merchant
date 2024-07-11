'use client';
import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Table from "../containers/Tables/Table";
import data from "@/app/dashboard/data/tableData";
import { Card } from "../base";
import { CheckIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";

function Batches() {
  const { columns, rows } = data();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card>
      <div className="flex justify-between items-center p-3">
        <div>
          <div className="text-xl font-semibold">Batches</div>
          <div className="flex items-center">
            <CheckIcon className="text-primary h-5 w-5 font-bold"/>
            <div className="text-sm font-normal ml-1">
              &nbsp;<strong>30 done</strong> this month
            </div>
          </div>
        </div>
        <div className="text-text px-2">
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <MenuButton className="cursor-pointer font-bold">
                <EllipsisVerticalIcon
                          className="h-5 w-5 cursor-pointer hover:text-primary"
                        />
                </MenuButton>

                <MenuItems
                  className={`${
                    open ? "block" : "hidden"
                  } absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none`}
                >
                  <div className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100" : ""
                          } group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          Action
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100" : ""
                          } group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          Another action
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100" : ""
                          } group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          Something else
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </>
            )}
          </Menu>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <Table columns={columns} rows={rows} />
      </div>
    </Card>
  );
}

export default Batches;
