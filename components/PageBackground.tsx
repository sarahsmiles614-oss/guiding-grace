export default function PageBackground({ url, children, overlay = "bg-black/25", overlayOpacity, bgSize = "cover", bgPosition = "center", bgColor = "transparent" }: { url: string; children: React.ReactNode; overlay?: string; overlayOpacity?: number; bgSize?: string; bgPosition?: string; bgColor?: string }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Fixed background — covers full screen on every device */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url('${url}')`,
          backgroundSize: "cover",
          backgroundPosition: bgPosition,
          backgroundRepeat: "no-repeat",
          backgroundColor: bgColor,
          zIndex: 0,
        }}
      />
      {/* Overlay */}
      <div
        className={`fixed inset-0 ${overlayOpacity === undefined ? overlay : ""}`}
        style={{ zIndex: 1, ...(overlayOpacity !== undefined ? { backgroundColor: `rgba(0,0,0,${overlayOpacity})` } : {}) }}
      />
      {/* Content */}
      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
