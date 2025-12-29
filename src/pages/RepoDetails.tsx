import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, GitBranch, GitCommit, Calendar, FileCode, CheckCircle, XCircle, ChevronRight, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import axios from 'axios';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

// Recursive file tree component
const FileTree = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(depth < 2);

  if (node.type === 'file') {
    return (
      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors" style={{ paddingLeft: `${depth * 16 + 8}px` }}>
        <FileCode className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors w-full text-left"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        <span className="text-sm font-medium text-foreground">{node.name}</span>
      </button>
      {isOpen && node.children && node.children.map((child, i) => <FileTree key={i} node={child} depth={depth + 1} />)}
    </div>
  );
};

const RepoDetails = () => {
  const [repoData, setRepoData] = useState<any>(null);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/repo-details');
        setRepoData(res.data);
      } catch (err) {
        console.error('Error fetching repo details:', err);
      }
    };
    fetchRepoData();
  }, []);

  if (!repoData) return <p className="text-center mt-20">Loading repository details...</p>;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <main className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 animate-fade-in">
            <Link to="/results">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {repoData.owner}/<span className="gradient-text">{repoData.name}</span>
              </h1>
              <p className="text-muted-foreground text-sm">Repository Details</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="glass-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <GitCommit className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{repoData.commits}</p>
                  <p className="text-sm text-muted-foreground">Total Commits</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{repoData.lastUpdated}</p>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  {repoData.hasTests ? (
                    <CheckCircle className="w-5 h-5 text-score-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-score-danger" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {repoData.hasTests ? repoData.testFramework : 'No Tests'}
                  </p>
                  <p className="text-sm text-muted-foreground">Test Detection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Languages */}
            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary" />
                Languages Used
              </h2>
              <div className="space-y-4">
                {repoData.languages.map((lang: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{lang.name}</span>
                      <span className="text-muted-foreground">{lang.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: lang.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Structure */}
            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                File Structure
              </h2>
              <div className="max-h-80 overflow-y-auto">
                {repoData.fileStructure.map((node: FileNode, index: number) => (
                  <FileTree key={index} node={node} />
                ))}
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mt-12 animate-fade-in">
            <Link to="/results">
              <Button variant="glass" size="lg">
                <ArrowLeft className="w-5 h-5" />
                Back to Results
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepoDetails;
