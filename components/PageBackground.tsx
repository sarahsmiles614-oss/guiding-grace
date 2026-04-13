export default function PageBackground({ url, children, overlay = "bg-black/40" }: { url: string; children: React.ReactNode; overlay?: string }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url('${url}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className={`min-h-screen flex flex-col ${overlay}`}>
        {children}
      </div>
    </div>
  );
}
