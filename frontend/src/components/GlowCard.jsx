function GlowCard({ children, className = '', onClick }) {
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      onClick={onClick}
      className={`relative rounded-2xl p-[2px] bg-gradient-to-br from-[#0f1e29] via-[#0b6e7a] to-[#06b6d4] shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] ${onClick ? 'text-left w-full' : ''} ${className}`}
    >
      <div className="h-full rounded-[14px] bg-white p-5">
        {children}
      </div>
    </Wrapper>
  )
}

export default GlowCard