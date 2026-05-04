import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing or using Guiding Grace, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app. These Terms apply to all features of Guiding Grace including Daily Devotions, Grace Challenge, His Promises, Dive Deeper, Bible 365, P.U.S.H. Prayer Wall, Heaven's Hearts, Nightly Reflections, Heroes & Villains, Shame Recycle Bin, Scripture Match, Study Groups, Grace Connections, and Grace Notes.",
    },
    {
      title: "2. Subscription & Billing",
      body: "Guiding Grace is a subscription service priced at $2.99/month or $29.99/year. A free 3-day trial is available with no credit card required. After the trial, billing begins automatically. You may cancel at any time through your account settings. Refunds are not provided for partial billing periods.",
    },
    {
      title: "3. Use of the App",
      body: "Guiding Grace is intended for personal, non-commercial use as a faith companion. You agree not to misuse the platform, post harmful or offensive content, harass other users, or attempt to circumvent subscription requirements. All community features — including the Prayer Wall, Grace Challenge, Grace Connections, and Grace Notes — are to be used with respect, grace, and Christian integrity.",
    },
    {
      title: "4. User Content",
      body: "Content you submit — including prayer requests, devotion journals, challenge responses, scripture notes, memorials in Heaven's Hearts, reflections, and Grace Notes — remains yours. By submitting content, you grant Guiding Grace a license to display that content within the app to other users where applicable. We do not sell your content to third parties.",
    },
    {
      title: "5. Grace Connections & Grace Notes",
      body: "Grace Connections allows users to connect with one another through invite links or through the Grace Challenge community. Grace Notes are one-way faith messages (prayer, scripture, or encouragement) sent between connected users. Grace Notes are not a general messaging service. Users agree to use Grace Notes solely for faith-based encouragement and to treat all connections with dignity and respect. Misuse of these features — including harassment, solicitation, or inappropriate content — may result in account termination.",
    },
    {
      title: "6. Invite Links",
      body: "Each user is issued a personal invite link to share with friends. When a friend signs up through your invite link, you are automatically connected on the platform. Invite links may not be publicly broadcast, sold, or used for spam. Guiding Grace reserves the right to revoke invite links that are misused.",
    },
    {
      title: "7. Community Standards",
      body: "All content posted to shared features must be appropriate for a Christian faith community. Content that is discriminatory, sexually explicit, abusive, politically inflammatory, or otherwise harmful is prohibited. Guiding Grace reserves the right to remove any content and suspend or terminate any account that violates these standards.",
    },
    {
      title: "8. Heaven's Hearts",
      body: "Heaven's Hearts is a sacred space to honor and memorialize loved ones who have passed. Users may customize their memorial pages with backgrounds and fonts. Content in Heaven's Hearts must be respectful and appropriate. Guiding Grace is not responsible for the accuracy of memorial information submitted by users.",
    },
    {
      title: "9. Shame Recycle Bin",
      body: "The Shame Recycle Bin is a private, one-directional feature where users write what they wish to release and give to God. Content entered into this feature is not stored permanently and is not shared with other users. This feature is a spiritual tool and is not a substitute for professional mental health support.",
    },
    {
      title: "10. Termination",
      body: "We reserve the right to suspend or terminate accounts that violate these Terms at any time without notice. You may delete your account at any time through account settings or by contacting support@guidinggrace.app.",
    },
    {
      title: "11. Disclaimer",
      body: "Guiding Grace is provided as-is. We make no guarantees about uninterrupted access or the accuracy of AI-generated devotional content. Guiding Grace is a faith companion tool and is not a substitute for professional counseling, pastoral care, or medical advice.",
    },
    {
      title: "12. Changes to Terms",
      body: "We may update these Terms from time to time. Continued use of the app after changes constitutes acceptance of the updated Terms. We will notify users of significant changes via email or in-app notice.",
    },
    {
      title: "13. Contact",
      body: "Questions about these Terms? Email us at support@guidinggrace.app.",
    },
  ];

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-700 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-purple-900 mt-6 mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: May 4, 2026</p>
        {sections.map(s => (
          <div key={s.title} className="mb-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">{s.title}</h2>
            <p className="text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
