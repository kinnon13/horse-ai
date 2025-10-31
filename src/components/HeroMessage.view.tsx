// HeroMessage.view.tsx (36 lines)
'use client'

import { Card, CardContent } from '@/components/ui/Card';

export function HeroMessage() {
  const exampleQuestions = [
    '"My mare is limping — what now?"',
    '"Best feed for a 12yo gelding?"',
    '"Find a farrier in Kentucky"',
    '"How to treat thrush?"',
    '"When to call the vet?"'
  ];

  return (
    <Card className="mb-6 border-dashed border-2 border-gray-300">
      <CardContent className="pt-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Ask me anything about <span className="text-green-600">YOUR horse</span>
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Get real answers from real horse data — powered by Grok
        </p>
        <div className="flex flex-wrap gap-2 justify-center text-sm">
          {exampleQuestions.map(q => (
            <button 
              key={q} 
              className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}