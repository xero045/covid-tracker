import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Activity, Skull, Heart, Users, TestTube, AlertCircle } from "lucide-react";
import { useCountryData } from "@/hooks/use-covid-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

interface CountryPageProps {
  params: {
    name: string;
  };
}

export default function CountryPage({ params }: CountryPageProps) {
  const { name } = params;
  const { data, isLoading, isError } = useCountryData(name);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 md:p-12 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-24 w-full md:w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 md:p-12 flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-muted-foreground mb-6">Could not fetch data for {name}</p>
        <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Return to Global Dashboard
        </Link>
      </div>
    );
  }

  const chartData = [
    { name: "Active", value: data.active, fill: "hsl(var(--chart-4))" },
    { name: "Recovered", value: data.recovered, fill: "hsl(var(--chart-3))" },
    { name: "Deaths", value: data.deaths, fill: "hsl(var(--destructive))" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Global Overview
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={data.countryInfo.flag} 
              alt={`Flag of ${data.country}`} 
              className="w-20 h-14 object-cover rounded shadow-sm border border-border"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-1">{data.country}</h1>
              <p className="text-muted-foreground font-mono">
                {data.continent} • Pop: {data.population.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-mono text-sm">{format(new Date(data.updated), "PPpp")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{data.cases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">+{data.todayCases.toLocaleString()} today</Badge>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Cases</CardTitle>
              <Activity className="w-4 h-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-4">{data.active.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {data.critical.toLocaleString()} critical
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Recovered</CardTitle>
              <Heart className="w-4 h-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-3">{data.recovered.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">+{data.todayRecovered.toLocaleString()} today</Badge>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Deaths</CardTitle>
              <Skull className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{data.deaths.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">+{data.todayDeaths.toLocaleString()} today</Badge>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Case Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TestTube className="w-4 h-4" /> Tests Conducted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.tests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.testsPerOneMillion.toLocaleString()} per million
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Per Million Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Cases / 1M</span>
                    <span className="font-mono">{data.casesPerOneMillion.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min((data.casesPerOneMillion / 200000) * 100, 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Deaths / 1M</span>
                    <span className="font-mono">{data.deathsPerOneMillion.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: `${Math.min((data.deathsPerOneMillion / 3000) * 100, 100)}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
