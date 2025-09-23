'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
export default function MarksStatsPage() {
  const router = useRouter();

  // Optional: Play a click sound
  const playClickSound = () => {
    const audio = new Audio('/click.mp3'); // Make sure this file exists in /public
    audio.play();
  };

  const cards = [
    {
      emoji: '📝',
      // icon: <FaUpload className="text-4xl text-orange-500" />, // Optional icon version
      title: 'Marks Upload',
      description: 'Upload student marks securely.',
      tooltip: 'Go to upload page',
      onClick: () => {
        playClickSound();
        router.push('/admin/marks/upload-marks');
      },
    },
    {
      emoji: '📄',
      // icon: <FaEye className="text-4xl text-orange-500" />,
      title: 'View Uploaded Marks',
      description: 'See all previously uploaded marks.',
      tooltip: 'Check past uploads',
      onClick: () => {
        playClickSound();
        router.push('/admin/marks/uploadedMarks');
      },
    },
    {
      emoji: '📊',
      // icon: <FaChartBar className="text-4xl text-orange-500" />,
      title: 'View Statistics',
      description: 'Analyze performance of students',
      tooltip: 'Visualize class performance',
      onClick: () => {
        playClickSound();
        router.push('/admin/marks/marksStats');
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-14">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
         Marks Management
      </h1>
      <p className="text-center text-gray-600 mb-10 text-lg">
        Manage and analyze marks 
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            title={card.tooltip} // Native HTML tooltip
            className="group bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:bg-orange-100 hover:shadow-lg cursor-pointer hover:text-orange-800"
            onClick={card.onClick}
          >
            <div className="text-4xl mb-3 transition-transform duration-200 group-hover:scale-110 group-hover:animate-bounce">
              {card.emoji}
              {/* Or replace with icon: card.icon */}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-700">
              {card.title}
            </h2>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
