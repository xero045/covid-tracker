import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { Search, Globe2, Activity, Skull, Heart, AlertCircle, ArrowUpDown } from "lucide-react";
import { useGlobalData, useCountriesData } from "@/hooks/use-covid-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

type SortField = "cases" | "todayCases" | "deaths" | "todayDeaths" | "recovered" | "active";
type SortOrder = "asc" | "desc";

export default function GlobalPage() {
  const [, setLocation] = useLocation();
  const { data: globalData, isLoading: globalLoading, isError: globalError } = useGlobalData();
  const { data: countriesData, isLoading: countriesLoading } = useCountriesData();

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("cases");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedCountries = useMemo(() => {
    if (!countriesData) return [];
    
    let filtered = countriesData.filter(country => 
      country.country.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [countriesData, search, sortField, sortOrder]);

  if (globalError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Data Fetch Failed</h2>
        <p className="text-muted-foreground">Unable to connect to the disease.sh API.</p>
      </div>
    );
  }

  const chartData = globalData ? [
    { name: "Active", value: globalData.active, fill: "hsl(var(--chart-4))" },
    { name: "Recovered", value: globalData.recovered, fill: "hsl(var(--chart-3))" },
    { name: "Deaths", value: globalData.deaths, fill: "hsl(var(--destructive))" }
  ] : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">COVID-19 Intelligence</h1>
          </div>
          {globalData && (
            <div className="text-xs text-muted-foreground font-mono hidden sm:block">
              Updated: {format(new Date(globalData.updated), "PPpp")}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Global Overview Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Global Overview</h2>
          </div>
          
          {globalLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : globalData ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2">{globalData.cases.toLocaleString()}</div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      +{globalData.todayCases.toLocaleString()} today
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-chart-4 mb-2">{globalData.active.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground font-mono">{globalData.critical.toLocaleString()} critical</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recovered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-chart-3 mb-2">{globalData.recovered.toLocaleString()}</div>
                    <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                      +{globalData.todayRecovered.toLocaleString()} today
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Deaths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-destructive mb-2">{globalData.deaths.toLocaleString()}</div>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      +{globalData.todayDeaths.toLocaleString()} today
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <Card className="lg:col-span-4 flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => value.toLocaleString()}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </section>

        {/* Countries Table Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Country Intelligence</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search countries..." 
                className="pl-9 bg-card border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-country"
              />
            </div>
          </div>

          <Card className="overflow-hidden border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-card">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[200px]">Country</TableHead>
                    <TableHead className="text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("cases")}>
                      <div className="flex items-center justify-end gap-1">Cases <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("todayCases")}>
                      <div className="flex items-center justify-end gap-1">Today Cases <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("active")}>
                      <div className="flex items-center justify-end gap-1">Active <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("recovered")}>
                      <div className="flex items-center justify-end gap-1">Recovered <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("deaths")}>
                      <div className="flex items-center justify-end gap-1">Deaths <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("todayDeaths")}>
                      <div className="flex items-center justify-end gap-1">Today Deaths <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countriesLoading ? (
                    [...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(7)].map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredAndSortedCountries.length > 0 ? (
                    filteredAndSortedCountries.map((country) => (
                      <TableRow
                        key={country.country}
                        className="cursor-pointer group hover:bg-muted/50 border-border transition-colors"
                        data-testid={`row-country-${country.country}`}
                        onClick={() => setLocation(`/country/${encodeURIComponent(country.country)}`)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <img src={country.countryInfo.flag} alt="" className="w-6 h-4 object-cover rounded-[2px]" />
                            <span className="truncate group-hover:text-primary transition-colors">{country.country}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{country.cases.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">
                          {country.todayCases > 0 ? (
                            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">+{country.todayCases.toLocaleString()}</span>
                          ) : <span className="text-muted-foreground opacity-50">0</span>}
                        </TableCell>
                        <TableCell className="text-right font-mono text-chart-4">{country.active.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-chart-3">{country.recovered.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-destructive">{country.deaths.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">
                          {country.todayDeaths > 0 ? (
                            <span className="text-destructive bg-destructive/10 px-2 py-0.5 rounded text-xs">+{country.todayDeaths.toLocaleString()}</span>
                          ) : <span className="text-muted-foreground opacity-50">0</span>}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No countries found matching "{search}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
