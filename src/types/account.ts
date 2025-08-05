export type LoginPayload = {
  emailusername: string;
  password: string;
};

export type BusinessDetails = {
  name: string;
  company_email: string;
  registration?: string;
  contact: string;
  tpin: string;
  companyTypeID: string;
  date_of_incorporation: string;
  physical_address: string;
  provinceID: string;
  cityID: string;
  website: string;
  super_merchant_id: string;
  stage?: string;
};

export type BankAccountDetails = {
  account_name: string;
  account_number: string;
  bank_name?: string;
  bankID: string;
  branch_name?: string;
  branch_code?: string;
  currencyID?: string;
};

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  username: string;
  [x: string]: string;
};

export type AccountOwner = User & {
  role: "owner";
  password: string;
  changePassword: string;
};

export type DocumentUrls = {
  cert_of_incorporation_url: string;
  share_holder_url: string;
  director_nrc_url: string;
  passport_photos_url: string;
  tax_clearance_certificate_url: string;
  company_profile_url: string;
  organisation_structure_url: string;
  proof_of_address_url: string;
  bank_statement_url: string;
  articles_of_association_url: string;
  professional_license_url: string;
};
