"use client";

import { ColorType, ISeriesApi, createChart } from "lightweight-charts";
import {
  MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

const colors = {
  backgroundColor: "rgba(17 24 39)",
  lineColor: "#2962FF",
  textColor: "white",
  areaTopColor: "#2962FF",
  areaBottomColor: "rgba(41, 98, 255, 0.28)",
};

export interface ChartComponentRef {
  update: (data: { time: number; value: number }) => void;
}

const chartOptions = {
  layout: {
    background: { type: ColorType.Solid, color: colors.backgroundColor },
    textColor: colors.textColor,
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.3)",
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.3)",
    },
  },
};

export const ChartComponent = forwardRef<
  ChartComponentRef,
  { header: string; data?: any[] }
>((props, ref) => {
  const chartContainerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const chartRef = useRef({
    api() {
      if (!this._api) {
        this._api = createChart(chartContainerRef.current, {
          ...chartOptions,
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
        this._api.timeScale().fitContent();
      }
      return this._api;
    },
    free() {
      if (this._api) {
        this._api.remove();
      }
    },
  });
  const seriesRef = useRef() as MutableRefObject<ISeriesApi<"Area">>;

  useImperativeHandle(ref, () => ({
    update: (data: { time: string; value: number }) => {
      seriesRef.current.update(data);
    },
  }));

  useEffect(() => {
    seriesRef.current = chartRef.current.api().addAreaSeries({
      lineColor: colors.lineColor,
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
    });
  }, []);

  useLayoutEffect(() => {
    const currentRef = chartRef.current;
    const chart = currentRef.api();

    const handleResize = () => {
      chart.applyOptions({
        ...chartOptions,
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useLayoutEffect(() => {
    const currentRef = chartRef.current;
    currentRef.api();
  }, []);

  useLayoutEffect(() => {
    const currentRef = chartRef.current;
    currentRef.api().applyOptions(chartOptions);
  }, []);

  return (
    <div className="flex-grow relative" ref={chartContainerRef}>
      <article className="absolute top-0 left-0 z-50 format format-invert">
        <div className="text-3xl font-bold text-white">{props.header}</div>
      </article>
    </div>
  );
});

ChartComponent.displayName = "ChartComponent";