import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-700 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-purple-900 mt-6 mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: April 12, 2026</p>

        {[
          { title: "1. Acceptance of Terms", body: "By accessing or using Guiding Grace, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app." },
          { title: "2. Subscription & Billing", body: "Guiding Grace is a subscription service priced at $2.99/month or $29.99/year. A 3-day free trial is available with no credit card required. After the trial, billing begins automatically. You may cancel at any time through your account settings." },
          { title: "3. Use of the App", body: "Guiding Grace is intended for personal, non-commercial use. You agree not to misuse the platform, post harmful content, or attempt to circumvent subscription requirements." },
          { title: "4. User Content", body: "Content you submit (prayer requests, testimonies, challenge responses, memorials) remains yours. By submitting, you grant Guiding Grace a license to display that content within the app. We do not sell your content." },
          { title: "5. Privacy", body: "Your use of Guiding Grace is also governed by our Privacy Policy, which is incorporated into these Terms by reference." },
          { title: "6. Termination", body: "We reserve the right to suspend or terminate accounts that violate these Terms. You may delete your account at any time by contacting support." },
          { title: "7. Disclaimer", body: "Guiding Grace is provided as-is. We make no guarantees about uninterrupted access. The app is a faith companion tool and is not a substitute for professional counseling or pastoral care." },
          { title: "8. Contact", body: "Questions about these Terms? Email us at support@guidinggrace.app." },
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
