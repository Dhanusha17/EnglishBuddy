"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Loader2, Users, CheckCircle, Activity, Award, TrendingUp, TrendingDown, 
  Search, Download, RefreshCw, FileText, UserPlus, PlayCircle, Trophy, Clock, 
  BookOpen, Target, CalendarDays, Zap, FileSpreadsheet, PlusCircle, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [timeRange, setTimeRange] = useState("last30Days");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?timeRange=\${timeRange}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      setData(d);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const runFetch = async () => {
      await fetchAnalytics();
    };
    runFetch();
  }, [timeRange]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
    };
    handleSearch();

    if (!searchQuery || searchQuery.length < 2) return;

    const delay = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/admin/search?q=\${encodeURIComponent(searchQuery)}`);
        const d = await res.json();
        setSearchResults(d.results || []);
      } catch (e) {
        console.error("Search failed");
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleExport = (format: string) => {
    if (!data) return;
    if (format === 'CSV') {
      const csvData = [
        ['Metric', 'Value'],
        ['Total Users', data.kpis.totalUsers.value],
        ['Active Users', data.kpis.activeUsers.value],
        ['Course Completion Rate', data.kpis.courseCompletionRate.value + '%'],
        ['AI Interactions', data.kpis.aiInteractions.value],
      ];
      const csvContent = csvData.map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `analytics_\${timeRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'PDF' || format === 'Print') {
      window.print();
    }
  };

  const renderTrend = (current: number, prev: number) => {
    if (!prev || prev === 0) return <span className="text-gray-400 text-xs flex items-center"><TrendingUp size={12} className="mr-1"/> No prior data</span>;
    const change = ((current - prev) / prev) * 100;
    const isUp = change >= 0;
    return (
      <span className={`text-xs flex items-center font-medium \${isUp ? 'text-green-600' : 'text-red-600'}`}>
        {isUp ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
        {Math.abs(change).toFixed(1)}% \${timeRange === 'thisYear' ? 'vs last year' : 'vs prev period'}
      </span>
    );
  };

  if (error) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="p-4 bg-red-100 text-red-600 rounded-full">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Failed to load dashboard</h2>
        <p className="text-gray-500">{error}</p>
        <button onClick={fetchAnalytics} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform-wide statistics, growth tracking, and engagement metrics.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search across platform..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery.length >= 2 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500 text-sm"><Loader2 className="w-4 h-4 animate-spin mx-auto inline mr-2"/> Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map(res => (
                      <Link key={res.id + res.type} href={res.link} className="flex flex-col p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700/50 last:border-0 transition">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{res.title}</span>
                        <span className="text-xs text-gray-500">{res.type} • {res.subtitle}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No results found.</div>
                )}
              </div>
            )}
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="py-2 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="last90Days">Last 90 Days</option>
            <option value="thisYear">This Year</option>
          </select>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <Download size={16} /> Export
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40 flex flex-col py-1">
              <button onClick={() => handleExport('CSV')} className="text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">CSV</button>
              <button onClick={() => handleExport('Print')} className="text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">PDF / Print</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex overflow-x-auto pb-2 gap-4 scrollbar-hide">
        {[
          { label: "Create Course", icon: PlusCircle, href: "/admin/courses", color: "bg-teal-50 text-teal-600 dark:bg-teal-900/30" },
          { label: "Create Quiz", icon: Target, href: "/admin/quizzes", color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30" },
          { label: "Approve Users", icon: UserPlus, href: "/admin/users/pending", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30" },
          { label: "Announce", icon: FileText, href: "/admin/communications", color: "bg-orange-50 text-orange-600 dark:bg-orange-900/30" },
        ].map(action => (
          <Link key={action.label} href={action.href} className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition">
            <div className={`p-1.5 rounded-lg \${action.color}`}><action.icon size={16} /></div>
            <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-xl"><Users size={24} /></div>
                {renderTrend(data.kpis.totalUsers.value, data.kpis.totalUsers.prev)}
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">{data.kpis.totalUsers.value === 0 ? "No activity yet" : data.kpis.totalUsers.value.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500 mt-1">Total Students</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-xl"><CheckCircle size={24} /></div>
                {renderTrend(data.kpis.activeUsers.value, data.kpis.activeUsers.prev)}
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">{data.kpis.activeUsers.value === 0 ? "No activity yet" : data.kpis.activeUsers.value.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500 mt-1">Active Students</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl"><Award size={24} /></div>
                {renderTrend(data.kpis.courseCompletionRate.value, data.kpis.courseCompletionRate.prev)}
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">{data.kpis.courseCompletionRate.value}%</div>
                <div className="text-sm font-medium text-gray-500 mt-1">Course Completion Rate</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl"><Zap size={24} /></div>
                {renderTrend(data.kpis.aiInteractions.value, data.kpis.aiInteractions.prev)}
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">{data.kpis.aiInteractions.value === 0 ? "No activity yet" : data.kpis.aiInteractions.value.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500 mt-1">AI Interactions</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* User Growth */}
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">User Growth Trend</h3>
              <div className="h-[300px] w-full">
                {data.charts.weeklyUserGrowth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.charts.weeklyUserGrowth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                      <Line type="monotone" dataKey="count" name="New Users" stroke="#0d9488" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Activity size={32} className="mb-2 opacity-50" />
                    <p>No user growth data for this period.</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Usage */}
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">AI Usage Trend</h3>
              <div className="h-[300px] w-full">
                {data.charts.aiUsageTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.charts.aiUsageTrend}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                      <Area type="monotone" dataKey="count" name="AI Interactions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Zap size={32} className="mb-2 opacity-50" />
                    <p>No AI interactions recorded.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Course Completion */}
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">Course Completions</h3>
              <div className="h-[300px] w-full">
                {data.charts.courseCompletion.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.courseCompletion} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.2} />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 500}} width={120} />
                      <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                      <Bar dataKey="completed" name="Completions" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <BookOpen size={32} className="mb-2 opacity-50" />
                    <p>No course completions recorded.</p>
                  </div>
                )}
              </div>
            </div>

            {/* XP Distribution */}
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">XP Distribution</h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                {data.charts.xpDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.charts.xpDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {data.charts.xpDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Trophy size={32} className="mb-2 opacity-50" />
                    <p>No XP data available.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Engagement Panel & Activity Feed */}
            <div className="xl:col-span-1 space-y-6">
              
              <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Activity className="text-teal-600" /> Platform Engagement
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Active Students Today", val: data.engagementPanel.activeStudentsToday },
                    { label: "New Registrations", val: data.engagementPanel.newRegistrations },
                    { label: "Lessons Completed", val: data.engagementPanel.lessonsCompleted },
                    { label: "Quizzes Passed", val: data.engagementPanel.quizzesPassed },
                    { label: "AI Requests", val: data.engagementPanel.aiRequests },
                    { label: "Certificates Generated", val: data.engagementPanel.certificatesGenerated },
                    { label: "Average Quiz Score", val: `${data.engagementPanel.avgQuizScore}%` },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                      <span className="text-gray-500 text-sm">{stat.label}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{stat.val || 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col h-[400px]">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="text-purple-600" /> Recent Activity
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
                  {data.recentActivity.length > 0 ? (
                    <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                  ) : null}
                  {data.recentActivity.length > 0 ? (
                    data.recentActivity.map((activity: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-4 relative z-10">
                        <div className="w-4 h-4 mt-1 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white leading-tight">
                            {activity.description}
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {new Date(activity.time).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                      <Clock size={32} className="mb-2 opacity-50" />
                      <p>Waiting for activity.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* LEADERBOARD */}
            <div className="xl:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="text-teal-600" /> Top Students Leaderboard
                </h3>
                <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-1 rounded-md uppercase tracking-wider">Top 10</span>
              </div>
              <div className="overflow-x-auto flex-1 p-2">
                {data.leaderboard.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-gray-800">
                        <th className="p-4 whitespace-nowrap">Rank</th>
                        <th className="p-4">Student</th>
                        <th className="p-4">Level</th>
                        <th className="p-4">Total XP</th>
                        <th className="p-4">Streak</th>
                        <th className="p-4 hidden sm:table-cell">Courses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.leaderboard.map((student: any, idx: number) => (
                        <tr key={student.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="p-4 text-center">
                            {idx === 0 ? <span className="inline-flex w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 items-center justify-center font-bold">1</span> :
                             idx === 1 ? <span className="inline-flex w-8 h-8 rounded-full bg-gray-200 text-gray-600 items-center justify-center font-bold">2</span> :
                             idx === 2 ? <span className="inline-flex w-8 h-8 rounded-full bg-amber-100 text-amber-700 items-center justify-center font-bold">3</span> :
                             <span className="text-gray-500 font-medium">#{idx + 1}</span>}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-[200px]">{student.name}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-[200px]">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-800">
                              <Target size={12}/> Lvl {student.level}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-teal-600">{student.xp.toLocaleString()} XP</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-orange-500 font-medium">
                              <Activity size={14} /> {student.streak} days
                            </div>
                          </td>
                          <td className="p-4 hidden sm:table-cell font-medium text-gray-700 dark:text-gray-300">
                            {student.completedCourses}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <Users size={48} className="mb-4 opacity-30" />
                    <p>No students on the leaderboard yet.</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}
