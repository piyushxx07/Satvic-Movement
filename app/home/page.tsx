"use client";

import { useEffect, useState } from "react";
import WarpText from "../../components/WarpText";

export default function StudioHome() {
  const [warpTrigger, setWarpTrigger] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setWarpTrigger(value => value + 1), 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="home-page">
      <header className="home-nav">
        <a className="home-brand" href="/home" aria-label="Satvic Movement home">
          <span className="home-logo" aria-hidden="true">S</span>
          <WarpText
            text="Satvic Movement"
            color="#202124"
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            lens="bulge"
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            chromatic={0.2}
            idleDrift={0.12}
            ripple
            clickRipple
            intro
            trigger={warpTrigger}
            fontSize="20px"
            fontWeight={400}
            fontFamily='"Gilroy", "Helvetica Neue", Arial, sans-serif'
            letterSpacing="-0.02em"
            lineHeight={1}
            className="home-warp-name"
            style={{ height: "34px", minHeight: "34px", width: "190px" }}
          />
        </a>
      </header>
    </main>
  );
}
