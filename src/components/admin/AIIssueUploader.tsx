import * as React from "react";
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Upload, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// pdf.js — render PDF page 1 to a canvas, return PNG blob (cover) + JPEG dataURL (for AI)
const renderFirstPage = async (file: File): Promise<{ coverBlob: Blob; jpegBase64: string }> => {
  const pdfjs: any = await import("pdfjs-dist");
  // worker via CDN
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  const coverBlob: Blob = await new Promise((r) => canvas.toBlob((b) => r(b!), "image/png"));
  const jpegBase64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
  return { coverBlob, jpegBase64 };
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(",")[1]);
    r.readAsDataURL(blob);
  });

const BUCKETS: Record<string, { pdf: string; cover: string }> = {
  IGM: { pdf: "igm-pdfs", cover: "igm_covers" },
  RHCA: { pdf: "rhca-pdfs", cover: "rhca_covers" },
  ADC: { pdf: "atlas-pdfs", cover: "atlas_covers" },
};

type Metadata = {
  source: "IGM" | "RHCA" | "ADC";
  volume: string;
  issue: string;
  publication_date: string;
  title: string;
  abstract: string;
  specialty: string;
  category: string;
  tags: string[];
  keywords: string[];
  primary_author: string;
  institution: string;
  page_number: string;
  doi: string;
  pdf_filename: string;
  cover_filename: string;
};

export const AIIssueUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [busy, setBusy] = useState<"idle" | "extracting" | "uploading">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setCoverPreview(null);
    setCoverBlob(null);
    setMeta(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a PDF file");
      return;
    }
    setFile(f);
    setBusy("extracting");
    try {
      toast.info("Rendering cover from page 1…");
      const { coverBlob, jpegBase64 } = await renderFirstPage(f);
      setCoverBlob(coverBlob);
      setCoverPreview(URL.createObjectURL(coverBlob));

      toast.info("AI extracting metadata…");
      const { data, error } = await supabase.functions.invoke("ai-extract-issue-metadata", {
        body: { imageBase64: jpegBase64, filename: f.name },
      });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || "AI extraction failed");
      setMeta(data.metadata as Metadata);
      toast.success("Metadata extracted — review and confirm");
    } catch (e: any) {
      toast.error(e.message || "Failed to process PDF");
      console.error(e);
    } finally {
      setBusy("idle");
    }
  };

  const upload = async () => {
    if (!file || !meta || !coverBlob) return;
    const buckets = BUCKETS[meta.source];
    if (!buckets) {
      toast.error(`Unknown source: ${meta.source}`);
      return;
    }
    setBusy("uploading");
    try {
      const pdfBase64 = await blobToBase64(file);
      const coverBase64 = await blobToBase64(coverBlob);

      const article = {
        title: meta.title,
        abstract: meta.abstract,
        source: meta.source,
        article_type: meta.source,
        status: "published",
        volume: meta.volume,
        issue: meta.issue,
        publication_date: meta.publication_date,
        authors: [],
        category: meta.category || "Médecine Générale",
        specialty: meta.specialty || "",
        tags: meta.tags || [],
        keywords: meta.keywords || [],
        institution: meta.institution || "Info Chir",
        doi: meta.doi || "",
        page_number: meta.page_number || "",
        primary_author: meta.primary_author || "",
      };

      const { data, error } = await supabase.functions.invoke("upload-igm-issue", {
        body: {
          pdfBase64,
          coverBase64,
          pdfFilename: meta.pdf_filename,
          coverFilename: meta.cover_filename,
          pdfBucket: buckets.pdf,
          coverBucket: buckets.cover,
          article,
        },
      });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || "Upload failed");

      toast.success(`${meta.source} issue published successfully`);
      reset();
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
      console.error(e);
    } finally {
      setBusy("idle");
    }
  };

  const updateMeta = <K extends keyof Metadata>(k: K, v: Metadata[K]) =>
    setMeta((m) => (m ? { ...m, [k]: v } : m));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Issue Uploader
        </CardTitle>
        <CardDescription>
          Drop a journal PDF (IGM, RHCA or ADC). AI extracts metadata, generates the cover from
          page 1, and publishes the issue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <Input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            disabled={busy !== "idle"}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {busy === "extracting" && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        {file && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <FileCheck className="h-4 w-4" /> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}

        {meta && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full rounded border shadow-sm"
                />
              )}
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Source</Label>
                  <Select value={meta.source} onValueChange={(v) => updateMeta("source", v as Metadata["source"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IGM">IGM</SelectItem>
                      <SelectItem value="RHCA">RHCA</SelectItem>
                      <SelectItem value="ADC">ADC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Volume</Label>
                  <Input value={meta.volume} onChange={(e) => updateMeta("volume", e.target.value)} />
                </div>
                <div>
                  <Label>Issue / Chapter</Label>
                  <Input value={meta.issue} onChange={(e) => updateMeta("issue", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Title</Label>
                <Input value={meta.title} onChange={(e) => updateMeta("title", e.target.value)} />
              </div>

              <div>
                <Label>Publication date</Label>
                <Input
                  type="date"
                  value={meta.publication_date}
                  onChange={(e) => updateMeta("publication_date", e.target.value)}
                />
              </div>

              <div>
                <Label>Abstract</Label>
                <Textarea
                  rows={4}
                  value={meta.abstract}
                  onChange={(e) => updateMeta("abstract", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>PDF filename</Label>
                  <Input value={meta.pdf_filename} onChange={(e) => updateMeta("pdf_filename", e.target.value)} />
                </div>
                <div>
                  <Label>Cover filename</Label>
                  <Input value={meta.cover_filename} onChange={(e) => updateMeta("cover_filename", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Category</Label>
                  <Input value={meta.category} onChange={(e) => updateMeta("category", e.target.value)} />
                </div>
                <div>
                  <Label>Specialty / Theme</Label>
                  <Input value={meta.specialty} onChange={(e) => updateMeta("specialty", e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={upload} disabled={busy !== "idle"} className="gap-2">
                  {busy === "uploading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Publish issue
                </Button>
                <Button variant="outline" onClick={reset} disabled={busy !== "idle"}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
