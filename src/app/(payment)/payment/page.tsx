"use client";
// import "../(main)/globals.css";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Flame, Loader2 } from "lucide-react";
import { AlipayCircleOutlined } from "@ant-design/icons";
import { Payment, paymentApi } from "@/lib/api/payment";
import { useRouter } from "next/navigation";

// function PaymentSuccess({ payment }: { payment: Payment | null }) {
//   if (!payment) return null;
//   const orderNumber = payment.id;
//   const amount = (payment.amount / 100).toFixed(2);
//   const membershipDuration = payment.durationInDays;

//   return (
//     <div className="min-h-screen bg-background p-6 flex items-center justify-center">
//       <div className="max-w-md w-full space-y-8">
//         {/* Success Animation */}
//         <div className="text-center">
//           <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
//             <Check className="w-12 h-12 text-green-600" />
//           </div>
//           <h1 className="text-3xl font-bold mb-2">支付成功</h1>
//           <p className="text-gray-500">感谢您的订购！您的会员权益已经生效</p>
//         </div>

//         {/* Order Details Card */}
//         <Card className="p-6 bg-background shadow-lg rounded-2xl space-y-4">
//           <div className="space-y-4 divide-y">
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
//                 <span>订单编号</span>
//                 <span>{orderNumber}</span>
//               </div>
//               <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
//                 <span>支付金额</span>
//                 <span className="font-medium">¥ {amount}</span>
//               </div>
//               <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
//                 <span>会员时长</span>
//                 <span>{membershipDuration} 个月</span>
//               </div>
//             </div>

//             <div className="pt-4 space-y-2">
//               <h3 className="font-medium">会员权益已激活</h3>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                   <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
//                     <Check className="w-2.5 h-2.5 text-white" />
//                   </div>
//                   <span>无限对话次数</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                   <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
//                     <Check className="w-2.5 h-2.5 text-white" />
//                   </div>
//                   <span>GPT-4 模型支持</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                   <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
//                     <Check className="w-2.5 h-2.5 text-white" />
//                   </div>
//                   <span>高级AI绘画功能</span>
//                 </div>
//               </div>
//             </div>

//             <div className="pt-4">
//               <h3 className="font-medium mb-2">使用提示</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 您可以立即开始使用所有会员功能。如需帮助，请随时联系客服。
//               </p>
//             </div>
//           </div>
//         </Card>

//         {/* Action Buttons */}
//         <div className="space-y-4">
//           <Button
//             asChild
//             className="w-full bg-black hover:bg-gray-800 text-lg py-6 dark:bg-white "
//           >
//             <Link href="/">开始使用</Link>
//           </Button>
//           {/* <Button asChild variant="outline" className="w-full py-6 text-lg">
//             <Link href="/help">查看会员指南</Link>
//           </Button> */}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function PaymentPage() {
  const [newPayment, setNewPayment] = useState<Payment | null>(null);
  const [step, setStep] = useState<"pay" | "redirect" | "confirm" | "success">(
    "pay"
  );
  const router = useRouter();

  const Redirect = () => {
    useEffect(() => {
      router.push(newPayment.payUrl);
    }, [newPayment]);
    // if (!newPayment) return null;
    // router.push(newPayment.payUrl,{n});
    // setTimeout(() => {
    // window.open(newPayment.payUrl, "_blank");
    // console.log("newPayment.payUrl", newPayment.payUrl);
    // setStep("confirm");
    // }, 1000);
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
  // const Loading = () => {
  //   // const paymentStatus =
  //   const getNewPaymentStatus = async () => {
  //     if (!newPayment) return null;
  //     const payment = await paymentApi.getPaymentDetail(newPayment.id);
  //     return payment.status;
  //   };
  //   useEffect(() => {
  //     let timer: NodeJS.Timeout | null = null;
  //     const checkPaymentStatus = async () => {
  //       if (!newPayment) return;

  //       const status = await getNewPaymentStatus();
  //       if (status === "success") {
  //         setStep("success");
  //         clearInterval(timer!);
  //       } else if (status === "failed") {
  //         // todo 处理支付失败情况
  //         clearInterval(timer!);
  //       }
  //     };

  //     // 每3秒检查一次支付状态
  //     timer = setInterval(checkPaymentStatus, 3000);

  //     // 5分钟后停止轮询
  //     setTimeout(() => {
  //       clearInterval(timer);
  //     }, 5 * 60 * 1000);

  //     return () => {
  //       clearInterval(timer);
  //     };
  //   }, [newPayment]);
  //   return (
  //     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
  //       <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
  //       <h2 className="text-xl font-semibold">正在确认支付结果...</h2>
  //       <p className="text-sm text-muted-foreground">
  //         请耐心等待，正在处理您的支付
  //       </p>
  //     </div>
  //   );
  // };
  // const [step, setStep] = useState<"pay" | "redirect" | "confirm" | "success">(
  //   "pay"
  // );

  const [selectedDuration, setSelectedDuration] = useState(12);
  const [selectedPayment, setSelectedPayment] = useState("alipay");

  const durations = [
    { months: 1, price: 12 },
    { months: 3, price: 36 },
    { months: 6, price: 60, recommended: true },
    { months: 12, price: 120, recommended: true },
  ];

  const benefits = [
    [
      "无限对话次数",
      "无限项目",

      //  "GPT-4 模型支持",
    ],
    ["无限优化描述", "高级样式配置"],

    // ["流程图生成", "思维导图生成", "自定义提示词"],
    [
      // "API 访问支持",
      //  "团队协作功能",
      "优先客服支持",
    ],
  ];

  const selectedPlan = durations.find((d) => d.months === selectedDuration);
  const monthlyPrice = selectedPlan
    ? (selectedPlan.price / selectedPlan.months).toFixed(2)
    : "12.00";

  // const { mutate: updateSubscription } = useUpdateSubscription();

  const handlePayment = async () => {
    const payment = await paymentApi.createPayment({
      method: "alipay",
      durationInDays: selectedDuration * 30,
    });
    // router.push(`/payment/${payment.id}`);
    setNewPayment(payment);
    setStep("redirect");
  };

  return (
    <>
      {step === "pay" && (
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Membership Plans</h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                选择适合您的会员计划，享受更多AI智能服务
              </p>
            </div>

            {/* Price Display */}
            <Card className="p-8 text-center bg-background shadow-lg rounded-2xl">
              <div className="space-y-4">
                <h2 className="text-xl font-medium">Starting at</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl">¥</span>
                  <span className="text-6xl font-bold">{monthlyPrice}</span>
                  <span className="text-xl text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                {/* <p className="text-gray-500">Includes a 7-day free trial</p> */}
              </div>

              {/* Duration Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {durations.map(({ months, recommended }) => (
                  <Button
                    key={months}
                    variant={
                      selectedDuration === months ? "default" : "outline"
                    }
                    className={`h-auto py-3 relative ${
                      selectedDuration === months
                        ? "bg-black hover:bg-gray-800 dark:bg-white "
                        : ""
                    }`}
                    onClick={() => setSelectedDuration(months)}
                  >
                    {months}个月
                    {recommended && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-500">
                        <Flame className="w-3 h-3 mr-1" />
                        优惠
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Benefits */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">会员权益</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((columnBenefits, i) => (
                  <div key={i} className="space-y-4">
                    {columnBenefits.map((benefit, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <Card className="p-6 bg-background shadow-lg rounded-2xl">
              <h3 className="text-lg font-medium mb-4">选择支付方式</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={selectedPayment === "alipay" ? "default" : "outline"}
                  className={`h-auto py-3 ${
                    selectedPayment === "alipay"
                      ? "bg-black hover:bg-gray-800 dark:bg-white "
                      : ""
                  }`}
                  onClick={() => setSelectedPayment("alipay")}
                >
                  <AlipayCircleOutlined />
                  支付宝
                </Button>
                {/* <Button
              variant={selectedPayment === "wechat" ? "default" : "outline"}
              className={`h-auto py-3 ${
                selectedPayment === "wechat" ? "bg-black hover:bg-gray-800" : ""
              }`}
              onClick={() => setSelectedPayment("wechat")}
            >
              <WechatOutlined />
              微信支付
            </Button> */}
              </div>
            </Card>

            {/* Purchase Summary */}
            <Card className="p-6 bg-background shadow-lg rounded-2xl">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>商品名称</span>
                  <span>chat-diagram Pro({selectedDuration}个月)</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>需要支付</span>
                  <span>¥ {selectedPlan?.price.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Button
              className="w-full bg-black hover:bg-gray-800 text-lg py-6 dark:bg-white "
              onClick={handlePayment}
            >
              立即开通
            </Button>
          </div>
        </div>
      )}
      {step === "redirect" && <Redirect />}
      {/* {step === "confirm" && <Loading />} */}
      {/* {step === "success" && <PaymentSuccess payment={newPayment} />} */}
    </>
  );
}
