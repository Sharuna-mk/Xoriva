import { useState, useEffect, useRef } from "react";

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return visible;
}

const STEPS = [
  { num: "01", title: "Upload Item", desc: "Snap & list in under 2 minutes" },
  { num: "02", title: "Get Valuation", desc: "AI + expert pricing instantly" },
  { num: "03", title: "We Sell It", desc: "We handle buyers, shipping & payout" },
];

export default function SellWithUs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.12);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const t = setInterval(() => {
      setActive((p) => (p + 1) % STEPS.length);
    }, 2600);

    return () => clearInterval(t);
  }, [inView]);

  const move = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;

    (e.currentTarget as HTMLElement).style.setProperty("--mx", String(x));
    (e.currentTarget as HTMLElement).style.setProperty("--my", String(y));
  };

  return (
    <section ref={ref} onMouseMove={move} className="sell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .sell {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          min-height: 100vh;
          font-family: DM Sans;
          overflow: hidden;
        }

        /* LEFT */
        .left {
          position: relative;
          background:
            linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.7)),
            url('https://i.pinimg.com/736x/d1/ff/6c/d1ff6c6ffbce10b2a5ac70c3c3dc0556.jpg');
          background-size: cover;
          background-position: center;
        }

        .glow1 {
          position: absolute;
          top: 20%;
          left: 10%;
          width: 220px;
          height: 220px;
          background: #C0392B55;
          filter: blur(80px);
        }

        .glow2 {
          position: absolute;
          bottom: 15%;
          right: 10%;
          width: 260px;
          height: 260px;
          background: #ffb34733;
          filter: blur(90px);
        }

        .stat {
          position: absolute;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-size: 12px;
          transition: 0.2s;
          transform: translate(calc(var(--mx, 0) * 20px), calc(var(--my, 0) * 20px));
        }

        .testimonial {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%) rotateY(calc(var(--mx, 0) * 10deg));
          width: 260px;
          padding: 18px;
          border-radius: 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          backdrop-filter: blur(12px);
        }

        /* RIGHT */
        .right {
          padding: 5rem;
          background: linear-gradient(180deg, #fafafa, #f5f5f5);
        }

        .step {
          padding: 14px 0;
          cursor: pointer;
          border-left: 3px solid transparent;
          padding-left: 12px;
          transition: 0.3s;
        }

        .step.active {
          border-left: 3px solid #C0392B;
        }

        .title {
          font-weight: 600;
        }

        .desc {
          font-size: 12px;
          opacity: 0.6;
          margin-top: 4px;
        }

        .cta {
          margin-top: 40px;
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #C0392B, #ff6b3d);
          color: white;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(192,57,43,0.25);
          transition: 0.3s;
        }

        .cta:hover {
          transform: scale(1.05);
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .sell {
            grid-template-columns: 1fr;
          }

          .left {
            display: none;
          }

          .right {
            padding: 2.2rem 1.5rem;
          }
        }
      `}</style>

      {/* LEFT */}
      <div className="left">
        <div className="glow1" />
        <div className="glow2" />

        {[
          ["₹2,000+", "Avg Earnings"],
          ["4.9★", "Trust Score"],
          ["7 Days", "Payout Time"],
        ].map((t, i) => (
          <div
            key={i}
            className="stat"
            style={{
              top: `${30 + i * 18}%`,
              left: `${30 + i * 8}px`,
            }}
          >
            <b>{t[0]}</b>
            <div style={{ opacity: 0.6 }}>{t[1]}</div>
          </div>
        ))}

        <div className="testimonial">
          <div style={{ fontSize: 14, fontStyle: "italic" }}>
            “I made ₹3,200 in a week”
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
            — Priya, Mumbai
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.6 }}>
          SELL SMARTER
        </div>

        <h1 style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", lineHeight: 1, marginTop: 10 }}>
          Turn Your Closet <br />
          <span style={{ color: "#C0392B" }}>Into Cash</span>
        </h1>

        <p style={{ opacity: 0.6, maxWidth: 320 }}>
          Your unused clothes are income waiting to happen.
        </p>

        <div style={{ marginTop: 40 }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`step ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              <div className="title">{s.title}</div>
              {active === i && <div className="desc">{s.desc}</div>}
            </div>
          ))}
        </div>

        <div className="relative group inline-block">
          <button className="cta">
            Start Selling →
          </button>

          <span className="absolute left-1/2 -translate-x-1/2 -top-8 
                   hidden group-hover:block 
                   bg-black text-white text-xs px-2 py-1 rounded">
            Coming Soon
          </span>
        </div>

      </div>
    </section>
  );
}