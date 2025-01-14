"use client";
// import "../(main)/globals.css";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Flame } from "lucide-react";
import { AlipayCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useUpdateSubscription } from "@/hooks/use-auth";

export default function Payment() {
  const [selectedDuration, setSelectedDuration] = useState(12);
  const [selectedPayment, setSelectedPayment] = useState("alipay");

  const durations = [
    { months: 1, price: 10 },
    { months: 3, price: 30 },
    { months: 6, price: 50, recommended: true },
    { months: 12, price: 90, recommended: true },
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
  const router = useRouter();

  const { mutate: updateSubscription } = useUpdateSubscription();

  const handlePayment = async () => {
    // todo 调用支付接口
    // const res = await paymentApi.createPayment({
    //   method: "alipay",
    //   durationInDays: selectedDuration * 30,
    // });
    // const res =
    await true;
    updateSubscription();

    // const res = await true;

    router.push("/payment/success");
  };

  return (
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
                variant={selectedDuration === months ? "default" : "outline"}
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
  );
}
