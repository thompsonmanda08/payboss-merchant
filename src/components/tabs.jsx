import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import SelectField from "./ui/select-field";

export default function Tabs({
  tabs,
  navigateTo,
  currentTab,
  className,
  classNames,
}) {
  const { innerWrapper, button, nav, icon } = classNames || "";

  return (
    <div className={cn("w-full sm:w-auto", className)}>
      <div className="w-full sm:hidden sm:w-auto">
        <label className="sr-only" htmlFor="tabs">
          Select a tab
        </label>

        <SelectField
          className=" h-auto w-full"
          defaultValue={tabs
            .find((tab) => tab?.index == currentTab)
            ?.index.toString()}
          id="tabs"
          name="tabs"
          options={tabs}
          placeholder={"Select a tab"}
          value={tabs.find((tab) => tab?.index == currentTab)?.index.toString()}
          onChange={(e) => {
            let tab = tabs.find(
              (tab) => tab?.index == parseInt(e.target.value),
            );

            navigateTo(tab?.index);
          }}
        />
      </div>
      <div className={cn("hidden sm:block", innerWrapper)}>
        <nav
          aria-label="Tabs"
          className={cn(
            "min-w-md -mb-px flex gap-x-4 rounded-lg dark:bg-default/30 bg-default/40  p-1",
            nav,
          )}
        >
          {tabs.map((tab, index) => (
            <Button
              aria-current={tab?.index == currentTab ? "active" : undefined}
              className={cn(
                "whitespace-nowrap border-b-1 border-transparent px-4 text-sm  text-gray-500 hover:border-gray-300 hover:bg-background hover:text-primary data-[hover=true]:bg-background ",
                {
                  "border-primary dark:broder-primary-300 dark:bg-card bg-background dark:text-primary-400 text-primary shadow-sm":
                    tab?.index == currentTab,
                },
                button,
              )}
              startContent={
                tab?.icon && (
                  <tab.icon
                    className={cn(
                      "h-5 w-5 text-slate-600",
                      {
                        "bg-background text-primary": tab?.index == currentTab,
                      },
                      icon,
                    )}
                  />
                )
              }
              onClick={() => navigateTo(index)}
              key={index}
              // href={tab.href}
              variant={"light"}
            >
              {tab?.name || tab?.title || tab?.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
