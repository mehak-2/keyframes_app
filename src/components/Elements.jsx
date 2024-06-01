import React, { useState, useEffect } from "react";
import { data } from "../data";

import "../index.css";

const Elements = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [range, setRange] = useState(0);

  const [duration, setDuration] = useState(4);
  const [timingFunction, setTimingFunction] = useState("ease");
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState(1);
  const [direction, setDirection] = useState("normal");
  const [fillMode, setFillMode] = useState("none");

  const handleRangeChange = (event) => {
    const newValue = parseInt(event.target.value);
    setRange(newValue);

    const animationSection = document.querySelector(".animation-section");
    const keyframes0 = JSON.parse(document.getElementById("1").value);
    const keyframes100 = JSON.parse(document.getElementById("2").value);

    let interpolatedKeyframes = {};
    if (newValue <= 0) {
      interpolatedKeyframes = keyframes0;
    } else if (newValue >= 100) {
      interpolatedKeyframes = keyframes100;
    } else {
      const startKeyframes = keyframes0;
      const endKeyframes = keyframes100;
      interpolatedKeyframes = {};
      for (const property in startKeyframes) {
        const start = parseFloat(startKeyframes[property]);
        const end = parseFloat(endKeyframes[property]);
        const interpolatedValue =
          start + ((end - start) * (newValue - 10)) / 0;
        interpolatedKeyframes[property] = interpolatedValue.toString();
      }
    }

    applyKeyframes(animationSection, interpolatedKeyframes);
  };

  const applyKeyframes = (element, keyframes) => {
    let cssText = '';
    for (const [property, value] of Object.entries(keyframes)) {
      cssText += `${property}: ${value}; `;
    }
    element.style.cssText = cssText;
  };

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    for (const category in data) {
      for (const animation of data[category]) {
        const keyframes = generateKeyframes(animation.animations);
        styleSheet.insertRule(`@keyframes ${animation.name} { ${keyframes} }`, styleSheet.cssRules.length);
      }
    }
  }, []);

  const generateKeyframes = (animations) => {
    let keyframes = '';
    for (let i = 0; i <= 100; i++) {
      const interpolatedKeyframes = {};
      for (const property in animations[0]) {
        const start = parseFloat(animations[0][property]);
        const end = parseFloat(animations[1][property]);
        const interpolatedValue = start + ((end - start) * i) / 100;
        interpolatedKeyframes[property] = interpolatedValue.toString();
      }
      keyframes += `${i}% { ${Object.entries(interpolatedKeyframes).map(([property, value]) => `${property}: ${value};`).join(" ")} } `;
    }
    return keyframes;
  };
  
  const handleDurationChange = (increment) => {
    const newDuration = Math.max(duration + (increment ? 0.1 : -0.1), 0);
    setDuration(newDuration);
  };
  const setKeyframes = (animationName, animations) => {
    let keyframes = '';
    for (let i = 0; i <= 100; i++) {
      const interpolatedKeyframes = {};
      for (const property in animations[0]) {
        const start = parseFloat(animations[0][property]);
        const end = parseFloat(animations[1][property]);
        const interpolatedValue = start + ((end - start) * i) / 100;
        interpolatedKeyframes[property] = interpolatedValue.toString();
      }
      keyframes += `${i}% {`;
      keyframes += Object.entries(interpolatedKeyframes)
        .map(([property, value]) => `${property}: ${value};`)
        .join(" ");
      keyframes += "} ";
    }
  
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`@keyframes ${animationName} { ${keyframes} }`, styleSheet.cssRules.length);
  };
  
  for (const category in data) {
    for (const animation of data[category]) {
      setKeyframes(animation.name, animation.animations);
    }
  }
  
  const handleDelayChange = (increment) => {
    const newDelay = Math.max(delay + (increment ? 0.1 : -0.1), 0);
    setDelay(newDelay);
  };

  const handleIterationCountChange = (increment) => {
    const newCount = Math.max(iterationCount + (increment ? 1 : -1), -1);
    setIterationCount(newCount);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--translate", `${range}%`);
  }, [range]);

  useEffect(() => {
    const animationSection = document.querySelector(".animation-section");
    if (selectedElement) {
      animationSection.style.animationName = selectedElement.name;

      animationSection.style.animationDuration = `${duration}s`;
      animationSection.style.animationTimingFunction = timingFunction;
      animationSection.style.animationDelay = `${delay}s`;
      animationSection.style.animationIterationCount =
        iterationCount === -1 ? "infinite" : iterationCount.toString();
      animationSection.style.animationDirection = direction;
      animationSection.style.animationFillMode = fillMode;
    }
  }, [
    selectedElement,
    duration,
    timingFunction,
    delay,
    iterationCount,
    direction,
    fillMode,
  ]);

  const handleElementClick = (element) => {
    setSelectedElement(element);
    const animations = element.animations || [];
    document.getElementById("1").value = JSON.stringify(
      animations[0] || {},
      null,
      2
    );
    document.getElementById("2").value = JSON.stringify(
      animations[1] || {},
      null,
      2
    );
  };

  const handleRunAnimation = () => {
    const animationSection = document.querySelector(".animation-section");
    const keyframes0 = JSON.parse(document.getElementById("1").value);
    const keyframes100 = JSON.parse(document.getElementById("2").value);

    const keyframes = `
    @keyframes ${CSS.escape(selectedElement.name)} {
      0% { ${Object.entries(keyframes0)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ")} }
      100% { ${Object.entries(keyframes100)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ")} }
    }
  `;
    const styleSheet = document.styleSheets[0];
    const existingIndex = Array.from(styleSheet.cssRules).findIndex(
      (rule) => rule.name === selectedElement.name
    );

    if (existingIndex !== -1) {
      styleSheet.deleteRule(existingIndex);
    }

    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    if (selectedElement) {
      animationSection.style.animation = "none"; // Reset animation
      setTimeout(() => {
        animationSection.style.animation = ""; // Reapply animation
        animationSection.style.animationName = selectedElement.name;
        animationSection.style.animationDuration = `${duration}s`;
        animationSection.style.animationTimingFunction = timingFunction;
        animationSection.style.animationDelay = `${delay}s`;
        animationSection.style.animationIterationCount =
          iterationCount === -1 ? "infinite" : iterationCount.toString();
        animationSection.style.animationDirection = direction;
        animationSection.style.animationFillMode = fillMode;
      }, 10); // Small delay to allow reset
    }
  };

  return (
    <div className="container">
      <div className="category-buttons">
        {Object.keys(data).map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`category-button ${
              selectedCategory === category ? "selected" : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="element-buttons">
        {selectedCategory &&
          data[selectedCategory].map((element, index) => (
            <button
              key={index}
              onClick={() => handleElementClick(element)}
              className={`element-button ${
                selectedElement === element ? "selected" : ""
              }`}
            >
              {element.name}
            </button>
          ))}
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="heading">control @keyframes execution flow</div>
          <div className="duration">
            <p>
              duration
              <button onClick={() => handleDurationChange(false)}>-</button>
              <input type="number" value={duration} readOnly />
              <button onClick={() => handleDurationChange(true)}>+</button>
            </p>
          </div>
          <div className="timing">
            <p>
              timing-function
              <select
                value={timingFunction}
                onChange={(e) => setTimingFunction(e.target.value)}
              >
                <option value="linear">linear</option>
                <option value="ease">ease</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
              </select>
            </p>
          </div>
          <div className="delay">
            <p>
              delay
              <button onClick={() => handleDelayChange(false)}>-</button>
              <input type="number" value={delay} readOnly />
              <button onClick={() => handleDelayChange(true)}>+</button>
            </p>
          </div>
          <div className="iteration-count">
            <p>
              iteration-count
              <button onClick={() => handleIterationCountChange(false)}>
                -
              </button>
              <input type="number" value={iterationCount} readOnly />
              <button onClick={() => handleIterationCountChange(true)}>
                +
              </button>
            </p>
          </div>
          <div className="direction">
            <p>
              direction
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <option value="normal">normal</option>
                <option value="reverse">reverse</option>
                <option value="alternate">alternate</option>
                <option value="alternate-reverse">alternate-reverse</option>
              </select>
            </p>
          </div>
          <div className="fill-mode">
            <p>
              fill-mode
              <select
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value)}
              >
                <option value="none">none</option>
                <option value="forwards">forwards</option>
                <option value="backwards">backwards</option>
                <option value="both">both</option>
              </select>
            </p>
          </div>
        </div>
        <div className="right-section">
          <div className="animation-section">animation</div>
          <div className="run-btn">
            <button className="run-button" onClick={handleRunAnimation}>
              Run
            </button>
          </div>
          <div className="textareas">
            <div className="code-heading">
              <h1>0%</h1>
              <i className="fa fa-times"></i>
            </div>
            <textarea id="1" className="textarea" rows="5"></textarea>
            <div className="code-heading">
              <h1>100%</h1>
              <i className="fa fa-times"></i>
            </div>
            <textarea id="2" className="textarea" rows="5"></textarea>
          </div>
        </div>
      </div>

      <div className="range-slider-container">
        <span className="range-value">{range}</span>
        <div className="range-slider">
          <span>0%</span>
          <input
            className="range-input"
            min={0}
            max={100}
            type="range"
            value={range}
            onChange={handleRangeChange}
          />
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default Elements;