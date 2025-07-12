import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Lightbulb, ArrowRight, Clock, BookOpen } from 'lucide-react';

interface MentorSession {
  id: string;
  title: string;
  description: string;
  category: 'guidance' | 'reflection' | 'challenge' | 'integration';
  prompts: MentorPrompt[];
  completed: boolean;
  startedAt?: Date;
  completedAt?: Date;
}

interface MentorPrompt {
  id: string;
  question: string;
  guidance: string;
  followUp?: string;
  response?: string;
}

interface MentorConversation {
  id: string;
  sessionId: string;
  messages: MentorMessage[];
  date: Date;
}

interface MentorMessage {
  id: string;
  type: 'mentor' | 'user';
  content: string;
  timestamp: Date;
}

const mentorSessions: MentorSession[] = [
  {
    id: 'inner-compass',
    title: 'Connecting with Your Inner Compass',
    description: 'Discover the wisdom that already exists within you',
    category: 'guidance',
    completed: false,
    prompts: [
      {
        id: '1',
        question: 'What does your heart know that your mind hasn\'t accepted yet?',
        guidance: 'Take a moment to breathe deeply. Place your hand on your heart and ask this question again. What arises without thinking?',
        followUp: 'What would change in your life if you trusted this heart-knowing completely?'
      },
      {
        id: '2',
        question: 'If you could ask your wisest self one question, what would it be?',
        guidance: 'Imagine yourself 10 years from now, having lived fully and authentically. What question would you ask this wise version of yourself?',
        followUp: 'Now, what answer do you sense this wise self would give you?'
      },
      {
        id: '3',
        question: 'What pattern in your life is ready to be transformed?',
        guidance: 'Notice what keeps showing up in different forms. Your inner wisdom is trying to get your attention through repetition.',
        followUp: 'What gift or lesson might be hidden within this pattern?'
      }
    ]
  },
  {
    id: 'shadow-integration',
    title: 'Embracing Your Shadow',
    description: 'Transform rejected aspects of yourself into sources of power',
    category: 'challenge',
    completed: false,
    prompts: [
      {
        id: '1',
        question: 'What quality do you judge harshly in others?',
        guidance: 'The traits that trigger us most strongly often reflect disowned parts of ourselves. This isn\'t about blame—it\'s about reclaiming your wholeness.',
        followUp: 'How might this quality actually serve you if expressed in a healthy way?'
      },
      {
        id: '2',
        question: 'What would you do if you knew no one would judge you?',
        guidance: 'Behind our masks often lies our authentic power. What aspects of yourself have you hidden to avoid judgment?',
        followUp: 'What small step could you take toward expressing this authentic part of yourself?'
      },
      {
        id: '3',
        question: 'What emotion do you resist feeling the most?',
        guidance: 'Our avoided emotions often carry important messages. They\'re not enemies—they\'re messengers waiting to be heard.',
        followUp: 'If this emotion could speak, what would it be trying to tell you?'
      }
    ]
  },
  {
    id: 'purpose-calling',
    title: 'Hearing Your Soul\'s Calling',
    description: 'Tune into the deeper purpose seeking expression through you',
    category: 'guidance',
    completed: false,
    prompts: [
      {
        id: '1',
        question: 'What breaks your heart about the world?',
        guidance: 'Often our deepest pain points to our deepest purpose. What you care about most deeply is rarely accidental.',
        followUp: 'How might your unique gifts address this heartbreak?'
      },
      {
        id: '2',
        question: 'What would you create if resources were unlimited?',
        guidance: 'Remove all practical limitations from your imagination. What wants to emerge through you into the world?',
        followUp: 'What essence of this vision could you begin manifesting now, regardless of resources?'
      },
      {
        id: '3',
        question: 'When do you feel most alive and authentic?',
        guidance: 'Notice the conditions, activities, and states of being where your true self shines most brightly.',
        followUp: 'How can you create more of these conditions in your daily life?'
      }
    ]
  },
  {
    id: 'conscious-relationships',
    title: 'Conscious Relationships',
    description: 'Transform your connections through inner work',
    category: 'reflection',
    completed: false,
    prompts: [
      {
        id: '1',
        question: 'What patterns do you repeat in relationships?',
        guidance: 'Our relationships are mirrors, showing us aspects of ourselves we might not see otherwise. What keeps showing up?',
        followUp: 'What wound or need might be driving this pattern?'
      },
      {
        id: '2',
        question: 'How do you abandon yourself in relationships?',
        guidance: 'Sometimes we lose ourselves trying to maintain connections. Notice where you dim your light or silence your truth.',
        followUp: 'What would change if you committed to honoring yourself as much as others?'
      },
      {
        id: '3',
        question: 'What do you need to forgive yourself for?',
        guidance: 'Self-forgiveness is the foundation of all other forgiveness. What weight are you carrying that\'s ready to be released?',
        followUp: 'What would become possible if you truly forgave yourself for this?'
      }
    ]
  }
];

export function InnerMentor() {
  const [sessions, setSessions] = useState<MentorSession[]>(mentorSessions);
  const [activeSession, setActiveSession] = useState<MentorSession | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [conversations, setConversations] = useState<MentorConversation[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  useEffect(() => {
    // Load saved sessions and conversations
    const savedSessions = localStorage.getItem('mentorSessions');
    const savedConversations = localStorage.getItem('mentorConversations');
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions).map((s: any) => ({
        ...s,
        startedAt: s.startedAt ? new Date(s.startedAt) : undefined,
        completedAt: s.completedAt ? new Date(s.completedAt) : undefined
      })));
    }
    
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations).map((c: any) => ({
        ...c,
        date: new Date(c.date),
        messages: c.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mentorSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('mentorConversations', JSON.stringify(conversations));
  }, [conversations]);

  const startSession = (session: MentorSession) => {
    setActiveSession(session);
    setCurrentPromptIndex(0);
    
    // Mark session as started
    if (!session.startedAt) {
      setSessions(sessions.map(s => 
        s.id === session.id 
          ? { ...s, startedAt: new Date() }
          : s
      ));
    }
  };

  const submitResponse = () => {
    if (!activeSession || !currentResponse.trim()) return;

    const currentPrompt = activeSession.prompts[currentPromptIndex];
    
    // Create or update conversation
    const conversationId = `${activeSession.id}-${new Date().toDateString()}`;
    const existingConversation = conversations.find(c => c.id === conversationId);
    
    const mentorMessage: MentorMessage = {
      id: Date.now().toString(),
      type: 'mentor',
      content: currentPrompt.question,
      timestamp: new Date()
    };
    
    const userMessage: MentorMessage = {
      id: (Date.now() + 1).toString(),
      type: 'user',
      content: currentResponse,
      timestamp: new Date()
    };

    const followUpMessage: MentorMessage | null = currentPrompt.followUp ? {
      id: (Date.now() + 2).toString(),
      type: 'mentor',
      content: currentPrompt.followUp,
      timestamp: new Date()
    } : null;

    if (existingConversation) {
      setConversations(conversations.map(c => 
        c.id === conversationId 
          ? { 
              ...c, 
              messages: [
                ...c.messages, 
                mentorMessage, 
                userMessage,
                ...(followUpMessage ? [followUpMessage] : [])
              ]
            }
          : c
      ));
    } else {
      const newConversation: MentorConversation = {
        id: conversationId,
        sessionId: activeSession.id,
        date: new Date(),
        messages: [
          mentorMessage, 
          userMessage,
          ...(followUpMessage ? [followUpMessage] : [])
        ]
      };
      setConversations([...conversations, newConversation]);
    }

    // Update session with response
    setSessions(sessions.map(s => 
      s.id === activeSession.id 
        ? {
            ...s,
            prompts: s.prompts.map((p, index) => 
              index === currentPromptIndex 
                ? { ...p, response: currentResponse }
                : p
            )
          }
        : s
    ));

    setCurrentResponse('');
    
    // Move to next prompt or complete session
    if (currentPromptIndex < activeSession.prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    if (!activeSession) return;
    
    setSessions(sessions.map(s => 
      s.id === activeSession.id 
        ? { ...s, completed: true, completedAt: new Date() }
        : s
    ));
    
    setActiveSession(null);
    setCurrentPromptIndex(0);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      guidance: 'text-blue-400',
      reflection: 'text-purple-400',
      challenge: 'text-orange-400',
      integration: 'text-green-400'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400';
  };

  const getCategoryBg = (category: string) => {
    const colors = {
      guidance: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      reflection: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
      challenge: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
      integration: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500/20 to-gray-500/20 border-gray-500/30';
  };

  if (activeSession) {
    const currentPrompt = activeSession.prompts[currentPromptIndex];
    const progress = ((currentPromptIndex + 1) / activeSession.prompts.length) * 100;

    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">{activeSession.title}</h2>
                <p className="text-purple-200/80">{activeSession.description}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveSession(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Exit Session
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-purple-300 mb-2">
              <span>Progress</span>
              <span>{currentPromptIndex + 1} of {activeSession.prompts.length}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Prompt */}
          <div className="bg-white/5 p-8 rounded-2xl border border-blue-500/20 mb-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 mb-4">
                  <p className="text-lg text-white font-medium mb-2">{currentPrompt.question}</p>
                  <p className="text-sm text-blue-200/70 italic">{currentPrompt.guidance}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-purple-200">
                Your Response
              </label>
              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
                placeholder="Take your time to reflect deeply... there are no wrong answers, only authentic ones."
              />
              
              <div className="flex justify-end space-x-4">
                {currentPromptIndex > 0 && (
                  <button
                    onClick={() => setCurrentPromptIndex(currentPromptIndex - 1)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={submitResponse}
                  disabled={!currentResponse.trim()}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  <span>
                    {currentPromptIndex === activeSession.prompts.length - 1 ? 'Complete Session' : 'Continue'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <User className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Inner Mentor</h2>
          <p className="text-purple-200/80">Connect with your deepest wisdom through guided self-inquiry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sessions */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-purple-200 mb-6">Mentoring Sessions</h3>
          <div className="space-y-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-6 rounded-xl border bg-gradient-to-br ${getCategoryBg(session.category)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className={`w-6 h-6 ${getCategoryColor(session.category)}`} />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{session.title}</h4>
                      <p className={`text-sm capitalize ${getCategoryColor(session.category)}`}>
                        {session.category}
                      </p>
                    </div>
                  </div>
                  {session.completed && (
                    <div className="text-2xl">✓</div>
                  )}
                </div>

                <p className="text-purple-200/80 mb-4">{session.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-purple-300">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{session.prompts.length} prompts</span>
                    </div>
                    {session.startedAt && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Started {session.startedAt.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => startSession(session)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      session.completed
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : session.startedAt
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                    }`}
                  >
                    {session.completed ? 'Review' : session.startedAt ? 'Continue' : 'Begin'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Recent Insights</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversations
              .slice(-5)
              .reverse()
              .map((conversation) => (
                <div key={conversation.id} className="bg-white/5 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-200">
                      {sessions.find(s => s.id === conversation.sessionId)?.title}
                    </span>
                    <span className="text-xs text-purple-300">
                      {conversation.date.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {conversation.messages.slice(-2).map((message) => (
                      <div
                        key={message.id}
                        className={`p-2 rounded text-sm ${
                          message.type === 'mentor'
                            ? 'bg-blue-500/10 text-blue-200'
                            : 'bg-white/5 text-white'
                        }`}
                      >
                        <p className="line-clamp-2">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {conversations.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
              <p className="text-blue-200/60 text-sm">
                Your insights and conversations will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}