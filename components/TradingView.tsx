"use client";
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

const TradingViewWidget = ({
  title,
  scriptUrl,
  config,
  height,
  className,
}: TradingViewWidgetProps) => {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-semibold text-gray-100 mb-5">{title}</h2>
      )}
      <div
        className={cn("tradingview-widget-container", className)}
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: "100%" }}
        />
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
