/** Global brutalism styles: body stripes, watermark, scrollbar, hover effects. */
export function BrutalStyles() {
  return (
    <style>{`
      /* Diagonal stripe pattern on body */
      body {
        background-color: #B2BDA0 !important;
        position: relative;
      }
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(0,0,0,0.03) 10px,
          rgba(0,0,0,0.03) 20px
        );
      }
      body::after {
        content: 'PORTFOLIO';
        position: fixed;
        bottom: 3rem;
        right: -3rem;
        font-family: var(--font-bebas), sans-serif;
        font-size: 8rem;
        color: rgba(0,0,0,0.04);
        transform: rotate(-90deg);
        transform-origin: bottom right;
        pointer-events: none;
        z-index: 0;
        letter-spacing: 0.1em;
        white-space: nowrap;
      }
      /* Zero border-radius everywhere */
      * { border-radius: 0 !important; }

      /* Selection */
      ::selection {
        background-color: #B2BDA0;
        color: #000;
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-track { background: #B2BDA0; border-left: 2px solid #000; }
      ::-webkit-scrollbar-thumb { background: #000; border: 2px solid #B2BDA0; }
      ::-webkit-scrollbar-thumb:hover { background: #2C2C2C; }

      @media (max-width: 768px) {
        body::after { display: none; }
      }

      /* Hero entrance animations — pure CSS, transform-only so content is
         contentful-paint visible from the first frame (no opacity: 0 start) */
      @keyframes brutal-rise {
        from { transform: translateY(12px); }
        to { transform: none; }
      }
      @keyframes brutal-slide {
        from { transform: translateX(-24px); }
        to { transform: none; }
      }
      @keyframes brutal-pop {
        from { transform: scale(0.9); }
        to { transform: none; }
      }
      .anim-rise { animation: brutal-rise 0.5s ease-out both; }
      .anim-slide { animation: brutal-slide 0.5s ease-out both; }
      .anim-pop { animation: brutal-pop 0.4s ease-out both; }
      .anim-d1 { animation-delay: 0.1s; }
      .anim-d2 { animation-delay: 0.2s; }
      .anim-d3 { animation-delay: 0.3s; }
      .anim-d4 { animation-delay: 0.4s; }

      /* Brutalist hover effects (translate composes with base rotate) */
      .brutal-card {
        transition: box-shadow 0.1s ease, translate 0.1s ease;
      }
      .brutal-card:hover {
        translate: 3px 3px;
        box-shadow: 3px 3px 0px #000000 !important;
      }
      .brutal-chip {
        transition: box-shadow 0.1s ease, translate 0.1s ease,
          background-color 0.1s ease, color 0.1s ease;
      }
      .brutal-chip:hover {
        translate: 2px 2px;
        box-shadow: 1px 1px 0px #000000 !important;
        background: #000000 !important;
        color: #B2BDA0 !important;
      }
      .brutal-btn {
        transition: box-shadow 0.1s ease, translate 0.1s ease;
      }
      .brutal-btn:hover {
        translate: 2px 2px;
        box-shadow: 2px 2px 0px #000000 !important;
      }
    `}</style>
  );
}
