'use client';
import { Snippet } from '@heroui/react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { syntaxHighlight } from '@/lib/utils';

import StatusCodesTable from '../../_components/status-codes';

export default function CollectionsDocs({}) {
  return (
    <>
      {' '}
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 w-full">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              PayBoss Collections API Integration
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Learn how to integrate with the PayBoss Collections API to process
              payments.
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1: Authentication */}
            <Card id="authentication">
              <CardHeader>
                <CardTitle>Step 1: API Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>Provide credentials for applications to access the API</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Request</h3>
                    <div className="flex flex-col gap-4 w-full">
                      <pre className="text-sm bg-primary-50 dark:bg-gray-900 p-4 rounded-md">
                        <code>
                          {`POST ~ {%BASE_URL%}/transaction/collection/auth
Content-Type: application/json`}
                        </code>
                      </pre>
                      <Snippet hideSymbol>
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(
                              JSON.stringify(
                                {
                                  username: 'YOUR_USERNAME',
                                  apikey: 'YOUR_API_KEY',
                                },
                                undefined,
                                4,
                              ),
                            ),
                          }}
                        />
                      </Snippet>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Response Example
                    </h3>
                    <div className="rounded-md flex flex-col w-full">
                      <Snippet hideSymbol>
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(
                              JSON.stringify(
                                {
                                  tokenType: 'Bearer',
                                  token: 'YOUR_ACCESS_TOKEN',
                                  expiresIn: 180,
                                },
                                undefined,
                                4,
                              ),
                            ),
                          }}
                        />
                      </Snippet>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Collection */}
            <Card id="collection">
              <CardHeader>
                <CardTitle>Step 2: Collection</CardTitle>
                <CardDescription>
                  To initiate a collection transaction:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <h3 className="text-lg font-semibold mb-2">
                  A. Mobile Money (Airtel, MTN & Zamtel)
                </h3>

                <div id="mobile" className="space-y-4">
                  {/* REQUEST */}
                  <div>
                    <h4 className="font-medium mb-2">Request</h4>
                    <div className="flex flex-col gap-4 w-full">
                      <Snippet hideSymbol className="w-full">
                        <pre className="text-sm p-4 rounded-md">
                          <code>
                            {`POST ~ {%BASE_URL%}/transaction/collection
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN `}{' '}
                            <br />
                          </code>
                        </pre>
                      </Snippet>

                      <Snippet hideSymbol className="w-full">
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(
                              JSON.stringify(
                                {
                                  phoneNumber: '0971234567',
                                  amount: '1.00',
                                  narration: 'your narration',
                                  transactionID: 'your transaction ID',
                                },
                                undefined,
                                4,
                              ),
                            ),
                          }}
                        />
                      </Snippet>
                    </div>
                  </div>
                  {/* RESPONSE */}
                  <div>
                    <h3 className="font-medium mb-2">Response</h3>
                    <div className="flex flex-col gap-4 w-full">
                      <Snippet hideSymbol>
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(
                              JSON.stringify(
                                {
                                  status: 'success | failed | pending',
                                  message: 'status description',
                                  transactionID: 'your transaction ID',
                                },
                                undefined,
                                4,
                              ),
                            ),
                          }}
                        />
                      </Snippet>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  B. Debit/Credit (VISA, Mastercard, AmericanExpress, etc)
                </h3>
                <div id="card" className="space-y-4">
                  {/* REQUEST */}
                  <div>
                    <h4 className="font-medium mb-2">Request</h4>
                    <div className="flex flex-col gap-4 w-full">
                      <Snippet hideSymbol className="w-full">
                        <pre className="text-sm p-4 rounded-md">
                          <code>
                            {`POST ~ {%BASE_URL%}/transaction/collection/card
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN `}{' '}
                            <br />
                          </code>
                        </pre>
                      </Snippet>

                      <Snippet hideSymbol className="w-full">
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(
                              JSON.stringify(
                                {
                                  phoneNumber: '0974XXXXXX',
                                  amount: '1.00',
                                  narration: 'Testing Narration',
                                  transactionID: 'tnx-uat-test',
                                  firstname: 'Bob',
                                  lastname: 'Mwale',
                                  email: 'bmwale@mail.com',
                                  address: '87A Kabulonga',
                                  city: 'Lusaka',
                                  country: 'ZM',
                                  postalCode: '10101',
                                  province: 'Lusaka',
                                  redirectUrl:
                                    'https://back-to-my-site.bgspayboss.com',
                                  currency: 'zmw',
                                },
                                undefined,
                                4,
                              ),
                            ),
                          }}
                        />
                      </Snippet>
                    </div>
                  </div>
                  {/* RESPONSE */}
                  <div>
                    <h3 className="font-medium mb-2">Response</h3>
                    <div className="flex flex-col gap-4 w-full">
                      <Snippet hideSymbol>
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(
                              JSON.stringify(
                                {
                                  status: 'success',
                                  message:
                                    'transaction submitted for processing',
                                  transactionID: 'tnx-uat-test',
                                  redirectUrl:
                                    '{%BASE_URL%}/transaction/collection/card/processing/{%TXN_ID%}',
                                },
                                undefined,
                                4,
                              ),
                            ),
                          }}
                        />
                      </Snippet>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Status Query */}
            <Card id="status-query">
              <CardHeader>
                <CardTitle>Step 3: Status Query</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>To get a transaction status:</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Request</h3>
                    <div className="flex flex-col gap-4 w-full">
                      <pre className="text-sm bg-primary-50 dark:bg-gray-900 p-4 rounded-md">
                        <code>
                          {`GET ~ {%BASE_URL%}/transaction/collection/status/{%transactionID%}
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN `}
                        </code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Response Example</h3>
                    <div className="rounded-md flex flex-col w-full">
                      <Snippet hideSymbol>
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(
                              JSON.stringify(
                                {
                                  status: '"success" | "failed" | "pending"',
                                  statusCode: '"200" | "401" | "404" | "500"',
                                  message: 'status description',
                                  transactionID: 'your transaction ID',
                                  serviceProviderRef:
                                    'serviceProvider reference | null',
                                  serviceProviderStatusDescription:
                                    'Transaction status description',
                                },
                                undefined,
                                4,
                              ),
                            ),
                          }}
                        />
                      </Snippet>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Properties */}
            <Card id="required-properties">
              <CardHeader>
                <CardTitle>Required Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Be sure that the variables denoted with{' '}
                  <code>{'{%variable name%}'}</code> are provided when required
                </p>

                {/* <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    BASE_URL: (TESTING ENVIRONMENT)
                  </h3>
                  <Snippet hideSymbol className="w-full flex-1">
                    <code className="text-wrap text-base tracking-tighter font-medium">
                      https://services-uat.bgspayboss.com
                    </code>
                  </Snippet>
                </div> */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    BASE_URL: (PRODUCTION)
                  </h3>
                  <Snippet hideSymbol className="w-full flex-1">
                    <code className="text-wrap text-base tracking-tighter font-medium">
                      https://services-prod.bgspayboss.com/api/v1
                    </code>
                  </Snippet>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base xl:text-lg font-semibold">
                    TRANSACTION_ID:
                  </h3>
                  <p className="text-xs sm:text-sm xl:text-base text-foreground">
                    To perform a collection, you need to initiate a transaction
                    on your system and as reference PayBoss will need the ID of
                    that transaction. You are required to pass the ID of that
                    transaction in the collection payload as a property{' '}
                    <code>transactionID</code> and also in the URL when you need
                    to get a status query of the transaction.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status Codes */}
            <Card id="status-codes">
              <CardHeader>
                <CardTitle>Status Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  These are the HTTP status codes returned by the API
                </p>

                <div className="rounded-md border">
                  <StatusCodesTable />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* Right Sidebar - Table of Contents */}
      <aside className="hidden border-l border-foreground/10 lg:block max-w-60 flex-1">
        <div className="sticky top-16 overflow-y-auto p-4 h-[calc(100vh-4rem)]">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">On this page</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#authentication"
              >
                API Authentication
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#collection"
              >
                Collection
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#status-query"
              >
                Status Query
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#required-properties"
              >
                Required Properties
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="#status-codes"
              >
                Status Codes
              </Link>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
