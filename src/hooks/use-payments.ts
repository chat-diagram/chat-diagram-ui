import { paymentApi } from "@/lib/api/payment";
import { useQuery } from "@tanstack/react-query";

export const usePaymentsHistory = () => {
  return useQuery({
    queryKey: ["payments-history"],
    queryFn: paymentApi.getPaymentHistory,
  });
};

export const usePaymentDetail = (id: string) => {
  return useQuery({
    queryKey: ["payment-detail", id],
    enabled: !!id,
    queryFn: () => paymentApi.getPaymentDetail(id),
  });
};
