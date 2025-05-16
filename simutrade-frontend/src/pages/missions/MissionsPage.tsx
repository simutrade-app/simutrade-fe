import React, { useState, useEffect } from 'react';
import AIService from '../../services/AIService';
import {
  FaTrophy,
  FaFilter,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChevronRight,
  FaChevronLeft,
  FaClock,
  FaCheck,
  FaChartLine,
  FaExclamationTriangle,
  FaMedal,
  FaFlag,
  FaArrowUp,
  FaSearch,
  FaGlobe,
  FaUser,
} from 'react-icons/fa';

// Types
interface MissionStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number; // 1-5
  deadline: string;
  progress: number; // 0-100
  steps: MissionStep[];
  rewards: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  missionsCompleted: number;
  trend: 'up' | 'down' | 'stable';
}

// Sample Data for UI display (would come from AI in production)
const sampleMissions: Mission[] = [
  {
    id: 'm1',
    title: 'Market Research Fundamentals',
    description:
      'Learn the basics of international market research and complete a mini analysis.',
    category: 'Research',
    difficulty: 2,
    deadline: '2023-12-15',
    progress: 75,
    status: 'in_progress',
    steps: [
      {
        id: 's1',
        title: 'Understand Target Market Demographics',
        description:
          'Research and document the key demographics of your target export market.',
        isCompleted: true,
      },
      {
        id: 's2',
        title: 'Analyze Competitor Landscape',
        description:
          'Identify at least 3 competitors and their strategies in the target market.',
        isCompleted: true,
      },
      {
        id: 's3',
        title: 'Document Local Regulations',
        description:
          'List all import regulations and compliance requirements for your product.',
        isCompleted: true,
      },
      {
        id: 's4',
        title: 'Create Market Entry Strategy',
        description:
          'Develop a preliminary market entry strategy based on your findings.',
        isCompleted: false,
      },
    ],
    rewards: [
      'Market Researcher Badge',
      '500 Trade Points',
      'Strategy Template',
    ],
  },
  {
    id: 'm2',
    title: 'Supply Chain Optimization',
    description:
      "Optimize your product's international supply chain to reduce costs and time.",
    category: 'Logistics',
    difficulty: 4,
    deadline: '2023-12-30',
    progress: 25,
    status: 'in_progress',
    steps: [
      {
        id: 's1',
        title: 'Map Current Supply Chain',
        description:
          'Create a detailed map of your current supply chain process.',
        isCompleted: true,
      },
      {
        id: 's2',
        title: 'Identify Bottlenecks',
        description: 'Analyze and identify areas of delay or inefficiency.',
        isCompleted: false,
      },
      {
        id: 's3',
        title: 'Research Alternative Routes',
        description:
          'Explore at least 2 alternative shipping routes or methods.',
        isCompleted: false,
      },
      {
        id: 's4',
        title: 'Calculate Cost Benefits',
        description:
          'Quantify the potential savings from your optimization strategy.',
        isCompleted: false,
      },
      {
        id: 's5',
        title: 'Draft Implementation Plan',
        description:
          'Create an actionable implementation plan for your optimized supply chain.',
        isCompleted: false,
      },
    ],
    rewards: [
      'Supply Chain Master Badge',
      '750 Trade Points',
      'Logistics Consultation',
    ],
  },
  {
    id: 'm3',
    title: 'Export Documentation Mastery',
    description:
      'Master the essential documentation needed for international trade.',
    category: 'Compliance',
    difficulty: 3,
    deadline: '2023-12-10',
    progress: 100,
    status: 'completed',
    steps: [
      {
        id: 's1',
        title: 'Commercial Invoice Preparation',
        description:
          'Learn how to correctly prepare a commercial invoice for exports.',
        isCompleted: true,
      },
      {
        id: 's2',
        title: 'Certificate of Origin',
        description:
          'Understand the process of obtaining and completing a Certificate of Origin.',
        isCompleted: true,
      },
      {
        id: 's3',
        title: 'Bills of Lading',
        description: 'Master the details of creating accurate Bills of Lading.',
        isCompleted: true,
      },
      {
        id: 's4',
        title: 'Export Declarations',
        description: 'Complete a sample Export Declaration for your product.',
        isCompleted: true,
      },
    ],
    rewards: [
      'Documentation Expert Badge',
      '600 Trade Points',
      'Document Template Pack',
    ],
  },
  {
    id: 'm4',
    title: 'Trade Finance Essentials',
    description:
      'Learn the fundamentals of financing international trade operations.',
    category: 'Finance',
    difficulty: 3,
    deadline: '2024-01-15',
    progress: 0,
    status: 'not_started',
    steps: [
      {
        id: 's1',
        title: 'Payment Methods Overview',
        description:
          'Learn about different international payment methods and their risks.',
        isCompleted: false,
      },
      {
        id: 's2',
        title: 'Letters of Credit',
        description:
          'Understand how Letters of Credit work and how to use them.',
        isCompleted: false,
      },
      {
        id: 's3',
        title: 'Export Credit Insurance',
        description:
          'Explore options for insuring your international transactions.',
        isCompleted: false,
      },
      {
        id: 's4',
        title: 'Trade Finance Application',
        description: 'Complete a sample application for trade financing.',
        isCompleted: false,
      },
    ],
    rewards: [
      'Finance Analyst Badge',
      '550 Trade Points',
      'Risk Assessment Tool',
    ],
  },
  {
    id: 'm5',
    title: 'Cultural Intelligence for Exporters',
    description:
      'Develop cultural intelligence to effectively negotiate with global partners.',
    category: 'Negotiation',
    difficulty: 2,
    deadline: '2023-11-30',
    progress: 0,
    status: 'expired',
    steps: [
      {
        id: 's1',
        title: 'Cultural Dimensions Research',
        description:
          'Research and understand key cultural dimensions of your target market.',
        isCompleted: false,
      },
      {
        id: 's2',
        title: 'Negotiation Styles Analysis',
        description: 'Identify different negotiation styles across cultures.',
        isCompleted: false,
      },
      {
        id: 's3',
        title: 'Communication Protocol',
        description: 'Develop a communication protocol for your target market.',
        isCompleted: false,
      },
      {
        id: 's4',
        title: 'Role-Play Scenario',
        description:
          'Complete a simulated cross-cultural negotiation scenario.',
        isCompleted: false,
      },
    ],
    rewards: [
      'Cultural Intelligence Badge',
      '450 Trade Points',
      'Market Entry Guide',
    ],
  },
];

const sampleLeaderboard: LeaderboardEntry[] = [
  {
    id: 'u1',
    rank: 1,
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    score: 9850,
    missionsCompleted: 15,
    trend: 'up',
  },
  {
    id: 'u2',
    rank: 2,
    name: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    score: 8720,
    missionsCompleted: 13,
    trend: 'stable',
  },
  {
    id: 'u3',
    rank: 3,
    name: 'Alex Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    score: 7650,
    missionsCompleted: 12,
    trend: 'up',
  },
  {
    id: 'u4',
    rank: 4,
    name: 'Emma Watson',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    score: 6980,
    missionsCompleted: 11,
    trend: 'down',
  },
  {
    id: 'u5',
    rank: 5,
    name: 'David Kim',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    score: 6250,
    missionsCompleted: 10,
    trend: 'up',
  },
];

// Sample user stats
const userStats = {
  completedMissions: 5,
  inProgressMissions: 2,
  totalPoints: 3200,
  rank: 12,
  badges: 7,
};

const MissionsPage: React.FC = () => {
  // State
  const [missions, setMissions] = useState<Mission[]>(sampleMissions);
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(sampleLeaderboard);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // This would be the function to communicate with AI
  const generateMissionsFromAI = async () => {
    setLoading(true);
    try {
      // Example prompt for generating missions
      const prompt =
        'Generate 3 export trade missions for a beginner trader focusing on market research, documentation, and basic negotiations. Include step-by-step instructions and completion criteria.';

      // Would use AIService.createChat to get AI-generated missions
      // const response = await AIService.createChat(prompt);
      // Process the response and update missions

      // For now, just simulate a delay and use sample data
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating missions:', error);
      setLoading(false);
    }
  };

  // Filter missions based on current filters and search
  const filteredMissions = missions.filter((mission) => {
    // Filter by status
    if (filter !== 'all' && mission.status !== filter) return false;

    // Filter by difficulty
    if (difficulty !== null && mission.difficulty !== difficulty) return false;

    // Filter by search query
    if (
      searchQuery &&
      !mission.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !mission.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Function to render star rating based on difficulty
  const renderDifficultyStars = (difficulty: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= difficulty) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i - 0.5 === difficulty) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  // Render mission details modal
  const renderMissionDetails = () => {
    if (!selectedMission) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-5 flex justify-between items-center">
            <h2 className="text-xl font-bold">{selectedMission.title}</h2>
            <button
              onClick={() => setSelectedMission(null)}
              className="text-white hover:text-green-200 transition-colors"
              aria-label="Close mission details"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Mission info */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-between items-start mb-4 gap-3">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMission.status)}`}
                  >
                    {getStatusText(selectedMission.status)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 flex items-center inline-flex">
                    <FaClock className="mr-1" />
                    Deadline:{' '}
                    {new Date(selectedMission.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex">
                  {renderDifficultyStars(selectedMission.difficulty)}
                </div>
              </div>

              <p className="text-gray-700 mb-5">
                {selectedMission.description}
              </p>

              <div className="mb-1 text-xs text-gray-500 flex justify-between">
                <span>Mission Progress</span>
                <span>{selectedMission.progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    selectedMission.progress === 100
                      ? 'bg-green-600'
                      : selectedMission.progress > 50
                        ? 'bg-green-500'
                        : 'bg-green-400'
                  }`}
                  style={{ width: `${selectedMission.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Steps */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <FaFlag className="mr-2 text-green-600" /> Mission Steps
              </h3>
              <div className="space-y-4">
                {selectedMission.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`border rounded-lg p-5 transition-all ${
                      step.isCompleted
                        ? 'bg-green-50 border-green-100'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0 ${
                          step.isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step.isCompleted ? <FaCheck /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${
                            step.isCompleted
                              ? 'text-green-600'
                              : 'text-gray-800'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-gray-600 mt-1 mb-3">
                          {step.description}
                        </p>

                        {!step.isCompleted &&
                          selectedMission.status !== 'expired' && (
                            <button
                              className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-1.5 rounded-lg text-sm transition-colors border border-green-100 font-medium"
                              onClick={() => {
                                // This would mark the step as completed
                                console.log('Mark step as completed:', step.id);
                              }}
                              aria-label={`Mark step ${index + 1} as complete`}
                            >
                              Mark as Complete
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <FaMedal className="mr-2 text-yellow-500" /> Rewards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedMission.rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center transition-all hover:bg-yellow-100"
                  >
                    <FaMedal className="text-yellow-500 mr-3 text-xl flex-shrink-0" />
                    <span className="text-yellow-800 font-medium">
                      {reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-5 flex justify-between bg-gray-50">
            <button
              className="text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setSelectedMission(null)}
            >
              Close
            </button>

            {selectedMission.status !== 'completed' &&
              selectedMission.status !== 'expired' && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  onClick={() => {
                    // This would update the mission status
                    console.log('Complete mission:', selectedMission.id);
                  }}
                >
                  {selectedMission.progress === 100
                    ? 'Claim Rewards'
                    : 'Continue Mission'}
                </button>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-8 shadow-md">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <FaTrophy className="mr-3 text-yellow-300" /> Trade Missions Hub
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white bg-opacity-15 rounded-xl p-5 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 shadow-sm">
              <div className="text-4xl font-bold mb-1">
                {userStats.completedMissions}
              </div>
              <div className="text-sm opacity-90 font-medium">
                Completed Missions
              </div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-xl p-5 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 shadow-sm">
              <div className="text-4xl font-bold mb-1">
                {userStats.inProgressMissions}
              </div>
              <div className="text-sm opacity-90 font-medium">
                Missions in Progress
              </div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-xl p-5 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 shadow-sm">
              <div className="text-4xl font-bold mb-1">
                {userStats.totalPoints}
              </div>
              <div className="text-sm opacity-90 font-medium">Trade Points</div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-xl p-5 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 shadow-sm">
              <div className="text-4xl font-bold mb-1">#{userStats.rank}</div>
              <div className="text-sm opacity-90 font-medium">Global Rank</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Missions */}
          <div className="w-full lg:w-2/3">
            {/* Filter Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
              <div className="flex flex-wrap items-start gap-5">
                <div className="flex-1 min-w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search missions..."
                      className="w-full border-gray-300 border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full min-w-[180px] border-gray-300 border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    aria-label="Filter by status"
                  >
                    <option value="all">All Missions</option>
                    <option value="in_progress">In Progress</option>
                    <option value="not_started">Not Started</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    className="w-full min-w-[180px] border-gray-300 border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
                    value={difficulty || ''}
                    onChange={(e) =>
                      setDifficulty(
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    aria-label="Filter by difficulty"
                  >
                    <option value="">Any Difficulty</option>
                    <option value="1">★ Beginner</option>
                    <option value="2">★★ Easy</option>
                    <option value="3">★★★ Intermediate</option>
                    <option value="4">★★★★ Advanced</option>
                    <option value="5">★★★★★ Expert</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mission Cards */}
            <div className="space-y-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600">Loading missions...</p>
                </div>
              ) : filteredMissions.length > 0 ? (
                filteredMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md hover:border-gray-200"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors mb-2">
                            {mission.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(mission.status)}`}
                            >
                              {getStatusText(mission.status)}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <FaClock className="mr-1" />
                              {new Date(mission.deadline) < new Date()
                                ? 'Expired'
                                : `Due ${new Date(mission.deadline).toLocaleDateString()}`}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <FaFlag className="mr-1" />
                              {mission.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex">
                          {renderDifficultyStars(mission.difficulty)}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        {mission.description}
                      </p>

                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="w-full sm:w-3/5">
                          <div className="mb-1 text-xs text-gray-500 flex justify-between">
                            <span>Progress</span>
                            <span>{mission.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                mission.progress === 100
                                  ? 'bg-green-600'
                                  : mission.progress > 50
                                    ? 'bg-green-500'
                                    : 'bg-green-400'
                              }`}
                              style={{ width: `${mission.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedMission(mission)}
                          className="px-5 py-2 rounded-lg bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-colors border border-green-100 w-full sm:w-auto whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          View Details
                          <FaChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
                  <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    No missions found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search query to find the
                    missions you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setFilter('all');
                      setDifficulty(null);
                      setSearchQuery('');
                    }}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Leaderboard & Achievements */}
          <div className="w-full lg:w-1/3 space-y-8">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-5">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaGlobe className="mr-2" /> Global Leaderboard
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {leaderboard.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 mr-3">
                        #{entry.rank}
                      </div>
                      <div className="w-10 h-10 mr-4">
                        <img
                          src={entry.avatar}
                          alt={`${entry.name}'s avatar`}
                          className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {entry.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.missionsCompleted} missions completed
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">
                          {entry.score.toLocaleString()}
                        </div>
                        <div
                          className={`text-xs flex items-center justify-end ${
                            entry.trend === 'up'
                              ? 'text-green-600'
                              : entry.trend === 'down'
                                ? 'text-red-500'
                                : 'text-gray-500'
                          }`}
                        >
                          {entry.trend === 'up' ? (
                            <>
                              <FaArrowUp className="mr-1" />
                              Rising
                            </>
                          ) : entry.trend === 'down' ? (
                            <>
                              <FaArrowUp className="mr-1 transform rotate-180" />
                              Falling
                            </>
                          ) : (
                            'Stable'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                <span className="text-gray-600 text-sm">
                  Your Global Rank:{' '}
                </span>
                <span className="font-bold text-green-600">
                  #{userStats.rank}
                </span>
              </div>
            </div>

            {/* Additional sidebar content here */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-yellow-500 text-white p-5">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaTrophy className="mr-2" /> Weekly Challenge
                </h2>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Export Documentation Mastery
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete 3 documentation-related missions this week to earn
                  bonus trade points and a special badge.
                </p>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: '33%' }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  1 of 3 completed
                </div>
                <button className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium py-2 rounded-lg border border-yellow-200 transition-colors mx-auto px-4 text-sm">
                  View Challenge Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Generate New Missions Section */}
      <div className="container mx-auto px-6 pt-5 pb-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Match the layout structure of the content above */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Need more challenges?
              </h3>
              <p className="text-gray-600 mb-4">
                Let our AI create custom trade missions tailored to your skill
                level and interests.
              </p>
              <div className="text-right">
                <button
                  onClick={generateMissionsFromAI}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>Generate New Missions</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Empty div to maintain layout structure */}
          <div className="w-full lg:w-1/3"></div>
        </div>
      </div>

      {/* Mission Details Modal */}
      {selectedMission && renderMissionDetails()}
    </div>
  );
};

export default MissionsPage;
