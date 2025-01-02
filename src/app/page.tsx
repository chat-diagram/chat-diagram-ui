"use client";

import { Sender } from '@ant-design/x';
import { X } from 'lucide-react'
import { useState } from 'react';

export default function Home() {
  const [showUpgrade, setShowUpgrade] = useState(true);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-4xl flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">What can I help you ship?</h1>
          <p className="text-muted-foreground">Enter your message, and I&apos;ll generate the diagram you need.</p>  
        </div>
        <div className="relative flex flex-col gap-4 mt-10">
          <div className="flex w-full absolute top-[40px] right-0 left-0">
            <Sender 
              style={{ 
                backgroundColor: 'white',
                width: '100%',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              placeholder="Type your message here..."
            />
          </div>
          {showUpgrade && (
            <div className="flex items-center justify-between rounded-lg border bg-gray-50 py-2 px-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">Upgrade to Pro to unlock all features</span>
              </div>
              <button 
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setShowUpgrade(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-20">
          <h2 className="mb-4 text-lg font-medium">Diagram Templates</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-lg border p-4 hover:bg-accent">
              <h3 className="font-medium">Create Sequence Diagram</h3>
              <p className="text-sm text-muted-foreground">Show interactions between system components</p>
            </div>
            <div className="rounded-lg border p-4 hover:bg-accent">
              <h3 className="font-medium">Create Flow Chart</h3>
              <p className="text-sm text-muted-foreground">Visualize business processes and decision paths</p>
            </div>
            <div className="rounded-lg border p-4 hover:bg-accent">
              <h3 className="font-medium">Create Architecture Diagram</h3>
              <p className="text-sm text-muted-foreground">Illustrate system architecture and components</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
