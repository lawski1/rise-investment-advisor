'use client';

import { Investment } from '@/lib/types';
import InvestmentCard from './InvestmentCard';
import { Star } from 'lucide-react';

interface RecommendationSectionProps {
  title: string;
  investments: Investment[];
  description?: string;
}

export default function RecommendationSection({ title, investments, description }: RecommendationSectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center mb-4">
        <Star className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      {description && (
        <p className="text-gray-600 mb-6">{description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map((investment) => (
          <InvestmentCard key={investment.symbol} investment={investment} />
        ))}
      </div>
    </section>
  );
}

