import { request } from "../request";

interface CreatePaymentRequest {
  method: "alipay" | "wechat";
  durationInDays: number;
}
type PaymentMethod = "alipay" | "wechat";
type PaymentStatus = "success" | "pending" | "failed";

export interface Payment {
  id: string;
  userId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  durationInDays: number;
  amount: number;
  tradeNo: string;
  outTradeNo: string;
  paidAt: string;
  payUrl: string;
}

type PaymentHistoryResponse = Payment[];

// const baseUrl = "https://chat-api.ioa.tech";
const baseUrl = "";
// if (process.env.NODE_ENV === "development") {
//   baseUrl = "https://chat-api.ioa.tech";
// }

export const paymentApi = {
  createPayment: (data: CreatePaymentRequest) =>
    request.post<Payment>(`${baseUrl}/payments`, data),
  getPaymentHistory: () =>
    request.get<PaymentHistoryResponse[]>(`${baseUrl}/payments`),
  getPaymentDetail: (id: string) => request.get(`${baseUrl}/payments/${id}`),
};
