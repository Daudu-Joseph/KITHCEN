import { useCallback, useEffect, useRef } from "react";

const CELL_SIZE = 58;
const INFLUENCE_RADIUS = 220;
const MAX_WARP = 18;
const DOT_SPACING = 28;

const lerp = (a, b, t) => a + (b - a) * t;

const color = (base, active, t) => {
  const r = Math.round(lerp(base.r, active.r, t));
  const g = Math.round(lerp(base.g, active.g, t));
  const b = Math.round(lerp(base.b, active.b, t));
  const a = lerp(base.a, active.a, t);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
};

export default function PremiumGridBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const targetMouseRef = useRef({ x: -9999, y: -9999 });
  const ripplesRef = useRef([]);
  const rafRef = useRef(0);
  const drawPendingRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });

  const getWarpedPoint = useCallback((gx, gy, col, row, mouse, ripples, cols, rows) => {
    const edgeMargin = 1.5;
    const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
    const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
    const pinFactor = colPin * colPin * rowPin * rowPin;
    const dx = gx - mouse.x;
    const dy = gy - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

    let rx = 0;
    let ry = 0;
    for (const ripple of ripples) {
      const rdx = gx - ripple.x;
      const rdy = gy - ripple.y;
      const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
      const diff = rdist - ripple.radius;
      if (Math.abs(diff) < 55) {
        const strength = (1 - Math.abs(diff) / 55) * ripple.opacity * 13 * pinFactor;
        const angle = Math.atan2(rdy, rdx);
        const sign = diff < 0 ? -1 : 1;
        rx += Math.cos(angle) * strength * sign * -1;
        ry += Math.sin(angle) * strength * sign * -1;
      }
    }

    if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
      const t = dist / INFLUENCE_RADIUS;
      const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
      const warpAmt = eased * MAX_WARP * pinFactor;
      const angle = Math.atan2(dy, dx);
      return {
        pt: {
          x: gx - Math.cos(angle) * warpAmt + rx,
          y: gy - Math.sin(angle) * warpAmt + ry,
        },
        proximity,
      };
    }

    return { pt: { x: gx + rx, y: gy + ry }, proximity };
  }, []);

  const draw = useCallback(
    (now) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const { w, h } = sizeRef.current;
      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;
      const lineBase = { r: 17, g: 24, b: 39, a: 0.06 };
      const lineActive = { r: 168, g: 0, b: 13, a: 0.42 };
      const nodeBase = { r: 17, g: 24, b: 39, a: 0.1 };
      const nodeActive = { r: 168, g: 0, b: 13, a: 0.72 };

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(17,24,39,0.035)";
      for (let x = DOT_SPACING / 2; x < w; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < h; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        const age = (now - ripple.born) / 1000;
        ripple.radius = Math.max(0, age * 360);
        ripple.opacity = Math.max(0, 1 - age * 1.15);
        if (ripple.opacity <= 0) ripples.splice(i, 1);
      }

      const cols = Math.max(2, Math.ceil(w / CELL_SIZE)) + 1;
      const rows = Math.max(2, Math.ceil(h / CELL_SIZE)) + 1;
      const cellW = w / (cols - 1);
      const cellH = h / (rows - 1);
      const pts = [];
      const prox = [];

      for (let row = 0; row < rows; row += 1) {
        pts[row] = [];
        prox[row] = [];
        for (let col = 0; col < cols; col += 1) {
          const { pt, proximity } = getWarpedPoint(
            col * cellW,
            row * cellH,
            col,
            row,
            mouse,
            ripples,
            cols,
            rows,
          );
          pts[row][col] = pt;
          prox[row][col] = proximity;
        }
      }

      const drawSegment = (p1, p2, pr1, pr2) => {
        const avg = (pr1 + pr2) / 2;
        const t = avg * avg * (3 - 2 * avg);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = color(lineBase, lineActive, t);
        ctx.lineWidth = lerp(0.7, 1.35, t);
        ctx.stroke();
      };

      ctx.lineCap = "butt";
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols - 1; col += 1) {
          drawSegment(pts[row][col], pts[row][col + 1], prox[row][col], prox[row][col + 1]);
        }
      }
      for (let col = 0; col < cols; col += 1) {
        for (let row = 0; row < rows - 1; row += 1) {
          drawSegment(pts[row][col], pts[row + 1][col], prox[row][col], prox[row + 1][col]);
        }
      }

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const p = pts[row][col];
          const t = prox[row][col] * prox[row][col] * (3 - 2 * prox[row][col]);
          ctx.beginPath();
          ctx.arc(p.x, p.y, lerp(1.2, 2.8, t), 0, Math.PI * 2);
          ctx.fillStyle = color(nodeBase, nodeActive, t);
          ctx.fill();
        }
      }

      for (const ripple of ripples) {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, Math.max(0, ripple.radius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168,0,13,${(ripple.opacity * 0.18).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    },
    [getWarpedPoint],
  );

  const requestDraw = useCallback(() => {
    if (drawPendingRef.current) return;
    drawPendingRef.current = true;
    rafRef.current = requestAnimationFrame((now) => {
      drawPendingRef.current = false;
      mouseRef.current = { ...targetMouseRef.current };
      draw(now);
    });
  }, [draw]);

  const startRippleAnimation = useCallback(() => {
    const tick = (now) => {
      draw(now);
      if (ripplesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return undefined;

    const setSize = () => {
      const rect = section.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      requestDraw();
    };

    const onPointerMove = (event) => {
      const rect = section.getBoundingClientRect();
      targetMouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      requestDraw();
    };

    const onPointerLeave = () => {
      targetMouseRef.current = { x: -9999, y: -9999 };
      requestDraw();
    };

    const onClick = (event) => {
      const rect = section.getBoundingClientRect();
      ripplesRef.current.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRippleAnimation();
    };

    setSize();
    const observer = new ResizeObserver(setSize);
    observer.observe(section);
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);
    section.addEventListener("click", onClick);
    requestDraw();

    return () => {
      observer.disconnect();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      section.removeEventListener("click", onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [requestDraw, startRippleAnimation]);

  return <canvas aria-hidden="true" className="premium-grid-canvas" ref={canvasRef} />;
}
