import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircle, Copy, Loader2, RefreshCw } from "lucide-react";

type TaskType = "checker" | "indexer";

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const jsonPreview = (data: unknown) => JSON.stringify(data, null, 2);

export default function SpeedyIndexPage() {
  const [activeTab, setActiveTab] = useState<TaskType>("checker");
  const [statusTaskIds, setStatusTaskIds] = useState<string>("");
  const [fullReportTaskId, setFullReportTaskId] = useState<string>("");
  const [loading, setLoading] = useState<{ status: boolean; full: boolean }>({
    status: false,
    full: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<any | null>(null);
  const [reportResult, setReportResult] = useState<any | null>(null);

  const handleFetch = async (type: "status" | "full") => {
    setError(null);
    setStatusResult(null);
    setReportResult(null);
    setLoading((s) => ({
      ...s,
      [type === "status" ? "status" : "full"]: true,
    }));
    try {
      const taskType = activeTab; // 'checker' | 'indexer'
      const url =
        type === "status"
          ? `${BACKEND_BASE}/api/proxy/speedyindex/task/${taskType}/status`
          : `${BACKEND_BASE}/api/proxy/speedyindex/task/${taskType}/fullreport`;

      const body =
        type === "status"
          ? {
              task_ids: statusTaskIds
                .split(/\s|,|\n/)
                .map((t) => t.trim())
                .filter(Boolean),
            }
          : { task_id: fullReportTaskId.trim() };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }
      if (type === "status") setStatusResult(data);
      else setReportResult(data);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading({ status: false, full: false });
    }
  };

  const indexedRows = useMemo(() => {
    const src = reportResult || {};
    const res = src.result || {};
    const raw =
      res.indexed_links ??
      res.indexed ??
      src.indexed_links ??
      src.indexed ??
      [];
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((item: any) => {
      if (typeof item === "string") return { url: item, title: null };
      return {
        url: item.url ?? "-",
        title: item.title ?? item.page_title ?? null,
      };
    });
  }, [reportResult]);

  const unindexedRows = useMemo(() => {
    const src = reportResult || {};
    const res = src.result || {};
    const raw =
      res.unindexed_links ??
      res.unindexed ??
      src.unindexed_links ??
      src.unindexed ??
      [];
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((item: any) => {
      if (typeof item === "string") return { url: item, error_code: null };
      return {
        url: item.url ?? "-",
        error_code: item.error_code ?? item.error ?? null,
      };
    });
  }, [reportResult]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SpeedyIndex</h1>
        <p className="text-sm text-gray-600">
          Checker and Indexer tools for Google
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TaskType)}
      >
        <TabsList className="rounded-xl">
          <TabsTrigger value="checker">Checker</TabsTrigger>
          <TabsTrigger value="indexer">Indexer</TabsTrigger>
        </TabsList>

        <TabsContent value="checker" className="space-y-6">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Check Task Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter Task IDs (one per line or comma separated)"
                value={statusTaskIds}
                onChange={(e) => setStatusTaskIds(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleFetch("status")}
                  disabled={loading.status}
                >
                  {loading.status && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Fetch Status
                </Button>
                <Button variant="outline" onClick={() => setStatusTaskIds("")}>
                  Clear
                </Button>
              </div>
              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              {statusResult && (
                <div className="space-y-3">
                  <details className="bg-gray-50 rounded-md p-3">
                    <summary className="cursor-pointer font-medium">
                      Raw JSON
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-80">
                      {jsonPreview(statusResult)}
                    </pre>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Full Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter Task ID"
                value={fullReportTaskId}
                onChange={(e) => setFullReportTaskId(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleFetch("full")}
                  disabled={loading.full}
                >
                  {loading.full && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Fetch Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFullReportTaskId("")}
                >
                  Clear
                </Button>
              </div>
              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              {reportResult && (
                <div className="space-y-4">
                  <details className="bg-gray-50 rounded-md p-3">
                    <summary className="cursor-pointer font-medium">
                      Raw JSON
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-80">
                      {jsonPreview(reportResult)}
                    </pre>
                  </details>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Indexed Links</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-gray-600">
                                <th className="py-2 pr-4">URL</th>
                                <th className="py-2">Title</th>
                              </tr>
                            </thead>
                            <tbody>
                              {indexedRows.map((row: any, i: number) => (
                                <tr key={i} className="border-t">
                                  <td className="py-2 pr-4 break-all text-blue-700">
                                    {row.url}
                                  </td>
                                  <td className="py-2">{row.title || "-"}</td>
                                </tr>
                              ))}
                              {indexedRows.length === 0 && (
                                <tr>
                                  <td
                                    className="py-3 text-gray-500"
                                    colSpan={2}
                                  >
                                    No indexed links
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Unindexed Links</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-gray-600">
                                <th className="py-2 pr-4">URL</th>
                                <th className="py-2">Error Code</th>
                              </tr>
                            </thead>
                            <tbody>
                              {unindexedRows.map((row: any, i: number) => (
                                <tr key={i} className="border-t">
                                  <td className="py-2 pr-4 break-all text-blue-700">
                                    {row.url}
                                  </td>
                                  <td className="py-2">
                                    {row.error_code || "-"}
                                  </td>
                                </tr>
                              ))}
                              {unindexedRows.length === 0 && (
                                <tr>
                                  <td
                                    className="py-3 text-gray-500"
                                    colSpan={2}
                                  >
                                    No unindexed links
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indexer">
          {/* Reuse the same UI; behavior is controlled by activeTab */}
          <div className="space-y-6">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Check Task Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter Task IDs (one per line or comma separated)"
                  value={statusTaskIds}
                  onChange={(e) => setStatusTaskIds(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleFetch("status")}
                    disabled={loading.status}
                  >
                    {loading.status && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Fetch Status
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStatusTaskIds("")}
                  >
                    Clear
                  </Button>
                </div>
                {error && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
                {statusResult && (
                  <div className="space-y-3">
                    <details className="bg-gray-50 rounded-md p-3">
                      <summary className="cursor-pointer font-medium">
                        Raw JSON
                      </summary>
                      <pre className="mt-2 text-xs overflow-auto max-h-80">
                        {jsonPreview(statusResult)}
                      </pre>
                    </details>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Full Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter Task ID"
                  value={fullReportTaskId}
                  onChange={(e) => setFullReportTaskId(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleFetch("full")}
                    disabled={loading.full}
                  >
                    {loading.full && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Fetch Report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFullReportTaskId("")}
                  >
                    Clear
                  </Button>
                </div>
                {error && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
                {reportResult && (
                  <div className="space-y-4">
                    <details className="bg-gray-50 rounded-md p-3">
                      <summary className="cursor-pointer font-medium">
                        Raw JSON
                      </summary>
                      <pre className="mt-2 text-xs overflow-auto max-h-80">
                        {jsonPreview(reportResult)}
                      </pre>
                    </details>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Indexed Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-gray-600">
                                  <th className="py-2 pr-4">URL</th>
                                  <th className="py-2">Title</th>
                                </tr>
                              </thead>
                              <tbody>
                                {indexedRows.map((row: any, i: number) => (
                                  <tr key={i} className="border-t">
                                    <td className="py-2 pr-4 break-all text-blue-700">
                                      {row.url}
                                    </td>
                                    <td className="py-2">{row.title || "-"}</td>
                                  </tr>
                                ))}
                                {indexedRows.length === 0 && (
                                  <tr>
                                    <td
                                      className="py-3 text-gray-500"
                                      colSpan={2}
                                    >
                                      No indexed links
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Unindexed Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-gray-600">
                                  <th className="py-2 pr-4">URL</th>
                                  <th className="py-2">Error Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                {unindexedRows.map((row: any, i: number) => (
                                  <tr key={i} className="border-t">
                                    <td className="py-2 pr-4 break-all text-blue-700">
                                      {row.url}
                                    </td>
                                    <td className="py-2">
                                      {row.error_code || "-"}
                                    </td>
                                  </tr>
                                ))}
                                {unindexedRows.length === 0 && (
                                  <tr>
                                    <td
                                      className="py-3 text-gray-500"
                                      colSpan={2}
                                    >
                                      No unindexed links
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
