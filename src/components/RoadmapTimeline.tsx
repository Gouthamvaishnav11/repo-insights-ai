import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Clock, Target, Lightbulb } from 'lucide-react';

interface Task {
  title: string;
  description: string;
}

interface TimelineSection {
  period: string;
  icon: typeof Clock;
  color: string;
  tasks: Task[];
}

interface RoadmapTimelineProps {
  roadmap: {
    short_term: Task[];
    mid_term: Task[];
    long_term: Task[];
  };
}

const RoadmapTimeline = ({ roadmap }: RoadmapTimelineProps) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [timelineData, setTimelineData] = useState<TimelineSection[]>([]);

  useEffect(() => {
    if (roadmap) {
      setTimelineData([
        {
          period: 'Short-Term (1-2 weeks)',
          icon: Clock,
          color: 'from-primary to-primary/80',
          tasks: roadmap.short_term,
        },
        {
          period: 'Mid-Term (1-2 months)',
          icon: Target,
          color: 'from-secondary to-secondary/80',
          tasks: roadmap.mid_term,
        },
        {
          period: 'Long-Term (3+ months)',
          icon: Lightbulb,
          color: 'from-accent to-accent/80',
          tasks: roadmap.long_term,
        },
      ]);
    }
  }, [roadmap]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="relative">
      <div className="timeline-line" />
      <div className="space-y-8">
        {timelineData.map((section, sectionIndex) => {
          const isExpanded = expandedSections.includes(sectionIndex);
          const Icon = section.icon;

          return (
            <div key={sectionIndex} className="relative pl-16">
              {/* Icon */}
              <div
                className={`absolute left-0 w-12 h-12 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-foreground">{section.period}</h3>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Tasks */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 space-y-4">
                    {section.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <h4 className="font-medium text-foreground mb-2">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
