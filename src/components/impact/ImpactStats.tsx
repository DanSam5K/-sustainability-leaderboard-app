'use client';

import { useMemo } from 'react';
import { ImpactMetric } from './CategoryImpactChart';
import BeakerIcon from '@heroicons/react/24/outline/BeakerIcon';
import LightBulbIcon from '@heroicons/react/24/outline/LightBulbIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import TruckIcon from '@heroicons/react/24/outline/TruckIcon';
import GlobeAltIcon from '@heroicons/react/24/outline/GlobeAltIcon';
import SparklesIcon from '@heroicons/react/24/outline/SparklesIcon';

interface ImpactStatsProps {
  metrics: ImpactMetric[];
}

export default function ImpactStats({ metrics }: ImpactStatsProps) {
  const stats = useMemo(() => {
    // Calculate totals by category
    const totals = metrics.reduce(
      (acc, metric) => {
        acc[metric.category] = (acc[metric.category] || 0) + metric.value;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate environmental equivalents
    const waterSavedL = totals.water || 0;
    const energySavedKWh = totals.energy || 0;
    const wasteReducedKg = totals.waste || 0;
    const co2AvoidedKg = totals.transport || 0;

    // Environmental impact calculations
    // These are approximate conversions based on common environmental metrics
    const treesEquivalent = co2AvoidedKg / 21; // Average tree absorbs ~21kg CO2 per year
    const showerMinutesSaved = waterSavedL / 10; // Average shower uses ~10L per minute
    const lightbulbHours = energySavedKWh * 100; // 1 kWh can power a 10W LED bulb for 100 hours
    const plasticBottlesSaved = wasteReducedKg * 20; // Assuming ~50g per plastic bottle
    const carKmAvoided = co2AvoidedKg * 6; // Average car emits ~166g CO2 per km (1/6 kg per km)

    return {
      totals,
      equivalents: {
        treesEquivalent: Math.round(treesEquivalent * 10) / 10,
        showerMinutesSaved: Math.round(showerMinutesSaved),
        lightbulbHours: Math.round(lightbulbHours),
        plasticBottlesSaved: Math.round(plasticBottlesSaved),
        carKmAvoided: Math.round(carKmAvoided),
      },
    };
  }, [metrics]);

  const impactCards = [
    {
      title: 'Water Saved',
      value: stats.totals.water || 0,
      unit: 'L',
      icon: BeakerIcon,
      color: 'blue',
      equivalent: `${stats.equivalents.showerMinutesSaved} minutes of shower time`,
    },
    {
      title: 'Energy Saved',
      value: stats.totals.energy || 0,
      unit: 'kWh',
      icon: LightBulbIcon,
      color: 'yellow',
      equivalent: `${stats.equivalents.lightbulbHours} hours of LED light`,
    },
    {
      title: 'Waste Reduced',
      value: stats.totals.waste || 0,
      unit: 'kg',
      icon: TrashIcon,
      color: 'red',
      equivalent: `${stats.equivalents.plasticBottlesSaved} plastic bottles`,
    },
    {
      title: 'CO₂ Avoided',
      value: stats.totals.transport || 0,
      unit: 'kg',
      icon: TruckIcon,
      color: 'green',
      equivalent: `${stats.equivalents.carKmAvoided} km of driving`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {impactCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-${card.color}-500`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-md bg-${card.color}-100 mr-4`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {card.value.toLocaleString()} <span className="text-sm font-normal">{card.unit}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Equivalent to {card.equivalent}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6 border border-green-100">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-green-100 mr-3">
            <GlobeAltIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Your Total Environmental Impact</h3>
        </div>

        <div className="flex items-center justify-center py-4">
          <div className="text-center px-6">
            <div className="p-3 rounded-full bg-green-100 mx-auto mb-2 w-fit">
              <SparklesIcon className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.equivalents.treesEquivalent}</p>
            <p className="text-sm text-gray-600">Trees worth of CO₂ absorbed</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          Your sustainable actions have made a real difference! Keep up the good work to increase your positive impact.
        </p>
      </div>
    </div>
  );
} 