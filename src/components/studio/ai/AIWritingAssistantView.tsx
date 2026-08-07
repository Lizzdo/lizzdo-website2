import React, { useState } from "react";
import { AI_WRITER_OPTIONS, AI_WRITER_ACTION_OPTIONS } from "../../../data/aiData";
import { AIEngineService } from "../../../services/aiEngine";
import { useStudio } from "../../../context/StudioContext";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Send,
  RefreshCw,
  Globe,
  Tag,
  Hash,
  Sliders,
  Wand2,
  BookOpen,
  ShoppingBag,
  Briefcase,
} from "lucide-react";

interface AIWritingAssistantViewProps {
  onSendToDesignerText: (text: string) => void;
  onSendToBlog: (title: string, content: string) => void;
  onSendToPortfolio: (content: string) => void;
}

const TONES = [
  "Professional & Visionary",
  "Futuristic & Cybernetic",
  "Casual & Friendly",
  "Persuasive & High-CTR",
  "Minimalist & Elegant",
  "Technical & Precise",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Chinese",
  "Portuguese",
  "Italian",
];

export function AIWritingAssistantView({
  onSendToDesignerText,
  onSendToBlog,
  onSendToPortfolio,
}: AIWritingAssistantViewProps) {
  const { addNotification } = useStudio();

  const [writerType, setWriterType] = useState<string>("blog");
  const [writerAction, setWriterAction] = useState<string>("generate");
  const [topicPrompt, setTopicPrompt] = useState(
    "How AI Studio OS revolutionizes creative workflows in 2026"
  );
  const [writerTone, setWriterTone] = useState<string>("Professional & Visionary");
  const [targetLang, setTargetLang] = useState<string>("English");
  const [existingText, setExistingText] = useState<string>("");

  const [isWriting, setIsWriting] = useState(false);
  const [outputResult, setOutputResult] = useState<string>(
    `# How AI Studio OS Revolutionizes Creative Workflows in 2026\n\nThe creative industry is experiencing a seismic shift. Traditional multi-app workflows—where creators juggle design suites, video editors, and AI portals—are giving way to unified Creative Operating Systems.\n\n### 1. Zero Context Switching\nBy connecting vector design, AI generators, and brand kit repositories in a single workspace, creators save up to 14 hours per project.\n\n### 2. Live Brand Consistency\nAI models trained on native brand guidelines automatically apply brand palettes, typography, and logo placements across every generated artifact.`
  );
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([
    "ai studio os",
    "creative automation",
    "lizzdo",
    "vector design",
  ]);
  const [extractedHashtags, setExtractedHashtags] = useState<string[]>([
    "#AIStudioOS",
    "#CreativeWorkflows",
    "#StudioLizzdo",
  ]);

  const [copied, setCopied] = useState(false);

  const handleGenerateWrite = async () => {
    setIsWriting(true);
    try {
      const res = await AIEngineService.generateText({
        writerType,
        writerAction,
        topicPrompt,
        tone: writerTone,
        targetLanguage: targetLang,
        existingText,
      });

      setOutputResult(res.text);
      setExtractedKeywords(res.keywords);
      setExtractedHashtags(res.hashtags);
      addNotification("AI Writing Complete", "Synthesized custom copy draft.", "success", "ai");
    } catch (err: any) {
      addNotification("Writing Error", err?.message || "Failed to generate text", "error", "errors");
    } finally {
      setIsWriting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full font-mono text-xs select-none">
      {/* LEFT FORM CONTROL PANEL */}
      <div className="w-full lg:w-96 bg-neutral-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <FileText className="w-4 h-4 text-neon-purple" />
            <h2 className="font-bold text-white uppercase text-xs">AI Writing Assistant</h2>
          </div>

          {/* CONTENT TYPE SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold uppercase text-[11px] block">
              Content Format
            </label>
            <select
              value={writerType}
              onChange={(e) => setWriterType(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-purple font-sans"
            >
              {AI_WRITER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* ACTION SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold uppercase text-[11px] block">
              Writing Tool / Action
            </label>
            <select
              value={writerAction}
              onChange={(e) => setWriterAction(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-purple font-sans"
            >
              {AI_WRITER_ACTION_OPTIONS.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.label}
                </option>
              ))}
            </select>
          </div>

          {/* TONE & LANGUAGE */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-gray-400 uppercase text-[10px] block">Tone</label>
              <select
                value={writerTone}
                onChange={(e) => setWriterTone(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-2 py-1.5 text-gray-200 text-[11px] font-sans"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase text-[10px] block">Language</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-2 py-1.5 text-gray-200 text-[11px] font-sans"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TOPIC OR EXISTING TEXT */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold uppercase text-[11px]">
              Topic Brief / Keywords
            </label>
            <textarea
              rows={3}
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="Describe topic, features, target audience..."
              className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-purple font-sans text-xs resize-none"
            />
          </div>

          {(writerAction === "rewrite" ||
            writerAction === "expand" ||
            writerAction === "shorten" ||
            writerAction === "grammar") && (
            <div className="space-y-1.5">
              <label className="text-gray-400 font-bold uppercase text-[10px]">
                Existing Draft / Text to Modify
              </label>
              <textarea
                rows={3}
                value={existingText}
                onChange={(e) => setExistingText(e.target.value)}
                placeholder="Paste original text here to transform..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-gray-300 focus:outline-none focus:border-neon-purple font-sans text-xs resize-none"
              />
            </div>
          )}
        </div>

        {/* GENERATE BUTTON */}
        <button
          onClick={handleGenerateWrite}
          disabled={isWriting}
          className="w-full py-3 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white font-bold uppercase transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isWriting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing Copy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Copy Draft</span>
            </>
          )}
        </button>
      </div>

      {/* RIGHT OUTPUT & WORKFLOW INTEGRATION PANEL */}
      <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-neon-purple font-bold uppercase">
              Generated Copy ({writerType})
            </span>
            <span className="text-gray-500 text-[10px]">Tone: {writerTone}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>

            <button
              onClick={() => onSendToDesignerText(outputResult)}
              className="px-3 py-1.5 rounded-xl bg-neon-purple text-white font-bold hover:bg-neon-purple/80 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Add Text Layer in Designer V1
            </button>
          </div>
        </div>

        {/* OUTPUT AREA */}
        <div className="flex-1 my-4 p-4 rounded-xl bg-neutral-900/80 border border-white/5 overflow-y-auto custom-scrollbar font-sans text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
          {outputResult}
        </div>

        {/* KEYWORDS & HASHTAGS FOOTER */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-sans text-xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Tag className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            {extractedKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-mono shrink-0"
              >
                {kw}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Hash className="w-3.5 h-3.5 text-neon-purple shrink-0" />
            {extractedHashtags.map((ht, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-[10px] font-mono shrink-0"
              >
                {ht}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
