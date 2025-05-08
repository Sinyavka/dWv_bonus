import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function D3LineChart({ data, dateKey, valueKey, color }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 700;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("*").remove();

    const parseDate = d3.timeParse("%Y-%m-%d");
    const dataParsed = data.map(d => ({
      date: parseDate(d[dateKey]),
      value: d[valueKey]
    }));

    const x = d3.scaleTime()
      .domain(d3.extent(dataParsed, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataParsed, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    svg.append("path")
      .datum(dataParsed)
      .attr("fill", "none")
      .attr("stroke", color || "#ff69b4")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data, dateKey, valueKey, color]);

  return <svg ref={svgRef} className="w-full" />;
}
