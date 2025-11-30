'use client';

import React, { useState, useEffect } from 'react';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check, Users, TrendingUp, Download, Search, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEditorStore } from '@/store/editorStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';

export default function Edit() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [transparentWidget, setTransparentWidget] = useState(true);
  const { activeTab, previewMode } = useDashboardStore();
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{
    total: number;
    growth: Array<{ date: string; signups: number }>;
    recent: Array<{ id: string; email: string; name: string | null; createdAt: string }>;
  } | null>(null);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Array<{ id: string; email: string; name: string | null; createdAt: string }>>([]);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [submissionsTotal, setSubmissionsTotal] = useState(0);
  const [submissionsSearch, setSubmissionsSearch] = useState('');
  const [submissionsSearchInput, setSubmissionsSearchInput] = useState('');
  const itemsPerPage = 10; // Changed to 10 for better UX with smaller page size
  const { setFullState } = useEditorStore();
  
  const shareableLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/waitlist/${id}`
    : '';

  const widgetCode = typeof window !== 'undefined'
    ? `<script src="${window.location.origin}/embed.js" defer></script>
<div class="waitbridge-embed" data-waitlist-id="${id}"${transparentWidget ? ' data-transparent="true"' : ''}></div>`
    : '';

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`/api/waitlist/${id}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setFullState(data.settings);
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [id, setFullState]);

  // Load analytics data
  const loadAnalytics = React.useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/waitlist/${id}/analytics`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      } else {
        toast.error('Failed to load analytics');
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadAnalytics();
    }
  }, [id, loadAnalytics]);

  // Load submissions data
  const loadSubmissions = async () => {
    setSubmissionsLoading(true);
    try {
      const params = new URLSearchParams({
        page: submissionsPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (submissionsSearch) {
        params.append('search', submissionsSearch);
      }
      const res = await fetch(`/api/waitlist/${id}/submissions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.entries);
        setSubmissionsTotal(data.total);
      } else {
        toast.error('Failed to load submissions');
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, submissionsPage, submissionsSearch]);

  const handleSearch = () => {
    setSubmissionsSearch(submissionsSearchInput);
    setSubmissionsPage(1); // Reset to first page when searching
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      toast.error('No submissions to export');
      return;
    }

    const csvContent = [
      ['Email', 'Name', 'Date'].join(','),
      ...submissions.map((entry) => [
        entry.email,
        entry.name || '',
        new Date(entry.createdAt).toISOString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-submissions-${id}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-muted/20">
      {activeTab === 'edit' && (
        <div className="h-full w-full overflow-hidden flex flex-col">
          {/* Preview Container */}
          <div className={cn(
            "flex-1 flex items-center justify-center transition-all duration-300",
          )}>
            <div className={cn(
              "transition-all duration-300 h-full flex items-center justify-center",
              previewMode === 'desktop' ? "w-full" : "w-full max-w-[375px]"
            )}>
              <PreviewPanel />
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="h-full w-full overflow-y-auto">
          <div className="space-y-6">
            {analyticsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : analytics ? (
              <>
                {/* Total Signups Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.total}</div>
                    <p className="text-xs text-muted-foreground">
                      Total people on your waitlist
                    </p>
                  </CardContent>
                </Card>

                {/* Growth Over Time Chart */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Growth Over Time
                        </CardTitle>
                        <CardDescription>
                          Signups over the last 30 days
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={loadAnalytics}
                        disabled={analyticsLoading}
                        className="h-8 w-8"
                        title="Refresh analytics"
                      >
                        <RefreshCw className={`h-4 w-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {analytics.growth.length > 0 ? (
                      <ChartContainer
                        config={{
                          signups: {
                            label: "Signups",
                            color: "hsl(221.2 83.2% 53.3%)",
                          },
                        }}
                        className="h-[350px] w-full"
                      >
                        <AreaChart
                          data={analytics.growth}
                          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                        >
                          <defs>
                            <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            className="stroke-muted/50"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tickFormatter={(value) => {
                              try {
                                const date = new Date(value);
                                if (isNaN(date.getTime())) {
                                  return value;
                                }
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                              } catch {
                                return value;
                              }
                            }}
                            className="text-xs text-muted-foreground"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            allowDecimals={false}
                            className="text-xs text-muted-foreground"
                            style={{ fontSize: '12px' }}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent 
                              indicator="dot"
                              labelFormatter={(value) => {
                                try {
                                  const date = new Date(value);
                                  if (isNaN(date.getTime())) {
                                    return value;
                                  }
                                  return date.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  });
                                } catch {
                                  return value;
                                }
                              }}
                            />}
                            cursor={{ stroke: "hsl(221.2 83.2% 53.3%)", strokeWidth: 1, strokeDasharray: "5 5" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="signups"
                            stroke="hsl(221.2 83.2% 53.3%)"
                            strokeWidth={3}
                            fill="url(#colorSignups)"
                            fillOpacity={1}
                          />
                          <Line
                            type="monotone"
                            dataKey="signups"
                            stroke="hsl(221.2 83.2% 53.3%)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ 
                              r: 6, 
                              fill: "hsl(221.2 83.2% 53.3%)",
                              stroke: "white",
                              strokeWidth: 2
                            }}
                          />
                        </AreaChart>
                      </ChartContainer>
                    ) : (
                      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
                          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">No data available yet</p>
                          <p className="text-xs mt-1">Signups will appear here once people start joining your waitlist</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Signups Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Signups</CardTitle>
                    <CardDescription>
                      Latest {analytics.recent.length} people who joined your waitlist
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.recent.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics.recent.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">{entry.email}</TableCell>
                              <TableCell>{entry.name || '-'}</TableCell>
                              <TableCell>
                                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No signups yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Failed to load analytics
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'submissions' && (
        <div className="h-full w-full overflow-y-auto">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Submissions</CardTitle>
                    <CardDescription>
                      View and manage all waitlist signups
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={loadSubmissions}
                      disabled={submissionsLoading}
                      className="h-8 w-8"
                      title="Refresh submissions"
                    >
                      <RefreshCw className={`h-4 w-4 ${submissionsLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCSV}
                      disabled={submissions.length === 0}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email..."
                      value={submissionsSearchInput}
                      onChange={(e) => setSubmissionsSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={submissionsLoading}>
                    Search
                  </Button>
                  {submissionsSearch && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmissionsSearchInput('');
                        setSubmissionsSearch('');
                        setSubmissionsPage(1);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                {/* Table */}
                {submissionsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : submissions.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.email}</TableCell>
                            <TableCell>{entry.name || '-'}</TableCell>
                            <TableCell>
                              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {(submissionsPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(submissionsPage * itemsPerPage, submissionsTotal)} of{' '}
                        {submissionsTotal} submissions
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubmissionsPage((p) => Math.max(1, p - 1))}
                          disabled={submissionsPage === 1 || submissionsLoading}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubmissionsPage((p) => p + 1)}
                          disabled={
                            submissionsPage * itemsPerPage >= submissionsTotal ||
                            submissionsLoading
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {submissionsSearch
                      ? 'No submissions found matching your search'
                      : 'No submissions yet'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {activeTab === 'share' && (
        <div className="h-full w-full flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Share Your Waitlist</CardTitle>
              <CardDescription>
                Share this link with your customers so they can join your waitlist.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Waitlist Link</label>
                <div className="flex gap-2">
                  <Input
                    value={shareableLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(shareableLink);
                        setCopied(true);
                        toast.success('Link copied to clipboard!');
                        setTimeout(() => setCopied(false), 2000);
                      } catch (error) {
                        toast.error('Failed to copy link');
                      }
                    }}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can join your waitlist. The page will automatically use the settings you've configured.
                </p>
          </div>
              <div className="pt-4 border-t space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Embed Widget</label>
                    <div className="flex items-center gap-2">
                      <label htmlFor="transparent-toggle" className="text-xs text-muted-foreground cursor-pointer select-none">
                        Transparent Background
                      </label>
                      <input
                        id="transparent-toggle"
                        type="checkbox"
                        checked={transparentWidget}
                        onChange={(e) => setTransparentWidget(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={widgetCode}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(widgetCode);
                          setCopiedWidget(true);
                          toast.success('Widget code copied!');
                          setTimeout(() => setCopiedWidget(false), 2000);
                        } catch (error) {
                          toast.error('Failed to copy code');
                        }
                      }}
                    >
                      {copiedWidget ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Copy and paste this code into your website to embed the waitlist form.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
