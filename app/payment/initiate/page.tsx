import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Payment } from "@/models/Payment";
import { Exam } from "@/models/Exam";
import { redirect } from "next/navigation";
import {
  generateEsewaSignature,
  ESEWA_TEST_PID,
  ESEWA_URL,
} from "@/lib/payment/esewa";
import { v4 as uuidv4 } from "uuid";

export default async function InitiatePayment({
  searchParams,
}: {
  searchParams: Promise<{ examId: string }>;
}) {
  const { examId } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect(`/login?returnUrl=/payment/initiate?examId=${examId}`);
  }

  if (!examId) {
    return <div>Invalid Exam ID</div>;
  }

  await dbConnect();
  const exam = await Exam.findById(examId);

  if (!exam) {
    return <div>Exam not found</div>;
  }

  const transactionUuid = `TXN-${uuidv4().split("-")[0].toUpperCase()}`;
  const amount = exam.price.toString();
  const productCode = ESEWA_TEST_PID;

  // Create Pending Payment Record using Mongoose
  await Payment.create({
    userId: session.userId,
    examId: examId,
    amount: exam.price,
    transactionId: transactionUuid,
    status: "PENDING",
    provider: "ESEWA",
  });

  const signature = generateEsewaSignature(
    amount,
    transactionUuid,
    productCode
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h1 className="text-xl font-bold mb-4">Confirm Payment</h1>
        <p className="mb-2">
          Exam: <span className="font-semibold">{exam.title}</span>
        </p>
        <p className="mb-6">
          Amount:{" "}
          <span className="font-semibold text-green-600">NPR {exam.price}</span>
        </p>

        <form action={ESEWA_URL} method="POST">
          <input type="hidden" name="amount" value={amount} />
          <input type="hidden" name="tax_amount" value="0" />
          <input type="hidden" name="total_amount" value={amount} />
          <input
            type="hidden"
            name="transaction_uuid"
            value={transactionUuid}
          />
          <input type="hidden" name="product_code" value={productCode} />
          <input type="hidden" name="product_service_charge" value="0" />
          <input type="hidden" name="product_delivery_charge" value="0" />
          <input
            type="hidden"
            name="success_url"
            value={`http://localhost:3000/payment/status?status=success&examId=${examId}`}
          />
          <input
            type="hidden"
            name="failure_url"
            value={`http://localhost:3000/payment/status?status=failure&examId=${examId}`}
          />
          <input
            type="hidden"
            name="signed_field_names"
            value="total_amount,transaction_uuid,product_code"
          />
          <input type="hidden" name="signature" value={signature} />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition"
          >
            Pay with eSewa
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4">
          You will be redirected to eSewa to complete payment.
        </p>
      </div>
    </div>
  );
}
