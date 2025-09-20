import { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCode = ({ value, size = 200, className = "" }: QRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple QR code simulation with squares pattern
    const moduleCount = 21; // Standard QR code size
    const moduleSize = size / moduleCount;
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(1, 1, size - 2, size - 2);
    
    ctx.fillStyle = "#000000";
    
    // Create a pattern based on the value hash
    const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        // Corner squares (finder patterns)
        if ((row < 7 && col < 7) || 
            (row < 7 && col >= moduleCount - 7) || 
            (row >= moduleCount - 7 && col < 7)) {
          if ((row < 7 && col < 7 && (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4))) ||
              (row < 7 && col >= moduleCount - 7 && (row === 0 || row === 6 || col === moduleCount - 7 || col === moduleCount - 1 || (row >= 2 && row <= 4 && col >= moduleCount - 5 && col <= moduleCount - 3))) ||
              (row >= moduleCount - 7 && col < 7 && (row === moduleCount - 7 || row === moduleCount - 1 || col === 0 || col === 6 || (row >= moduleCount - 5 && row <= moduleCount - 3 && col >= 2 && col <= 4)))) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        } else {
          // Data modules - create pattern based on hash
          const shouldFill = (hash + row * moduleCount + col) % 3 === 0;
          if (shouldFill) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        }
      }
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`border border-border rounded-lg ${className}`}
    />
  );
};