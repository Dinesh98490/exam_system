import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Payment } from "@/models/Payment";
import { ExamAccess } from "@/models/ExamAccess";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default async function PaymentStatus({
  searchParams,
}: {
  searchParams: Promise<{ status: string; examId: string; data?: string }>;
}) {
  const { status, examId, data } = await searchParams;
  const session = await getSession();

  if (!session) redirect("/login");

  await dbConnect();

  let message = "Processing payment...";
  let isSuccess = false;

  if (status === "failure") {
    message = "Payment Failed. Please try again.";
    // Ideally update payment record to failed if we had the txn ID,
    // but eSewa failure might not send the same data easily in V2 without decoding.
    // We can just show failure here.
  } else if (status === "success" && data) {
    // Decode data
    try {
      const decodedData = JSON.parse(
        Buffer.from(data, "base64").toString("utf-8")
      );
      /*
            decodedData = {
                "transaction_code": "...",
                "status": "COMPLETE",
                "total_amount": 100,
                "transaction_uuid": "...",
                "product_code": "EPAYTEST",
                "signed_field_names": "total_amount,transaction_uuid,product_code",
                "signature": "..."
            }
          */

      if (decodedData.status !== "COMPLETE") {
        throw new Error("Transaction not complete");
      }

      const transactionId = decodedData.transaction_uuid;

      // Find and Update Payment
      const payment = await Payment.findOne({ transactionId });

      if (payment) {
        if (payment.status !== "SUCCESS") {
          payment.status = "SUCCESS";
          await payment.save();

          // Grant Access
          await ExamAccess.create({
            userId: session.userId,
            examId: examId, // or payment.examId
          });
        }
        isSuccess = true;
        message = "Payment Successful! You have unlocked the exam.";
      } else {
        message = "Payment record not found.";
      }
    } catch (e) {
      console.error("Payment Verification Failed", e);
      message = "Payment verification failed.";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
        </div>

        <h1 className="text-xl font-bold mb-2">
          {isSuccess ? "Payment Successful" : "Payment Failed"}
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="space-y-3">
          {isSuccess ? (
            <Link
              href="/dashboard/student"
              className="block w-full bg-blue-900 text-white py-2 rounded font-medium hover:bg-blue-800"
            >
              Return to Dashboard
            </Link>
          ) : (
            <Link
              href="/dashboard/student"
              className="block w-full bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300"
            >
              Cancel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
