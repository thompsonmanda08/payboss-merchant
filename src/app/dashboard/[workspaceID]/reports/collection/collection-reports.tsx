'use client';
import {
  AdjustmentsVerticalIcon,
  ArrowDownTrayIcon,
  CalculatorIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  EyeSlashIcon,
  FunnelIcon,
  ListBulletIcon,
  PresentationChartBarIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button as HeroButton,
  DropdownSection,
  Selection,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useReducer, useState } from 'react';

import { apiTransactionsReportToCSV } from '@/app/_actions/file-conversion-actions';
import TotalValueStat from '@/app/dashboard/components/total-stats';
import TotalStatsLoader from '@/app/dashboard/components/total-stats-loader';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import SoftBoxIcon from '@/components/base/soft-box-icon';
import CustomTable from '@/components/tables/table';
import { TerminalInfo } from '@/components/tables/terminal-tables';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/custom-spinner';
import { DateRangePickerField } from '@/components/ui/date-select-field';
import Search from '@/components/ui/search';
import { useDebounce } from '@/hooks/use-debounce';
import { QUERY_KEYS } from '@/lib/constants';
import {
  API_KEY_TERMINAL_TRANSACTION_COLUMNS,
  API_KEY_TRANSACTION_COLUMNS,
} from '@/lib/table-columns';
import { cn, formatCurrency } from '@/lib/utils';
import { DateRangeFilter } from '@/types';
import { useCollectionReports } from '@/hooks/use-query-data';

// Constants
const DEBOUNCE_DELAY = 500;
const DEFAULT_DATE_RANGE_DAYS = 30;
const DEFAULT_PAGINATION = { page: 1, limit: 10 };

const SERVICE_TYPES = [
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Integrations on 3rd party applications',
    index: 0,
    icon: AdjustmentsVerticalIcon,
  },
  {
    id: 'till',
    name: 'Till Payment',
    description: 'Integration on USSD and POS devices',
    index: 1,
    icon: CalculatorIcon,
  },
  {
    id: 'checkout',
    name: 'Hosted Checkout',
    description: 'Online E-Commerce and 3rd party checkout',
    index: 2,
    icon: ShoppingCartIcon,
  },
  {
    id: 'invoice',
    name: 'Invoice',
    description: 'Invoicing with checkout integration',
    index: 3,
    icon: DocumentTextIcon,
  },
];

// Create service map for O(1) lookup
const SERVICE_MAP = new Map(
  SERVICE_TYPES.map((service) => [service.id, service]),
);

// Export filename mapping
const EXPORT_FILENAME_MAP: Record<string, string> = {
  'api-integration': 'api_collection_transactions',
  till: 'till_collection_transactions',
  checkout: 'checkout_collection_transactions',
  invoice: 'invoice_collection_transactions',
};

// Types
type ServiceType = {
  id: string;
  name: string;
  description: string;
  index: number;
  icon: React.ComponentType<{ className?: string }>;
};

// Custom hooks
const useServiceSelection = (initialServiceKey = 'api-integration') => {
  const [serviceKeys, setServiceKeys] = useState<Selection>(
    new Set([initialServiceKey]),
  );

  const selectedServiceKey = useMemo(
    () => Array.from(serviceKeys).join(', ').replace(/_/g, ''),
    [serviceKeys],
  );

  const service = useMemo(
    () => SERVICE_MAP.get(selectedServiceKey) as ServiceType | undefined,
    [selectedServiceKey],
  );

  return { serviceKeys, setServiceKeys, selectedServiceKey, service };
};

const useFilteredData = (
  transactions: any[],
  terminalSummary: any[],
  searchQuery: string,
  terminalQuery: string,
) => {
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const debouncedTerminalQuery = useDebounce(terminalQuery, DEBOUNCE_DELAY);

  const filteredTransactions = useMemo(() => {
    if (!debouncedSearchQuery) return transactions;

    const query = debouncedSearchQuery.toLowerCase();
    return transactions.filter(
      (row) =>
        row?.transactionID?.toLowerCase().includes(query) ||
        row?.destination?.toLowerCase().includes(query) ||
        row?.amount?.toLowerCase().includes(query) ||
        row?.service_provider?.toLowerCase().includes(query),
    );
  }, [transactions, debouncedSearchQuery]);

  const filteredTerminals = useMemo(() => {
    if (!debouncedTerminalQuery) return terminalSummary;

    const query = debouncedTerminalQuery.toLowerCase();
    return terminalSummary.filter(
      (terminal) =>
        terminal?.terminal_name?.toLowerCase().includes(query) ||
        terminal?.terminalName?.toLowerCase().includes(query) ||
        terminal?.terminalID?.toLowerCase().includes(query),
    );
  }, [terminalSummary, debouncedTerminalQuery]);

  return { filteredTransactions, filteredTerminals };
};

const useReportExport = (
  selectedServiceKey: string,
  transactions: any[],
  hasTerminals: boolean,
) => {
  return useCallback(() => {
    const fileName =
      EXPORT_FILENAME_MAP[selectedServiceKey] || 'collection_transactions';
    const exportConfig: any = {
      objArray: transactions,
      fileName,
    };

    if (selectedServiceKey === 'api-integration' && hasTerminals) {
      exportConfig.hasTerminals = hasTerminals;
    }

    apiTransactionsReportToCSV(exportConfig);
  }, [selectedServiceKey, transactions, hasTerminals]);
};

// Filters reducer
type FiltersState = {
  searchQuery: string;
  terminalQuery: string;
  dateRange: DateRangeFilter;
  pagination: { page: number; limit: number };
  isExpanded: boolean;
};

type FiltersAction =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_TERMINAL_QUERY'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: DateRangeFilter }
  | { type: 'SET_PAGINATION'; payload: { page: number; limit: number } }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_PAGE'; payload: number };

const filtersReducer = (
  state: FiltersState,
  action: FiltersAction,
): FiltersState => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_TERMINAL_QUERY':
      return { ...state, terminalQuery: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'TOGGLE_EXPANDED':
      return { ...state, isExpanded: !state.isExpanded };
    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload },
      };
    default:
      return state;
  }
};

const initialFiltersState: FiltersState = {
  searchQuery: '',
  terminalQuery: '',
  dateRange: {
    start_date: new Date(
      new Date().getTime() - DEFAULT_DATE_RANGE_DAYS * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    range: '',
  },
  pagination: DEFAULT_PAGINATION,
  isExpanded: true,
};

export const CollectionsReports = ({
  workspaceID,
}: {
  workspaceID: string;
}) => {
  const queryClient = useQueryClient();

  // Use reducer for complex state management
  const [filters, dispatchFilters] = useReducer(
    filtersReducer,
    initialFiltersState,
  );
  const { searchQuery, terminalQuery, dateRange, pagination, isExpanded } =
    filters;

  // Use custom hooks
  const { serviceKeys, setServiceKeys, selectedServiceKey, service } =
    useServiceSelection();

  const { data: reports, isLoading } = useCollectionReports({
    workspaceID,
    service: service?.id as string,
    filters: {
      start_date: dateRange?.start_date,
      end_date: dateRange?.end_date,
      ...pagination,
    },
  });

  // QUERY RESPONSE DATA
  const report = reports?.data?.summary || [];
  const transactions = reports?.data?.data || [];
  const hasTerminals = Boolean(reports?.data?.hasTerminal || false);
  const terminalSummary = reports?.data?.terminal || [];
  const PAGINATION = {
    ...pagination, // USER SET CONFIGS FOR PAGINATION {page and limit}
    ...reports?.data?.data?.pagination, // PAGINATION DETAILS FROM SERVER
  };

  // Use filtered data hook
  const { filteredTransactions: filteredItems, filteredTerminals } =
    useFilteredData(transactions, terminalSummary, searchQuery, terminalQuery);

  const exportReportToCSV = useReportExport(
    selectedServiceKey,
    transactions,
    hasTerminals,
  );

  const triggerRefetch = useCallback(async () => {
    const filters = {
      start_date: dateRange?.start_date,
      end_date: dateRange?.end_date,
      ...pagination,
    };

    const queryKey = [
      QUERY_KEYS.COLLECTION_REPORTS,
      service?.id as string,
      filters,
      workspaceID,
    ];

    queryClient.invalidateQueries({ queryKey });
    queryClient.refetchQueries({ queryKey });
  }, [queryClient, service?.id, dateRange, pagination, workspaceID]);

  return (
    <>
      <div className="flex w-full items-start justify-between mb-4 -mt-4">
        <div className="relative">
          <label className={cn('pl-1 text-sm font-medium text-foreground/70')}>
            Select a Service
          </label>
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <HeroButton
                className={cn(
                  'border border-primary-300 max-h-[60px] w-full items-center justify-start p-1',
                )}
                radius="sm"
                size="lg"
                variant="light"
              >
                <SoftBoxIcon
                  className={'aspect-square h-10 w-10 p-1 rounded-[5px]'}
                >
                  {(() => {
                    const Icon = service?.icon;
                    if (!Icon) return null;
                    return <Icon className="w-5 h-5" />;
                  })()}
                </SoftBoxIcon>
                <div className="flex w-full items-center justify-between text-primary">
                  <div className="flex flex-col items-start justify-start gap-0">
                    <div className="text-base font-semibold capitalize">
                      {isLoading ? (
                        <div className="flex gap-2 text-sm font-bold ">
                          <Spinner size={18} />{' '}
                          {`Fetching ${service?.name} reports ...`}
                        </div>
                      ) : (
                        service?.name
                      )}
                    </div>
                    {!isLoading && (
                      <span className="-mt-0.5 text-xs font-medium tracking-wide text-foreground-600">
                        Report analytics on {service?.name}
                      </span>
                    )}
                  </div>
                  <ChevronDownIcon className={cn('h-4 w-4 ease-in-out mx-4')} />
                </div>
              </HeroButton>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dropdown menu with services"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={serviceKeys}
              onSelectionChange={setServiceKeys}
            >
              <DropdownSection
                // showDivider
                title="Reports by Service types"
              >
                {SERVICE_TYPES.map((service) => {
                  const Icon = service?.icon;
                  return (
                    <DropdownItem
                      key={service?.id}
                      description={service?.description}
                      startContent={
                        <Icon
                          className={
                            'w-5 h-5 text-default-500 pointer-events-none flex-shrink-0'
                          }
                        />
                      }
                    >
                      {service?.name}
                    </DropdownItem>
                  );
                })}
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePickerField
            autoFocus
            dateRange={dateRange}
            description={'Dates to generate reports'}
            label={'Reports Date Range'}
            setDateRange={(range: DateRangeFilter) =>
              dispatchFilters({ type: 'SET_DATE_RANGE', payload: range })
            }
            visibleMonths={2}
          />{' '}
          <Button
            endContent={<FunnelIcon className="h-5 w-5" />}
            onPress={triggerRefetch}
          >
            Apply
          </Button>
        </div>
      </div>

      <Card className={'w-full gap-3'}>
        <div className="flex w-full items-center justify-between gap-8">
          <CardHeader
            className={'max-w-full'}
            classNames={{
              titleClasses: 'xl:text-[clamp(1.125rem,1vw,1.5rem)] font-bold',
              infoClasses: 'text-[clamp(0.8rem,0.8vw,1rem)]',
            }}
            infoText={`Reports on ${service?.name} transactions that took place within the date range applied `}
            title={`${service?.name} Reports from (${
              dateRange?.range || '--'
            })`}
          />

          <div className="flex max-w-max justify-end gap-4">
            <Button
              color={'primary'}
              variant="flat"
              onPress={() => dispatchFilters({ type: 'TOGGLE_EXPANDED' })}
            >
              {isExpanded ? (
                <>
                  <EyeSlashIcon className="h-5 w-5" /> Hide Summary
                </>
              ) : (
                <>
                  <PresentationChartBarIcon className="h-5 w-5" />
                  Show Summary
                </>
              )}
            </Button>
          </div>
        </div>

        {
          <AnimatePresence>
            <motion.div
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              className="mb-4"
              initial={{ height: 0, opacity: 0 }}
            >
              <Card className={'mb-4 mt-2 shadow-none'}>
                {Object.keys(report).length > 0 ? (
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div className="flex-1">
                      <TotalValueStat
                        count={transactions.length || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'primary',
                        }}
                        label={'Total Transactions'}
                        value={''}
                      />
                    </div>
                    <div className="flex-1">
                      <TotalValueStat
                        count={report?.successful_count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'success',
                        }}
                        label={'Successful Transactions'}
                        value={formatCurrency(report?.successful_value)}
                      />
                    </div>

                    <div className="flex-1">
                      <TotalValueStat
                        count={report?.failed_count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'danger',
                        }}
                        label={'Failed Transactions'}
                        value={formatCurrency(report?.failed_value || 0)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    <TotalStatsLoader className={'justify-between'} />
                    <TotalStatsLoader className={'justify-between'} />
                  </div>
                )}
              </Card>

              {/* TERMINAL SUMMARY FOR CONFIGURED TERMINALS */}
              {hasTerminals && filteredTerminals?.length > 0 && (
                <Card className={'max-w-full gap-4 shadow-none'}>
                  <div className="flex w-full flex-col items-center justify-between gap-8 sm:flex-row">
                    <CardHeader
                      classNames={{
                        titleClasses:
                          'text-base md:text-lg xl:text-xl font-bold',
                        infoClasses: 'text-[clamp(0.8rem,0.8vw,1rem)]',
                      }}
                      infoText={
                        'Reports on successful transaction counts and values for each terminal'
                      }
                      title={`Terminal Summary`}
                    />
                    <div className="flex w-full max-w-xs gap-4">
                      <Search
                        className={''}
                        placeholder={'Find a terminal...'}
                        onChange={(v) =>
                          dispatchFilters({
                            type: 'SET_TERMINAL_QUERY',
                            payload: v,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div
                    className={
                      'my-2 gap-4 flex max-w-full overflow-x-auto shadow-none'
                    }
                  >
                    {filteredTerminals?.map((terminal) => (
                      <TerminalInfo
                        key={terminal?.terminalID}
                        className={'mb-4 min-w-[300px]'}
                        count={terminal?.successful_count}
                        terminalID={terminal?.terminalID}
                        terminalName={terminal?.terminalName}
                        value={terminal?.successful_value}
                      />
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        }

        {/* TABLE HEADER */}
        <div className="flex w-full items-center justify-between gap-8">
          <CardHeader
            classNames={{
              titleClasses: 'text-base md:text-lg xl:text-xl font-bold',
              infoClasses: 'text-[clamp(0.8rem,0.8vw,1rem)]',
            }}
            infoText={
              'Transactions that took place within the date range applied'
            }
            title={`Transactions`}
          />
          <div className="mb-4 flex w-full items-end justify-end gap-3">
            <Search
              className={'max-w-sm'}
              placeholder={'Search by name, or type...'}
              onChange={(v) =>
                dispatchFilters({ type: 'SET_SEARCH_QUERY', payload: v })
              }
            />
            <Button
              color={'primary'}
              disabled={!filteredItems?.length}
              startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
              onPress={() => exportReportToCSV()}
            >
              Export
            </Button>
          </div>
        </div>

        {/* CUSTOM TABLE TO RENDER TRANSACTIONS */}
        <CustomTable
          removeWrapper
          columns={
            hasTerminals && filteredTerminals?.length > 0
              ? API_KEY_TERMINAL_TRANSACTION_COLUMNS
              : API_KEY_TRANSACTION_COLUMNS
          }
          isLoading={isLoading}
          rows={filteredItems || []}
          pagination={PAGINATION}
          handlePageChange={(page) =>
            dispatchFilters({ type: 'SET_PAGE', payload: page })
          }
        />
      </Card>
    </>
  );
};

export default CollectionsReports;
