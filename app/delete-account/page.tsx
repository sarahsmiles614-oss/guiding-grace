import Link from "next/link";

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-700 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-purple-900 mt-6 mb-2">Request Account Deletion</h1>
        <p className="text-gray-500 text-sm mb-8">We're sorry to see you go. Your data matters to us and we will honor your request promptly.</p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-900 mb-2">What gets deleted</h2>
          <ul className="text-gray-600 leading-relaxed space-y-1 list-disc list-inside">
            <li>Your account and profile information</li>
            <li>Prayer requests you have posted</li>
            <li>Testimonies you have shared</li>
            <li>Grace challenge responses</li>
            <li>Memorials in Heaven's Hearts</li>
            <li>Saved favorites and streaks</li>
            <li>Subscription records (cancellation handled separately through Stripe)</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-900 mb-2">How to request deletion</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Send an email to <a href="mailto:support@guidinggrace.app" className="text-purple-700 underline">support@guidinggrace.app</a> with the subject line <strong>"Account Deletion Request"</strong> and include the email address associated with your account. We will process your request within 30 days.
          </p>
          <a
            href="mailto:support@guidinggrace.app?subject=Account%20Deletion%20Request"
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Send Deletion Request
          </a>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-900 mb-2">Data retention</h2>
          <p className="text-gray-600 leading-relaxed">
            Some anonymized data may be retained for up to 90 days for legal and fraud prevention purposes, after which it will be permanently deleted.
          </p>
        </div>

        <p className="text-gray-400 text-sm">
          Questions? Contact us at <a href="mailto:support@guidinggrace.app" className="text-purple-700 underline">support@guidinggrace.app</a>
        </p>
      </div>
    </main>
  );
}
