import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightCircleIcon,
  ArrowRightStartOnRectangleIcon,
  CircleStackIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

export const BASE_URL =
  process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
// const POCKET_BASE_URL =
//   process.env.POCKET_BASE_URL || process.env.NEXT_PUBLIC_POCKET_BASE_URL

//https://payboss-uat-backend.bgsgroup.co.zm/_/#/login
export const POCKET_BASE_URL = "https://payboss-uat-backend.bgsgroup.co.zm";

export const AUTH_SESSION = "pb-session";
export const USER_SESSION = "pb-next-usr";
export const WORKSPACE_SESSION = "pb-next-workspace";

export const placeHolderImage = "/images/placeholder-image.webp";
export const DefaultCover = "/images/profile-cover.jpg";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const rowsPerPageOptions = [
  {
    ID: 5,
    label: "5",
  },
  {
    ID: 8,
    label: "8",
  },
  {
    ID: 10,
    label: "10",
  },
  {
    ID: 15,
    label: "15",
  },
  {
    ID: 20,
    label: "20",
  },
];

// QUERY KEYS
export const USER_DATA_KEY = "user";
export const CONFIGS_QUERY_KEY = "configs";
export const USER_ROLES_QUERY_KEY = "user-roles";
export const USERS = "workspace-users";
export const SETUP_QUERY_KEY = "setup";
export const WORKSPACES_QUERY_KEY = "workspaces";
export const WORKSPACE_ROLES_QUERY_KEY = "workspace-role";
export const WORKSPACE_DASHBOARD_QUERY_KEY = "dashboard";
export const WORKSPACE_MEMBERS_QUERY_KEY = "members";
export const BULK_TRANSACTIONS_QUERY_KEY = "bulk-transactions";
export const SINGLE_TRANSACTIONS_QUERY_KEY = "single-transactions";
export const BATCH_DETAILS_QUERY_KEY = "batch-details";
export const WALLET_HISTORY_QUERY_KEY = "wallet-history-details";
export const DASHBOARD_ANALYTICS_QUERY_KEY = "dasboard-analytics";
export const PAYMENT_TRANSACTIONS_QUERY_KEY = "payment-transactions";
export const COLLECTION_TRANSACTIONS_QUERY_KEY = "collections-transactions";
export const WORKSPACE_API_KEY_QUERY_KEY = "workspace-api-key";
export const ACTIVE_PREFUND_QUERY_KEY = "active-prefund-key";
export const BULK_REPORTS_QUERY_KEY = "disbursement-analytics-reports";
export const COLLECTION_REPORTS_QUERY_KEY = "collections-analytics-reports";
export const API_COLLECTIONS_REPORTS_QUERY_KEY = "api-collection-reports";
export const API_COLLECTIONS_QUERY_KEY = "api-transactions";
export const TILL_COLLECTIONS_REPORTS_QUERY_KEY = "till-collection-reports";
export const TILL_COLLECTIONS_QUERY_KEY = "till-transactions";
export const WORKSPACE_TILL_NUMBER_QUERY_KEY = "workspace-till-number";
export const WALLET_STATEMENT_REPORTS_QUERY_KEY = "wallet-statement-report";
export const WORKSPACE_TERMINALS_QUERY_KEY = "workspace-terminals";
export const WORKSPACE_CALLBACK = "workspace-callback";
// export const WORKSPACE_TYPES = "workspace-types";

// ANIMATION_VARIANTS
export const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      // staggerChildren: 0.25,
    },
  },
  exit: { opacity: 0 },
};

export const staggerContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      // staggerChildren: 0.25,
    },
  },
  exit: { opacity: 0 },
};

export const staggerContainerItemVariants = {
  hidden: { opacity: 0, y: -60 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
};

export const slideDownInView = {
  hidden: {
    opacity: 0,
    y: -100,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// REGEX
export const MTN_NO = /^0(95|96|97|76|77|75)[0-9]{7}$/;
export const AIRTEL_NO = /^0(95|96|97|76|77|75)[0-9]{7}$/;
export const ZAMTEL_NO = /^0(95|96|97|76|77|75)[0-9]{7}$/;
// const NRC_PASSPORT = /^(ZN[0-9]{6}|[0-9]{6}/[0-9]{2}/[1]{1})$/

// const MTN_NO = /^(?:\+?26|26)?(096|076)\d{7}$/
// const AIRTEL_NO = /^(?:\+?26|26)?(097|077)\d{7}$/
// const ZAMTEL_NO = /^(?:\+?26|26)?(095|075)\d{7}$/

export const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const PAYMENT_SERVICE_TYPES = [
  {
    name: "Bulk Payments",
    Icon: CircleStackIcon,
    index: 0,
  },
  {
    name: "Single Payments",
    Icon: ArrowRightCircleIcon,
    index: 1,
  },
];

export const WORKSPACE_TYPES = [
  {
    ID: "collection",
    label: "Collection",
  },
  {
    ID: "disbursement",
    label: "Disbursement",
  },
  {
    ID: "bills",
    label: "Bill Payments",
  },
  // {
  //   ID: 'hybrid',
  //   label: 'Hybrid',
  // },
];

export const PAYMENT_PROTOCOL = ["direct", "voucher"];

export const TASK_ICON_BG_COLOR_MAP = {
  Call: "bg-[#F7F6FF]",
  Task: "bg-[#FFF8F1]",
  Note: "bg-[#92b76229]",
  Email: "bg-[#F0FFFF]",
  Tag: "bg-[#F7F6FF]",
  Deposit: "bg-[#58FF5F]",
};

export const TRANSACTION_STATUS_COLOR_MAP = {
  submitted: "from-primary/10 to-primary-700/10 text-primary-700",

  proccessing: "from-secondary/10 to-orange-600/10 text-orange-700",
  pending: "from-secondary/10 to-orange-600/10 text-orange-700",
  review: "from-secondary/10 to-orange-600/10 text-orange-700",
  ready: "from-secondary to-orange-600 text-white",

  failed: "from-red-500/10 to-red-600/10 text-red-700",
  canceled: "from-red-500/10 to-red-600/10 text-red-700",
  rejected: "from-red-500/10 to-red-600/10 text-red-700",

  succeeded: "from-[#58FF5F]/10 to-green-500/10 text-green-700",
  successful: "from-[#58FF5F]/10 to-green-500/10 text-green-700",
  approved: "from-[#58FF5F]/10 to-green-500/10 text-green-700",

  processed: "from-[#23C760] to-[#23C760] text-white",
};

export const SERVICE_PROVIDER_COLOR_MAP = {
  airtel: "bg-red-500 text-white  ",
  mtn: "bg-yellow-400 text-black",
  zamtel: "bg-green-600 text-white",
  bank: "bg-primary text-white",
};

export const TASK_TYPE = {
  // Call: {
  //   icon: <DevicePhoneMobileIcon className="h-5 w-5" />,
  //   color: 'violet-800',
  //   label: 'Call',
  // },
  // Task: {
  //   icon: <DocumentArrowDownIcon className="h-5 w-5" />,
  //   color: 'orange-900',
  //   label: 'Task',
  // },
  // Note: {
  //   icon: <PencilSquareIcon className="h-5 w-5" />,
  //   color: 'orange-900',
  //   label: 'Note',
  // },
  // Email: {
  //   icon: <InboxArrowDownIcon className="h-5 w-5" />,
  //   color: 'cyan-900',
  //   label: 'Email',
  // },
  // Tag: {
  //   icon: <TagIcon className="h-5 w-5" />,
  //   color: 'black/60',
  //   label: 'Tag',
  // },
  debit: {
    icon: <ArrowRightStartOnRectangleIcon className="h-5 w-5" />,
    color: "red-500",
    label: "Debit",
  },
  credit: {
    icon: <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />,
    color: "green-500",
    label: "Credit",
  },
  Deposit: {
    icon: <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />,
    color: "green-500",
    label: "Deposit",
  },
};
