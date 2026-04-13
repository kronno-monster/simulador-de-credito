const style = {
  background: 'linear-gradient(90deg, #19243D 25%, #2A3858 50%, #19243D 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s infinite',
  borderRadius: 8,
}

export function SkeletonLine({ width = '100%', height = 16, mb = 8 }) {
  return <div style={{ ...style, width, height, marginBottom: mb }} />
}

export function SkeletonCard() {
  return (
    <div style={{ background: '#19243D', border: '1px solid #2A3858', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <SkeletonLine width="40%" height={18} mb={12} />
      <SkeletonLine width="70%" height={13} mb={8} />
      <SkeletonLine width="50%" height={13} mb={0} />
    </div>
  )
}

export function SkeletonList({ cantidad = 3 }) {
  return <>{Array.from({ length: cantidad }).map((_, i) => <SkeletonCard key={i} />)}</>
}
