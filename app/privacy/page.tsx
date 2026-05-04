import Link from "next/link";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      body: "We collect your name and email address when you sign in with Google or Facebook. We collect content you voluntarily submit, including prayer requests, devotion journal entries, grace challenge responses, scripture notes, Bible 365 reading notes, nightly reflections, Heaven's Hearts memorials, and Grace Notes sent to other users. We also collect subscription and billing information processed through Stripe, and basic usage data through Google Analytics and Vercel Speed Insights.",
    },
    {
      title: "2. How We Use Your Information",
      body: "We use your information to provide and improve Guiding Grace, process your subscription, display your submitted content within the app to other users where applicable, deliver daily devotions and grace challenges, facilitate Grace Connections and Grace Notes between users, and send transactional emails related to your account. We do not use your information for advertising.",
    },
    {
      title: "3. Grace Connections & Grace Notes",
      body: "When you connect with another user through an invite link or through the Grace Challenge, both users' display names become visible to each other within the Connections feature. Grace Notes — prayers, scriptures, and encouragements — are visible only to the sender and recipient. We do not read, moderate, or share the contents of Grace Notes except where required by law or to investigate reported abuse.",
    },
    {
      title: "4. Invite Links",
      body: "Each user is assigned a personal invite code used to generate a shareable link. When someone signs up through your link, a connection is created between your accounts. The invite code itself does not contain personal information. We track how many times your invite link has been used for display purposes only.",
    },
    {
      title: "5. Community Content",
      body: "Content you post to shared features — including the P.U.S.H. Prayer Wall, Grace Challenge responses, and Study Groups — is visible to other subscribers. Your display name appears alongside your posts. Post only what you are comfortable sharing with the Guiding Grace community. Content in Heaven's Hearts memorials is visible to other subscribers unless otherwise indicated.",
    },
    {
      title: "6. Private Features",
      body: "The following features are private to your account only and are not visible to other users: Dive Deeper journal entries, Bible 365 reading notes, Nightly Reflections, and the Shame Recycle Bin. Content entered into the Shame Recycle Bin is not stored after submission.",
    },
    {
      title: "7. Data Storage",
      body: "Your data is stored securely using Supabase, a trusted cloud database provider based in the United States. Payment information is handled entirely by Stripe and is never stored on our servers. Your data is protected using industry-standard encryption.",
    },
    {
      title: "8. Sharing of Information",
      body: "We do not sell, rent, or share your personal information with third parties for marketing purposes. We share data only as necessary to operate the service: Stripe for payment processing, Supabase for data storage, Google and Facebook for authentication, and Vercel for hosting. We may disclose information if required by law or to protect the safety of our users.",
    },
    {
      title: "9. Facebook Login",
      body: "If you sign in with Facebook, we receive your name and email address from Facebook. We do not access your Facebook friends list, posts, or any other Facebook data unless you have explicitly granted permission through a future Friends feature. Your use of Facebook Login is also subject to Facebook's own Privacy Policy.",
    },
    {
      title: "10. Your Rights",
      body: "You may request deletion of your account and all associated data at any time through account settings or by emailing support@guidinggrace.app. We will process deletion requests within 30 days. You may also request a copy of your data by contacting us.",
    },
    {
      title: "11. Cookies",
      body: "Guiding Grace uses authentication cookies to keep you signed in. Google Analytics uses cookies to help us understand how the app is used. We do not use advertising or tracking cookies. You may disable cookies in your browser settings, though this may affect app functionality.",
    },
    {
      title: "12. Minors",
      body: "Guiding Grace is intended for users aged 16 and older. We do not knowingly collect personal information from children under 13. Users between the ages of 13 and 15 are not permitted to use this app. Users aged 16 or 17 may use the app with parental or guardian awareness. If you believe a minor under 13 has provided us with personal information, please contact us at support@guidinggrace.app and we will delete it promptly.",
    },
    {
      title: "13. Changes to This Policy",
      body: "We may update this Privacy Policy from time to time to reflect new features or legal requirements. Continued use of the app after changes constitutes acceptance of the updated policy. We will notify users of significant changes via email or in-app notice.",
    },
    {
      title: "14. Contact",
      body: "Questions about this Privacy Policy? Email us at support@guidinggrace.app.",
    },
  ];

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-700 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-purple-900 mt-6 mb-2">Privacy Policy</h1>
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
