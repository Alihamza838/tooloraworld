import React, { useState, useEffect } from 'react';
import { Scale, Ruler, Compass, Thermometer, Database } from 'lucide-react';

type UnitType = 'length' | 'weight' | 'capacity' | 'temp';

export default function UnitConverter() {
  const [activeTab, setActiveTab] = useState<UnitType>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [result, setResult] = useState<number>(0);

  const units: Record<UnitType, { name: string; conversion: Record<string, number>; symbol: Record<string, string> }> = {
    length: {
      name: 'Length & Distance',
      conversion: { m: 1, km: 1000, cm: 0.01, mm: 0.001, inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.34 },
      symbol: { m: 'm', km: 'km', cm: 'cm', mm: 'mm', inch: 'in', ft: 'ft', yard: 'yd', mile: 'mi' }
    },
    weight: {
      name: 'Weight & Mass',
      conversion: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, stone: 6.35029 },
      symbol: { kg: 'kg', g: 'g', mg: 'mg', lb: 'lb', oz: 'oz', stone: 'st' }
    },
    capacity: {
      name: 'Volume & Capacity',
      conversion: { l: 1, ml: 0.001, cup: 0.236588, pint: 0.473176, quart: 0.946353, gal: 3.78541 },
      symbol: { l: 'L', ml: 'mL', cup: 'cup', pint: 'pt', quart: 'qt', gal: 'gal' }
    },
    temp: {
      name: 'Temperature',
      conversion: { c: 1, f: 1, k: 1 }, // Custom logic is executed inside handler
      symbol: { c: '°C', f: '°F', k: 'K' }
    }
  };

  // Set default units for conversion when changing tab
  useEffect(() => {
    const keys = Object.keys(units[activeTab].conversion);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  }, [activeTab]);

  // Recalculate conversion when input changes
  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit, activeTab]);

  const calculateConversion = () => {
    if (isNaN(inputValue)) return;

    const activeUnits = units[activeTab].conversion;
    if (activeUnits[fromUnit] === undefined || activeUnits[toUnit] === undefined) {
      return;
    }

    if (activeTab === 'temp') {
      let tempC = inputValue;
      // Convert source to Celsius first
      if (fromUnit === 'f') tempC = (inputValue - 32) * (5 / 9);
      if (fromUnit === 'k') tempC = inputValue - 273.15;

      // Convert Celsius to destination
      let finalVal = tempC;
      if (toUnit === 'f') finalVal = (tempC * 9/5) + 32;
      if (toUnit === 'k') finalVal = tempC + 273.15;

      setResult(parseFloat(finalVal.toFixed(4)));
    } else {
      const valInBase = inputValue * activeUnits[fromUnit];
      const converted = valInBase / activeUnits[toUnit];
      setResult(parseFloat(converted.toFixed(6)));
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-6 max-w-2xl mx-auto shadow-xs">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">Universal Unit Converter</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Perform digital metric swaps across lengths, volumes, weights, and temperatures. Safely calculated in CPU logic.
        </p>
      </div>

      {/* Tabs configuration */}
      <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl gap-1 mb-6">
        {[
          { id: 'length', label: 'Length', icon: Ruler },
          { id: 'weight', label: 'Weight', icon: Scale },
          { id: 'capacity', label: 'Capacity', icon: Compass },
          { id: 'temp', label: 'Degrees', icon: Thermometer },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as UnitType)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold font-display transition-colors cursor-pointer ${activeTab === tab.id ? 'bg-white dark:bg-zinc-900 text-zinc-850 dark:text-zinc-100 shadow-xs' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Source value */}
        <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800/80 space-y-4">
          <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider">Source metric</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
            className="w-full text-2xl font-bold bg-transparent border-none outline-hidden text-zinc-900 dark:text-zinc-100 font-mono"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 outline-hidden focus:border-emerald-500 font-sans font-medium"
          >
            {Object.keys(units[activeTab].conversion).map((key) => (
              <option key={key} value={key}>
                {key.toUpperCase()} ({units[activeTab].symbol[key]})
              </option>
            ))}
          </select>
        </div>

        {/* Destination val */}
        <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-4">
          <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider">Converted Result</label>
          <div className="text-2xl font-bold text-zinc-750 dark:text-zinc-100 font-mono truncate py-1.5">
            {result}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 outline-hidden font-sans font-medium"
          >
            {Object.keys(units[activeTab].conversion).map((key) => (
              <option key={key} value={key}>
                {key.toUpperCase()} ({units[activeTab].symbol[key]})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
