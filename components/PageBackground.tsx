export default function PageBackground({ url, children, overlay = "bg-black/40", bgSize = "cover", bgPosition = "center", bgColor = "transparent" }: { url: string; children: React.ReactNode; overlay?: string; bgSize?: string; bgPosition?: string; bgColor?: string }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url('${url}')`, backgroundSize: bgSize, backgroundPosition: bgPosition, backgroundAttachment: "fixed", backgroundRepeat: "no-repeat", backgroundColor: bgColor }}>
      <div className={`min-h-screen flex flex-col ${overlay}`}>
        {children}
      </div>
    </div>
  );
}
