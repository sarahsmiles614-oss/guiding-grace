"use client";
import { useState } from "react";
import Link from "next/link";

export default function DeleteDataPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  function handleSubmit() {
    if (!email) return;
    const subject = encodeURIComponent("Data Deletion Request — Guiding Grace");
    const body = encodeURIComponent(`Hello,\n\nI would like to request deletion of my personal data from Guiding Grace.\n\nEmail address on my account: ${email}\n\nPlease delete all data associated with my account including my profile, posts, journal entries, grace notes, connections, and any other stored information.\n\nThank you.`);
    window.location.href = `mailto:support@guidinggrace.app?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-purple-700 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-purple-900 mt-6 mb-2">Request Data Deletion</h1>
        <p className="text-gray-500 text-sm mb-8">
          You can request deletion of your personal data without deleting your account. We will process your request within 30 days and confirm by email.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <p className="text-green-700 font-semibold mb-1">Request Sent</p>
            <p className="text-green-600 text-sm">We received your request and will process it within 30 days.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-medium block mb-1">Email address on your account</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-500 text-xs leading-relaxed">
              <p className="font-semibold text-gray-600 mb-1">What will be deleted:</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Your profile and account information</li>
                <li>Prayer wall posts</li>
                <li>Grace Challenge responses and votes</li>
                <li>Grace Notes sent and received</li>
                <li>Grace Connections</li>
                <li>Dive Deeper journal entries</li>
                <li>Bible 365 reading progress and notes</li>
                <li>Nightly Reflections</li>
                <li>Heaven's Hearts memorials</li>
                <li>Saved scripture favorites</li>
              </ul>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!email}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40"
            >
              Submit Deletion Request
            </button>

            <p className="text-gray-400 text-xs text-center">
              Want to delete your account entirely instead?{" "}
              <Link href="/delete-account" className="text-purple-600 hover:underline">Delete account</Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
