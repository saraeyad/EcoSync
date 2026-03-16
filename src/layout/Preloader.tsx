export function Preloader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "3px solid #1e293b",
          borderTopColor: "#10b981",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p
        style={{
          color: "#475569",
          fontFamily: "sans-serif",
          fontSize: "14px",
          margin: 0,
        }}
      >
        Loading EcoSync...
      </p>
    </div>
  );
}
