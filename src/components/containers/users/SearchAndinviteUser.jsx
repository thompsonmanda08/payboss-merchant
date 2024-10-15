import React from 'react'

function SearchOrInviteUsers({ setSearchQuery, resolveAddToWorkspace }) {
  const [selectedKeys, setSelectedKeys] = useState(
    new Set([ROLES.map((role) => role.label)[0]]),
  )

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  )
  return (
    <div className="relative flex min-h-20 w-full flex-col justify-between gap-4 py-8 md:flex-row">
      {/*  USER SEARCH */}
      <Search
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
      />

      {/******** ADD USER TO WORKSPACE ************/}

      <form
        onSubmit={resolveAddToWorkspace}
        className={'group relative flex h-fit w-full flex-grow-0 justify-end'}
      >
        <Input
          className={
            'h h-12 w-full max-w-lg rounded-r-none text-base placeholder:text-sm placeholder:font-normal placeholder:text-slate-400'
          }
          placeholder={'Invite users to workspace...'}
          // value={value}
          // onChange={onChange}
        />
        <SingleSelectionDropdown
          className={'max-w-[280px]'}
          classNames={{
            chevronIcon: 'text-slate-500',
            dropdownItem: 'w-[260px]',
            trigger:
              'rounded-none border-px h-auto border border-input bg-transparent p-2 px-3 min-w-[110px]',
          }}
          dropdownItems={ROLES}
          selectedKeys={selectedKeys}
          selectedValue={selectedValue}
          setSelectedKeys={setSelectedKeys}
        />

        <Button type="submit" className={'h-12 rounded-l-none px-8'}>
          Invite
        </Button>
      </form>
    </div>
  )
}

export default SearchOrInviteUsers
