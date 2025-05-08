// frontend/src/components/D3BarChart.jsx

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function D3BarChart({
  data,
  labelKey,
  valueKey,
  color = '#ff69b4'
}) {
  const svgRef = useRef();

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    // паддинги и размеры
    const margin = { top: 20, right: 20, bottom: 80, left: 60 };
    const barBand = 40; // ширина “ячейки” на один бар
    const viewBoxWidth = margin.left + margin.right + data.length * barBand;
    const viewBoxHeight = 400;

    // готовим SVG
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    // шкалы
    const x = d3
      .scaleBand()
      .domain(data.map(d => d[labelKey]))
      .range([margin.left, viewBoxWidth - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d[valueKey])])
      .nice()
      .range([viewBoxHeight - margin.bottom, margin.top]);

    // рисуем бары
    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
        .attr('x', d => x(d[labelKey]))
        .attr('y', d => y(d[valueKey]))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d[valueKey]))
        .attr('fill', color);

    // ось Y
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    // ось X — просто номера
    svg
      .append('g')
      .attr('transform', `translate(0,${viewBoxHeight - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .tickFormat((_, i) => i + 1)
          .tickSize(0)
      )
      .selectAll('text')
        .style('font-size', '12px');

  }, [data, labelKey, valueKey, color]);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        ref={svgRef}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      <div style={{ marginTop: 8, fontSize: 14 }}>
        <strong>Легенда:</strong>
        <ol style={{ margin: '4px 0 0 16px', padding: 0 }}>
          {data.map((d, i) => (
            <li key={i} style={{ margin: '2px 0' }}>
              {i + 1}: {d[labelKey]}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
