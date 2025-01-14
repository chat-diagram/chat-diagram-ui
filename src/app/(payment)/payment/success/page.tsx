import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

interface PaymentSuccessProps {
  orderNumber?: string;
  amount?: number;
  membershipDuration?: number;
}

export default function PaymentSuccess({
  orderNumber = "20240113001",
  amount = 130.0,
  membershipDuration = 12,
}: PaymentSuccessProps) {
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
                <span className="font-medium">¥ {amount.toFixed(2)}</span>
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
            <Link href="/">返回首页</Link>
          </Button>
          {/* <Button asChild variant="outline" className="w-full py-6 text-lg">
            <Link href="/help">查看会员指南</Link>
          </Button> */}
        </div>
      </div>
    </div>
  );
}
