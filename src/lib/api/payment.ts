import { request } from "../request";

interface CreatePaymentRequest {
  method: "alipay" | "wechat";
  durationInDays: number;
}

export const paymentApi = {
  createPayment: (data: CreatePaymentRequest) =>
    request.post("/payments", data),
  getPaymentHistory: () => request.get("/payments"),
  getPaymentDetail: (id: string) => request.get(`/payments/${id}`),
};
