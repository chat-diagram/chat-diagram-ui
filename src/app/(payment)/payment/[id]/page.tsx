"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUpdateSubscription } from "@/hooks/use-auth";
import { Payment, paymentApi } from "@/lib/api/payment";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentStatus() {
  const paymentId = useParams().id;
  const [newPayment, setNewPayment] = useState<Payment | null>(null);
  const [step, setStep] = useState<
    "redirect" | "confirm" | "success" | "failed"
  >("failed");

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
  const Redirect = () => {
    paymentApi.getPaymentDetail(paymentId).then((payment) => {
      if (payment.status === "pending") {
      }
      setNewPayment(payment);
      setStep("confirm");
    });
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">正在跳转到支付...</h2>
            <p className="text-sm text-muted-foreground">
              请稍候，正在为您准备支付环境
            </p>
          </div>
        </div>
      </div>
    );
  };
  const Loading = () => {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">正在确认支付结果...</h2>
        <p className="text-sm text-muted-foreground">
          请耐心等待，正在处理您的支付
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
            <h2 className="text-xl font-semibold">支付失败</h2>
            <p className="text-sm text-muted-foreground">
              请稍后再试，或联系客服
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
            <h1 className="text-3xl font-bold mb-2">支付成功</h1>
            <p className="text-gray-500">感谢您的订购！您的会员权益已经生效</p>
          </div>

          {/* Order Details Card */}
          <Card className="p-6 bg-background shadow-lg rounded-2xl space-y-4">
            <div className="space-y-4 divide-y">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>订单编号</span>
                  <span>{orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>支付金额</span>
                  <span className="font-medium">¥ {amount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>会员时长</span>
                  <span>{membershipDuration} 个月</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="font-medium">会员权益已激活</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>无限对话次数</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>GPT-4 模型支持</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>高级AI绘画功能</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">使用提示</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  您可以立即开始使用所有会员功能。如需帮助，请随时联系客服。
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
              <Link href="/">开始使用</Link>
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
