'use client'
import { apiClient } from "@/network";
import apiResources from "@/network/resources";
import { IChart } from "@/types";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

function OverviewChartSection() {
  const [chartData, setChartData] = useState<string[]>([
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ]);
  const [loading, setLoading] = useState(true);
  const [Chart, setChart] = useState<any>(null); // Dynamic import state

  const chartDefaultOptions = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false, // Set to false to hide the toolbar
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "month",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  useEffect(() => {
    async function fetchChartData() {
      const stats = await apiClient.get<IChart>(apiResources.statistics, "/chart");
      setChartData(Object.values(stats) as string[]);
      setLoading(false);
    }

    fetchChartData();
  }, []);

  // Dynamic import of Chart component
  useEffect(() => {
    import("react-apexcharts").then((module) => {
      setChart(() => module.default);
    });
  }, []);

  return (
    <div>
      <p className="text-[20px] font-semibold text-center">Orders Analytics</p>
      {loading ? (
        <Skeleton className="w-full h-[400px] mt-8" />
      ) : Chart ? (
        // Render the Chart component only when it's available
        <Chart
          options={chartDefaultOptions}
          series={[
            {
              name: "Orders",
              data: chartData,
              color: "#FFA03F",
            },
          ]}
          type="line"
          height={400}
        />
      ) : null}
    </div>
  );
}

export default OverviewChartSection;
