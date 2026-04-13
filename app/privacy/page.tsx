import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-700 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-purple-900 mt-6 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: April 12, 2026</p>

        {[
          { title: "1. Information We Collect", body: "We collect your name and email address when you sign in with Google. We collect content you voluntarily submit including prayer requests, testimonies, challenge responses, and memorials. We also collect subscription and billing information processed through Stripe." },
          { title: "2. How We Use Your Information", body: "We use your information to provide and improve Guiding Grace, process your subscription, display your submitted content within the app, and send transactional emails related to your account." },
          { title: "3. Data Storage", body: "Your data is stored securely using Supabase, a trusted cloud database provider. Payment information is handled entirely by Stripe and is never stored on our servers." },
          { title: "4. Sharing of Information", body: "We do not sell, rent, or share your personal information with third parties for marketing purposes. We share data only as necessary to operate the service (e.g., Stripe for payments, Supabase for storage)." },
          { title: "5. Community Content", body: "Content you post to shared features (prayer wall, testimony wall, grace challenge, memorials) is visible to other subscribers. Post only what you are comfortable sharing with the Guiding Grace community." },
          { title: "6. Your Rights", body: "You may request deletion of your account and associated data at any time by emailing support@guidinggrace.app. We will process deletion requests within 30 days." },
          { title: "7. Cookies", body: "Guiding Grace uses authentication cookies to keep you signed in. We do not use advertising or tracking cookies." },
          { title: "8. Children", body: "Guiding Grace is not intended for children under 13. We do not knowingly collect data from children under 13." },
          { title: "9. Changes to This Policy", body: "We may update this Privacy Policy from time to time. Continued use of the app after changes constitutes acceptance of the updated policy." },
          { title: "10. Contact", body: "Questions about this Privacy Policy? Email us at support@guidinggrace.app." },
        ].map(s => (
          <div key={s.title} className="mb-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">{s.title}</h2>
            <p className="text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
