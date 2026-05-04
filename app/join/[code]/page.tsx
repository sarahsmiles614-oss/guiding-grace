import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg";

export default async function JoinPage({ params }: { params: { code: string } }) {
  const { data: invite } = await supabase
    .from("invite_codes")
    .select("user_id, used_count")
    .eq("code", params.code)
    .single();

  if (!invite) redirect("/");

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('${BG}')` }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 text-center">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-3">You've been invited</p>
        <h1 className="text-3xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
          Join Guiding Grace
        </h1>
        <p className="text-white/70 text-sm mb-8 leading-relaxed" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
          A friend invited you to walk alongside them in faith — daily devotions, grace challenges, prayer, and more.
        </p>

        <Link href={`/subscribe?invite=${params.code}`}>
          <button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-2xl mb-3 transition">
            ✨ Start Free Trial — Join Your Friend
          </button>
        </Link>
        <Link href={`/?invite=${params.code}`}>
          <button className="w-full text-white/50 hover:text-white text-sm py-2 transition">
            Already have an account? Sign in
          </button>
        </Link>
      </div>
    </div>
  );
}
