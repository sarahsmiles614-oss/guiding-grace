export default function PageBackground({ url, children, overlay = "bg-black/40", overlayOpacity, bgSize = "cover", bgPosition = "center", bgColor = "transparent" }: { url: string; children: React.ReactNode; overlay?: string; overlayOpacity?: number; bgSize?: string; bgPosition?: string; bgColor?: string }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url('${url}')`, backgroundSize: bgSize, backgroundPosition: bgPosition, backgroundAttachment: "fixed", backgroundRepeat: "no-repeat", backgroundColor: bgColor }}>
      <div
        className={`min-h-screen flex flex-col ${overlayOpacity === undefined ? overlay : ""}`}
        style={overlayOpacity !== undefined ? { backgroundColor: `rgba(0,0,0,${overlayOpacity})` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
