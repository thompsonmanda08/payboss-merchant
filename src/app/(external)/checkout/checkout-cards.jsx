"use client";
import {
  Card,
  CardBody,
  CardHeader as HeroCardHeader,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableCell,
  TableBody,
  TableRow,
  CardFooter,
  Image,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Alert,
} from "@heroui/react";

import React, { useRef } from "react";
import { Input } from "@/components/ui/input-field";
import { cn, formatCurrency, notify } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { AIRTEL_NO, MTN_NO } from "@/lib/constants";
import {
  CreditCardIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import CardHeader from "@/components/base/card-header";
import Logo from "@/components/base/logo";

export function Checkout({ checkoutData }) {
  const [formData, setFormData] = React.useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function updateFormData(fields) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }
  return (
    <div className="container mx-auto grid place-items-center py-8 ">
      <PaymentMethods
        formData={formData}
        handleChange={handleChange}
        updateFormData={updateFormData}
        checkoutData={checkoutData}
      />
    </div>
  );
}

function PaymentMethods({
  formData,
  handleChange,
  updateFormData,
  checkoutData,
}) {
  const [selected, setSelected] = React.useState("mobile");
  const [operatorLogo, setOperatorLogo] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCancelled, setIsCancelled] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [error, setError] = React.useState({ status: false, message: "" });

  const popUpWindowRef = React.useRef(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  function checkOperator(phone) {
    if (AIRTEL_NO.test(phone)) {
      updateFormData({ operator: "airtel" });
      setOperatorLogo("/images/airtel-logo.png");
      return;
    }

    if (MTN_NO.test(phone)) {
      updateFormData({ operator: "mtn" });
      setOperatorLogo("/images/mtn-logo.png");
      return;
    }

    setOperatorLogo("");
  }

  const openPaymentWindow = async (paymentData) => {
    const width = 768;
    const height = 600;

    // Calculate center position
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    const paymentUrl = "https://google.com"; // Route where the client runs

    const paymentWindow = window.open(
      paymentUrl,
      "PayBoss Checkout",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!paymentWindow) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }

    popUpWindowRef.current = paymentWindow;

    console.log("Opening Payment Window...", paymentWindow);

    // Send payment data to the pop-up after a short delay to ensure window is loaded
    // Send payment data to the pop-up after a short delay
    setTimeout(() => {
      try {
        console.log("Sending Payment data...");
        paymentWindow.postMessage(paymentData, paymentUrl); // Ensure it matches `event.origin`
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }, 2000);

    /* TODO: EVENT LISTENER */
    // Payment event handler
    const handlePaymentEvent = (event) => {
      console.log("Payment event received:", event);

      if (event.origin !== paymentUrl) return; // Security check

      console.log("Payment Response:", event.data);

      if (event.data.status === "success") {
        alert(
          `Payment successful! Transaction ID: ${event.data.transactionId}`
        );
        setIsCompleted(true);
      } else {
        alert("Payment failed or canceled.");
        setIsCancelled(true);
      }

      // Close the pop-up and clean up
      if (!paymentWindow.closed) {
        paymentWindow.close();
        console.log("Closing Payment Window...");
      }

      popUpWindowRef.current = null; // THIS EVENT SHOULD HELP RENDER THE APPROPRIATE MESSAGE
      window.removeEventListener("message", handlePaymentEvent); // Clean up listener
    };

    // Listen for response from the payment provider
    window.addEventListener("message", handlePaymentEvent);

    // Check if the window is closed
    // **Improved window closed detection**
    function checkIfClosed() {
      if (!popUpWindowRef.current) {
        // THE REF WILL NOT BE NULL TILL THE WINDOW IS CLOSED
        console.log("Payment window closed.");

        return true;
      }
      requestAnimationFrame(checkIfClosed); // Continue checking
    }

    requestAnimationFrame(checkIfClosed); // Start checking
  };

  async function handlePayment() {
    setIsLoading(true);
    /* MOBILE PAYMENT */
    if (selected == "mobile") {
      notify({
        title: "Mobile Payment",
        description: "Still under maintenance",
        color: "warning",
      });
      setIsLoading(false);
      return;
    }

    /* CARD PAYMENT */
    if (selected == "card") {
      // TODO: SEND TO PAYBOSS BACKEND

      // OPEN PAYMENT WINDOW
      const payload = {
        // FROM PAYBOSS BACKEND
        ...formData,
      };
      const transactionStatus = await openPaymentWindow(payload);

      // TODO: HANDLE PAYMENT RESPONSE
      setTimeout(() => setIsLoading(false), 2000);
      return;
    }
  }

  return (
    <>
      <Card
        className={cn(
          "border-1 px-1 py-2 pb-6 shadow-xl hover:shadow-2xl hover:shadow-primary/20 shadow-primary/10 transition-all duration-300 ease-in-out max-w-lg w-full mx-auto"
        )}
      >
        <HeroCardHeader className="flex-col items-start px-4 pb-0 pt-2">
          <h4 className="text-large font-bold">Checkout Payment </h4>
          <small className="text-default-500 text-xs">
            Verify payment details and proceed to make a payment
          </small>
        </HeroCardHeader>
        <CardBody className="overflow-visible gap-3 pb-0">
          <Table
            hideHeader
            removeWrapper
            isStriped
            aria-label="checkout-summary"
            radius="sm"
            // className="bg-red-500"
          >
            <TableHeader>
              <TableColumn>KEY</TableColumn>
              <TableColumn>VALUE</TableColumn>
            </TableHeader>
            <TableBody>
              {checkoutData?.logo && (
                <TableRow key="merchant-logo">
                  <TableCell colSpan={2} className="text-right font-bold">
                    <Logo
                      src={checkoutData?.logo}
                      className={"ml-auto -mr-4"}
                    />
                  </TableCell>
                </TableRow>
              )}
              <TableRow key="merchant-display-name">
                <TableCell className="">Payment To:</TableCell>
                <TableCell className="text-right font-bold">
                  {checkoutData?.displayName || "BGS PayBoss"}
                </TableCell>
              </TableRow>
              {checkoutData?.physicalAddress && (
                <TableRow key="physical-address">
                  <TableCell className="">Physical Address:</TableCell>
                  <TableCell className="text-right font-bold">
                    {checkoutData?.physicalAddress || "87A Kabulonga Rd."}
                  </TableCell>
                </TableRow>
              )}
              {checkoutData?.city && (
                <TableRow key="city-country">
                  <TableCell>CIty,Country</TableCell>
                  <TableCell className="text-right font-bold">
                    {checkoutData?.city || "Lusaka, ZM"}
                  </TableCell>
                </TableRow>
              )}

              <TableRow
                key="total-amount"
                className="h-12 bg-stone-100 !rounded-lg"
              >
                <TableCell className="font-bold">Total Amount</TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(checkoutData?.amount || "00")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex w-full flex-col h-full gap-2">
            <CardHeader
              title={"Payment Method"}
              infoText={
                "Select a payment method and provide payment information"
              }
              classNames={{
                infoClasses: "!text-xs xl:text-sm",
              }}
            />
            <Tabs
              aria-label="payment-methods"
              color="primary"
              radius="sm"
              size="lg"
              variant="bordered"
              className="max-w-lg w-full "
              classNames={{
                tabList: "w-full p-0.5 ",
              }}
              selectedKey={selected}
              onSelectionChange={(type) => {
                updateFormData({ type });
                setSelected(type);
                setIsCancelled(false);
                setIsCompleted(false);
                setError({ status: false, message: "" });
              }}
            >
              <Tab
                key="mobile"
                title={
                  <div className="flex items-center space-x-2">
                    <DevicePhoneMobileIcon className="h-5 w-5" />
                    <span>Mobile</span>
                  </div>
                }
                className="gap-2 flex flex-col"
              >
                <div className="relative flex flex-col">
                  <Input
                    required
                    placeholder={"Mobile Number"}
                    name={"phone"}
                    size="lg"
                    value={formData?.phone || ""}
                    onChange={(e) => {
                      handleChange(e);
                      checkOperator(e.target.value);
                    }}
                  />
                  <span className="absolute right-0 top-1 h-full w-28 px-4">
                    {Boolean(operatorLogo) && (
                      <Image
                        className="h-full w-full object-contain"
                        src={operatorLogo}
                        alt="logo"
                        width={80}
                        height={32}
                      />
                    )}
                  </span>
                  <small className="text-[12px] mt-1 ml-1 text-default-500">
                    E.g. 097XX/077XX/096XXX/095XX etc.
                  </small>
                </div>
                <Input
                  required
                  placeholder={"Reference"}
                  name={"reference"}
                  size="lg"
                  value={formData?.reference}
                  onChange={handleChange}
                />
              </Tab>

              <Tab
                key="card"
                title={
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-5 w-5" />
                    <span>Card</span>
                  </div>
                }
                className="gap-2  flex flex-col"
              >
                <div className="flex flex-col gap-3 my-1">
                  <div className="flex flex-col sm:flex-row flex-1 gap-2">
                    <Input
                      required
                      placeholder={"First Name"}
                      name={"firstName"}
                      value={formData?.firstName}
                      onChange={handleChange}
                    />
                    <Input
                      required
                      placeholder={"Last Name"}
                      name={"lastName"}
                      value={formData?.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    required
                    placeholder={"Email"}
                    name={"email"}
                    type={"email"}
                    size="lg"
                    value={formData?.email || ""}
                    onChange={handleChange}
                  />
                  <Input
                    required
                    placeholder={"Mobile Number"}
                    name={"phone"}
                    value={formData?.phone || ""}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                  />
                </div>
                <BankCard formData={formData} />
              </Tab>
            </Tabs>
          </div>
        </CardBody>
        <CardFooter className="w-full flex-col py-0 px-4">
          {(isCancelled || isCompleted) && (
            <div className="w-full flex items-center mb-3">
              {isCompleted && (
                <Alert
                  radius="sm"
                  color={"success"}
                  title={`This is an alert`}
                />
              )}
              {isCancelled && (
                <Alert
                  color={"danger"}
                  radius="sm"
                  title={`Transaction was cancelled/interrupted by user`}
                />
              )}
            </div>
          )}

          {!isCompleted && (
            <Button
              isLoading={isLoading}
              loadingText="Initializing..."
              onPress={handlePayment}
              className="w-full"
            >
              {selected == "mobile"
                ? "Pay via Mobile"
                : selected == "card"
                ? "Proceed to Payment"
                : "Pay Now"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* <TransactionPromptModal
        onOpen={onOpen}
        isOpen={isOpen}
        isCancelled={isCancelled}
        handleClose={onClose}
        onOpenChange={onOpenChange}
      /> */}
    </>
  );
}

function BankCard({ formData }) {
  return (
    <Card
      isBlurred
      className="max-w-md mx-8 my-2 bg-gradient-to-tr from-black to-blue-800 text-white"
      shadow="md"
    >
      <HeroCardHeader className="flex justify-between">
        <Logo isWhite />
        <Chip
          color="warning"
          variant="solid"
          className="bg-gradient-to-r  from-orange-400 via-orange-300 to-orange-400 "
          classNames={{
            content: "text-black font-bold",
          }}
        >
          GOLD
        </Chip>
      </HeroCardHeader>

      <CardBody>
        <div className="pb-2">
          <p className="text-small opacity-70">Card Number</p>
          <p className="text-xl tracking-widest">**** **** **** 4848</p>
        </div>

        <div className="flex justify-between pb-2">
          <div>
            <p className="text-small opacity-70">Card Holder</p>
            <p>
              {formData?.firstName || formData?.lastName
                ? `${formData?.firstName} ${formData?.lastName}`
                : "Full Name"}
            </p>
          </div>
          <div>
            <p className="text-small opacity-70">Expires</p>
            <p>XX/XX</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function TransactionPromptModal({
  isOpen,
  onOpenChange,
  handleClose,
  isCancelled,
}) {
  const handleCloseModal = () => {
    // Show transaction cancelled message
    handleClose();
    alert("Transaction was cancelled");
    // You could also use HeroUI's Alert component instead of a browser alert
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseModal();
          }
          onOpenChange(open);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Transaction Details</ModalHeader>
              <ModalBody>
                <p>Your transaction details here...</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel Transaction
                </Button>
                <Button color="primary" onPress={onClose}>
                  Complete Transaction
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
