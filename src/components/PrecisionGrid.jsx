import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function PrecisionGrid() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isHome) {
      document.body.classList.add("paper-canvas");
    } else {
      document.body.classList.remove("paper-canvas");
    }
    return () => {
      document.body.classList.remove("paper-canvas");
    };
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const GRID_SIZE = 36;          // 36px precision drafting cell
    const BASE_RADIUS = 72;        // Idle / slow movement illumination radius
    const MAX_RADIUS = 126;        // Fast-swipe aerodynamic wake radius
    const BASE_DECAY = 680;        // Dissolution duration in milliseconds
    const MAX_ALPHA_FILL = 0.045;  // Subtle accent tint wash
    const MAX_ALPHA_STROKE = 0.120;// Crisp hairline cell perimeter
    const MAX_ALPHA_RETICLE = 0.35;// Precision intersection diamond anchors

    let ctx = null;
    let dpr = 1;
    let width = 0;
    let height = 0;
    let offsetX = 0;

    const activeCells = new Map();
    let animationFrameId = null;

    let lastX = null;
    let lastY = null;
    let lastMoveTime = performance.now();
    let smoothedVelocity = 0;

    let cursorX = 0;
    let cursorY = 0;
    let lastCursorMoveTime = 0;

    function getThemeColors() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        return {
          baseGridStroke: "rgba(255, 255, 255, 0.042)",
          fillRgb: "0, 191, 204",       // Vibrant electric cyan (#00BFCC)
          strokeRgb: "0, 191, 204",
          reticleRgb: "0, 191, 204",
          pillBg: "22, 22, 24",
          pillBorder: "0, 191, 204",
          pillText: "0, 191, 204",
          fillMult: 1.4,
          strokeMult: 1.25,
          reticleMult: 1.1,
        };
      } else {
        return {
          baseGridStroke: "rgba(15, 23, 42, 0.048)",
          fillRgb: "0, 118, 128",       // Technical petrol teal (#007680)
          strokeRgb: "0, 118, 128",
          reticleRgb: "0, 118, 128",
          pillBg: "255, 255, 255",
          pillBorder: "0, 118, 128",
          pillText: "15, 23, 42",
          fillMult: 1.1,
          strokeMult: 1.0,
          reticleMult: 1.0,
        };
      }
    }

    function calculateGridOffset() {
      const centerX = width / 2;
      const baseOffset = (centerX - (GRID_SIZE / 2)) % GRID_SIZE;
      offsetX = Math.round((baseOffset + GRID_SIZE) % GRID_SIZE);
    }

    function drawBaseGrid(theme) {
      if (!ctx) return;
      ctx.strokeStyle = theme.baseGridStroke;
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let x = offsetX + 0.5; x <= width + 1; x += GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let x = offsetX + 0.5 - GRID_SIZE; x >= -1; x -= GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0.5; y <= height + 1; y += GRID_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
    }

    function renderReticleDiamond(x, y, alpha, reticleRgb) {
      if (!ctx) return;
      const cx = x + 0.5;
      const cy = y + 0.5;

      ctx.fillStyle = `rgba(${reticleRgb}, ${alpha.toFixed(4)})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 2.5);
      ctx.lineTo(cx + 2.5, cy);
      ctx.lineTo(cx, cy + 2.5);
      ctx.lineTo(cx - 2.5, cy);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = `rgba(${reticleRgb}, ${(alpha * 0.7).toFixed(4)})`;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(cx - 3.5, cy);
      ctx.lineTo(cx + 3.5, cy);
      ctx.moveTo(cx, cy - 3.5);
      ctx.lineTo(cx, cy + 3.5);
      ctx.stroke();
    }

    function renderFrame(currentTime, forceStaticOnly = false) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const theme = getThemeColors();

      drawBaseGrid(theme);

      if (forceStaticOnly) return;

      let hasActive = false;

      activeCells.forEach((cell, key) => {
        const elapsed = currentTime - cell.startTime;
        if (elapsed >= cell.decayDuration) {
          activeCells.delete(key);
        } else {
          hasActive = true;
          const progress = elapsed / cell.decayDuration;
          const fade = 0.5 * (1 + Math.cos(progress * Math.PI));
          const alphaFill = fade * cell.intensity * MAX_ALPHA_FILL * theme.fillMult;
          const alphaStroke = fade * cell.intensity * MAX_ALPHA_STROKE * theme.strokeMult;
          const alphaReticle = fade * cell.intensity * MAX_ALPHA_RETICLE * theme.reticleMult;

          if (alphaFill > 0.001) {
            ctx.fillStyle = `rgba(${theme.fillRgb}, ${alphaFill.toFixed(4)})`;
            ctx.fillRect(cell.x, cell.y, GRID_SIZE, GRID_SIZE);
          }

          if (alphaStroke > 0.002) {
            ctx.strokeStyle = `rgba(${theme.strokeRgb}, ${alphaStroke.toFixed(4)})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, GRID_SIZE, GRID_SIZE);
          }

          if (alphaReticle > 0.015 && cell.intensity > 0.35) {
            renderReticleDiamond(cell.x, cell.y, alphaReticle, theme.reticleRgb);
            renderReticleDiamond(cell.x + GRID_SIZE, cell.y, alphaReticle, theme.reticleRgb);
            renderReticleDiamond(cell.x, cell.y + GRID_SIZE, alphaReticle, theme.reticleRgb);
            renderReticleDiamond(cell.x + GRID_SIZE, cell.y + GRID_SIZE, alphaReticle, theme.reticleRgb);
          }
        }
      });

      const telemetryElapsed = currentTime - lastCursorMoveTime;
      if (telemetryElapsed < 600 && lastX !== null) {
        hasActive = true;
        const teleFade = Math.pow(Math.max(0, 1 - (telemetryElapsed / 600)), 1.5);
        const curCol = Math.floor((cursorX - offsetX) / GRID_SIZE);
        const curRow = Math.floor(cursorY / GRID_SIZE);
        const coordText = `${curCol * GRID_SIZE}, ${curRow * GRID_SIZE}`;

        const tagX = cursorX + 16;
        const tagY = cursorY + 16;

        ctx.save();
        ctx.font = "500 9px ui-monospace, SFMono-Regular, monospace";
        const textMetrics = ctx.measureText(coordText);
        const padX = 4;
        const padY = 2;
        const boxW = textMetrics.width + padX * 2;
        const boxH = 13;

        ctx.fillStyle = `rgba(${theme.pillBg}, ${(teleFade * 0.95).toFixed(4)})`;
        ctx.strokeStyle = `rgba(${theme.pillBorder}, ${(teleFade * 0.35).toFixed(4)})`;
        ctx.lineWidth = 0.75;

        ctx.beginPath();
        ctx.roundRect(tagX, tagY, boxW, boxH, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(${theme.pillText}, ${(teleFade * 0.85).toFixed(4)})`;
        ctx.fillText(coordText, tagX + padX, tagY + boxH - padY - 1);
        ctx.restore();
      }

      if (hasActive) {
        animationFrameId = requestAnimationFrame(renderLoop);
      } else {
        animationFrameId = null;
        lastX = null;
        lastY = null;
        smoothedVelocity = 0;
      }
    }

    function renderLoop(currentTime) {
      renderFrame(currentTime, false);
    }

    function resizeCanvas() {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      calculateGridOffset();

      renderFrame(performance.now(), true);
    }

    function illuminateAt(x, y, radius, decay) {
      const minCol = Math.floor((x - radius - offsetX) / GRID_SIZE);
      const maxCol = Math.floor((x + radius - offsetX) / GRID_SIZE);
      const minRow = Math.max(0, Math.floor((y - radius) / GRID_SIZE));
      const maxRow = Math.min(Math.floor(height / GRID_SIZE), Math.floor((y + radius) / GRID_SIZE));

      const now = performance.now();
      const rSq = radius * radius;

      for (let c = minCol; c <= maxCol; c++) {
        const cellX = offsetX + c * GRID_SIZE;
        if (cellX + GRID_SIZE < 0 || cellX > width) continue;

        for (let r = minRow; r <= maxRow; r++) {
          const cellY = r * GRID_SIZE;
          const cellCenterX = cellX + GRID_SIZE / 2;
          const cellCenterY = cellY + GRID_SIZE / 2;

          const dx = x - cellCenterX;
          const dy = y - cellCenterY;
          const distSq = dx * dx + dy * dy;

          if (distSq < rSq) {
            const weight = Math.pow(1 - (distSq / rSq), 2);
            const key = `${c},${r}`;
            const existing = activeCells.get(key);

            if (existing) {
              existing.startTime = now;
              existing.decayDuration = decay;
              existing.intensity = Math.max(existing.intensity * 0.65, weight);
            } else {
              activeCells.set(key, {
                col: c,
                row: r,
                x: cellX,
                y: cellY,
                startTime: now,
                decayDuration: decay,
                intensity: weight,
              });
            }
          }
        }
      }

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    }

    function handlePointerMove(e) {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const now = performance.now();

      cursorX = currentX;
      cursorY = currentY;
      lastCursorMoveTime = now;

      if (lastX === null || lastY === null) {
        lastX = currentX;
        lastY = currentY;
        lastMoveTime = now;
        illuminateAt(currentX, currentY, BASE_RADIUS, BASE_DECAY);
        return;
      }

      const dt = Math.max(1, now - lastMoveTime);
      const dist = Math.hypot(currentX - lastX, currentY - lastY);
      const instantaneousSpeed = dist / dt;

      smoothedVelocity = smoothedVelocity * 0.65 + instantaneousSpeed * 0.35;
      lastMoveTime = now;

      const dynamicRadius = Math.min(MAX_RADIUS, Math.max(BASE_RADIUS, BASE_RADIUS + smoothedVelocity * 42));
      const dynamicDecay = Math.min(920, Math.max(BASE_DECAY, BASE_DECAY + smoothedVelocity * 130));

      if (dist > 18) {
        const steps = Math.min(5, Math.ceil(dist / 14));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const ix = lastX + (currentX - lastX) * t;
          const iy = lastY + (currentY - lastY) * t;
          illuminateAt(ix, iy, dynamicRadius, dynamicDecay);
        }
      } else {
        illuminateAt(currentX, currentY, dynamicRadius, dynamicDecay);
      }

      lastX = currentX;
      lastY = currentY;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const themeObserver = new MutationObserver(() => {
      if (!animationFrameId) {
        renderFrame(performance.now(), true);
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      themeObserver.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  }, [isHome]);

  if (!isHome) return null;

  return (
    <canvas
      ref={canvasRef}
      id="gridCanvas"
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
