"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Receipt } from "lucide-react";
import { useAppStore } from "@/store/app";
import Link from "next/link";
import { usePaymentsHistory } from "@/hooks/use-payments";
import { paymentApi } from "@/lib/api/payment";

interface Order {
  id: string;
  date: string;
  amount: number;
  status: "成功" | "处理中" | "失败";
  plan: string;
}

const orders: Order[] = [
  {
    id: "INV-001",
    date: "2024-01-13",
    amount: 130.0,
    status: "成功",
    plan: "年度会员",
  },
  {
    id: "INV-002",
    date: "2023-12-15",
    amount: 36.0,
    status: "成功",
    plan: "季度会员",
  },
  {
    id: "INV-003",
    date: "2023-11-01",
    amount: 12.0,
    status: "成功",
    plan: "月度会员",
  },
  {
    id: "INV-004",
    date: "2023-10-05",
    amount: 72.0,
    status: "失败",
    plan: "半年会员",
  },
  {
    id: "INV-005",
    date: "2023-09-20",
    amount: 12.0,
    status: "成功",
    plan: "月度会员",
  },
];

function EmptyState() {
  return (
    <div className="text-center py-12 bg-background">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Receipt className="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">暂无账单记录</h3>
      <p className="text-gray-500 mb-6">
        您还没有任何交易记录。开始使用我们的服务，账单将会在这里显示。
      </p>
      <Button asChild>
        <Link href="/payment">查看会员方案</Link>
      </Button>
    </div>
  );
}

export default function BillingHistory() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const isPro = useAppStore((state) => state.user?.subscription?.isPro);
  if (!isPro) {
    orders.length = 0;
  }
  const { data: paymentHistory = [], isLoading, error } = usePaymentsHistory();

  // const selectedOrderId = useState;
  // const { data: paymentDetail } = usePaymentDetail(selectedOrder?.id);
  const handleGetOrderDetail = async (order: Order) => {
    const detail = await paymentApi.getPaymentDetail(order.id);
    setSelectedOrder(detail);
  };
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">账单记录</h1>
          <p className="text-gray-500 dark:text-gray-400">
            查看您的所有交易记录和订单详情
          </p>
        </div>

        <Card className="p-6 bg-background shadow-lg rounded-2xl">
          {paymentHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单编号</TableHead>
                  <TableHead>支付日期</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>计划</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{formatDateTime(order.paidAt)}</TableCell>
                    <TableCell>¥ {(order.amount / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "success"
                            ? "success"
                            : order.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.durationInDays}天</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                            onClick={() => {
                              // setSelectedOrder(order);
                              handleGetOrderDetail(order);
                            }}
                          >
                            详情 <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              订单详情 - {selectedOrder?.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="flex justify-between">
                              <span className="text-gray-500">支付日期</span>
                              <span>
                                {formatDateTime(selectedOrder?.paidAt)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">金额</span>
                              <span>
                                ¥ {(selectedOrder?.amount / 100).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">状态</span>
                              <Badge
                                variant={
                                  selectedOrder?.status === "success"
                                    ? "success"
                                    : selectedOrder?.status === "pending"
                                    ? "outline"
                                    : "destructive"
                                }
                              >
                                {selectedOrder?.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">计划</span>
                              <span>{selectedOrder?.plan}</span>
                            </div>
                          </div>
                          {/* <Button className="mt-6 w-full">
                            <Download className="mr-2 h-4 w-4" /> 下载发票
                          </Button> */}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState />
          )}
        </Card>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>如果您有任何问题或需要帮助，请联系我们的客户支持团队。</p>
          {/* todo */}
          <p>邮箱: xxxxx@chatdiagram.com | 电话: xxxxx</p>
        </div>
      </div>
    </div>
  );
}
