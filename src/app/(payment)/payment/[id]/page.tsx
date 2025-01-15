"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUpdateSubscription } from "@/hooks/use-auth";
import { useI18n } from "@/i18n";
import { Payment, paymentApi } from "@/lib/api/payment";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentStatus() {
  const t = useI18n();
  const paymentId = useParams().id;
  const [newPayment, setNewPayment] = useState<Payment | null>(null);
  const [step, setStep] = useState<
    "redirect" | "confirm" | "success" | "failed"
  >("confirm");

  const { mutate: updateSubscription } = useUpdateSubscription();
  const getNewPaymentStatus = async (newPayment: Payment) => {
    if (!newPayment) return null;
    const payment = await paymentApi.getPaymentDetail(newPayment.id);
    console.log("payment", payment);
    return payment.status;
  };

  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    paymentApi.getPaymentDetail(paymentId).then((payment) => {
      console.log("获取到payment", payment);
      //   if (payment.status === "pending") {
      //   }
      setNewPayment(payment);
      startConfirm(payment);
      //   message.success("第一次获取详情成功");。
      //   setStep("confirm");
    });
    const startConfirm = (payment: Payment) => {
      console.log("startconfirm");
      const checkPaymentStatus = async () => {
        //   if (!newPayment) return;
        console.log("123", newPayment);

        const status = await getNewPaymentStatus(payment);
        console.log("status", status);
        if (status === "success") {
          console.log("success");
          setStep("success");
          clearInterval(timer!);
          timer = null;
          updateSubscription();
        } else if (status === "failed") {
          console.log("failed");
          setStep("failed");
          clearInterval(timer!);
        } else if (status === "pending") {
          console.log("pending");
          // todo 处理支付中情况
        }
      };

      // 每3秒检查一次支付状态
      timer = setInterval(checkPaymentStatus, 3000);

      // 5分钟后停止轮询
      setTimeout(() => {
        clearInterval(timer);
      }, 5 * 60 * 1000);

      return () => {
        clearInterval(timer);
      };
    };
    // startConfirm();
  }, []);
  //   useEffect(() => {

  //   }, [paymentId, startConfirm]);

  //   startConfirm();
  //   useEffect(() => {
  //     if (step === "success") {
  //       updateSubscription();
  //     }
  //   }, [newPayment]);
  const Loading = () => {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">{t("payment.confirmPayment")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("payment.confirmPaymentDesc")}
        </p>
      </div>
    );
  };
  function PaymentFailed() {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <X className="h-10 w-10 mx-auto text-red-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{t("payment.payFailed")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("payment.payFailedDesc")}
            </p>
          </div>
        </div>
      </div>
    );
  }
  function PaymentSuccess({ payment }: { payment: Payment | null }) {
    if (!payment) return null;
    const orderNumber = payment.id;
    const amount = (payment.amount / 100).toFixed(2);
    const membershipDuration = payment.durationInDays;
    // updateSubscription();

    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          {/* Success Animation */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {t("payment.paySuccess")}
            </h1>
            <p className="text-gray-500">{t("payment.paySuccessDesc")}</p>
          </div>

          {/* Order Details Card */}
          <Card className="p-6 bg-background shadow-lg rounded-2xl space-y-4">
            <div className="space-y-4 divide-y">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t("payment.orderNumber")}</span>
                  <span>{orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t("payment.amount")}</span>
                  <span className="font-medium">¥ {amount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t("payment.membershipDuration")}</span>
                  <span>
                    {membershipDuration}{" "}
                    {t("payment.monthUnit", { count: membershipDuration })}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="font-medium">
                  {t("payment.membershipBenefitsHasBeenActivated")}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>{t("payment.unlimitedDiagrams")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>{t("payment.unlimitedOptimize")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>{t("payment.advancedStyle")}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">
                  {t("payment.useTipsTitle")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("payment.useTipsDesc")}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-black hover:bg-gray-800 text-lg py-6 dark:bg-white "
            >
              <Link href="/">{t("payment.useTipsBtn")}</Link>
            </Button>
            {/* <Button asChild variant="outline" className="w-full py-6 text-lg">
              <Link href="/help">查看会员指南</Link>
            </Button> */}
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* {step === "redirect" && <Redirect />} */}
      {step === "confirm" && <Loading />}
      {step === "success" && <PaymentSuccess payment={newPayment} />}
      {step === "failed" && <PaymentFailed />}
    </>
  );
}
