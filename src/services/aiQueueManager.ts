import { AIGenerationTask } from "../types/ai";
import { AIEngineService } from "./aiEngine";

type TaskListener = (tasks: AIGenerationTask[]) => void;

class AIQueueManagerClass {
  private queue: AIGenerationTask[] = [];
  private listeners: Set<TaskListener> = new Set();
  private maxConcurrency = 3;
  private activeCount = 0;

  constructor() {
    // Initial sample tasks or empty
  }

  public getTasks(): AIGenerationTask[] {
    return [...this.queue];
  }

  public subscribe(listener: TaskListener): () => void {
    this.listeners.add(listener);
    listener([...this.queue]);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const copy = [...this.queue];
    this.listeners.forEach((fn) => fn(copy));
  }

  public addTask(
    type: AIGenerationTask["type"],
    prompt: string,
    options: Partial<AIGenerationTask> = {}
  ): AIGenerationTask {
    const newTask: AIGenerationTask = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      prompt,
      negativePrompt: options.negativePrompt || "",
      status: "queued",
      progress: 0,
      startedAt: new Date().toISOString(),
      results: [],
      model: options.model || "gemini-3.6-flash",
      seed: options.seed || Math.floor(Math.random() * 9000000),
      aspectRatio: options.aspectRatio || "1:1",
      style: options.style || "cyberpunk",
      promptWeight: options.promptWeight || 1.0,
      guidanceStrength: options.guidanceStrength || 7.5,
      qualityPreset: options.qualityPreset || "Ultra 8K",
      referenceImages: options.referenceImages || [],
      editTool: options.editTool,
    };

    this.queue = [newTask, ...this.queue];
    this.notify();
    this.processQueue();
    return newTask;
  }

  public cancelTask(taskId: string) {
    const task = this.queue.find((t) => t.id === taskId);
    if (task && (task.status === "queued" || task.status === "processing")) {
      task.status = "cancelled";
      task.completedAt = new Date().toISOString();
      this.notify();
    }
  }

  public retryTask(taskId: string) {
    const task = this.queue.find((t) => t.id === taskId);
    if (task && (task.status === "failed" || task.status === "cancelled")) {
      task.status = "queued";
      task.progress = 0;
      task.error = undefined;
      task.startedAt = new Date().toISOString();
      this.notify();
      this.processQueue();
    }
  }

  public clearCompleted() {
    this.queue = this.queue.filter(
      (t) => t.status === "processing" || t.status === "queued"
    );
    this.notify();
  }

  private async processQueue() {
    if (this.activeCount >= this.maxConcurrency) return;

    const nextTask = this.queue.find((t) => t.status === "queued");
    if (!nextTask) return;

    nextTask.status = "processing";
    this.activeCount++;
    this.notify();

    try {
      if (nextTask.type === "image" || nextTask.type === "bg" || nextTask.type === "asset") {
        const results = await AIEngineService.generateImages({
          prompt: nextTask.prompt,
          negativePrompt: nextTask.negativePrompt,
          style: nextTask.style,
          aspectRatio: nextTask.aspectRatio,
          seed: nextTask.seed,
          batchCount: 4,
          onProgress: (p) => {
            if (nextTask.status === "processing") {
              nextTask.progress = p;
              this.notify();
            }
          },
        });

        if (nextTask.status === "processing") {
          nextTask.status = "completed";
          nextTask.progress = 100;
          nextTask.results = results;
          nextTask.completedAt = new Date().toISOString();
        }
      } else if (nextTask.type === "edit") {
        const sourceUrl =
          nextTask.referenceImages?.[0] ||
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

        const editedUrl = await AIEngineService.editImage({
          tool: nextTask.editTool || "bg-remove",
          sourceImageUrl: sourceUrl,
          prompt: nextTask.prompt,
          seed: nextTask.seed,
          onProgress: (p) => {
            if (nextTask.status === "processing") {
              nextTask.progress = p;
              this.notify();
            }
          },
        });

        if (nextTask.status === "processing") {
          nextTask.status = "completed";
          nextTask.progress = 100;
          nextTask.results = [editedUrl];
          nextTask.completedAt = new Date().toISOString();
        }
      } else if (nextTask.type === "writer") {
        const writerResult = await AIEngineService.generateText({
          writerType: "blog",
          writerAction: "generate",
          topicPrompt: nextTask.prompt,
          onProgress: (p) => {
            if (nextTask.status === "processing") {
              nextTask.progress = p;
              this.notify();
            }
          },
        });

        if (nextTask.status === "processing") {
          nextTask.status = "completed";
          nextTask.progress = 100;
          nextTask.textResult = writerResult.text;
          nextTask.completedAt = new Date().toISOString();
        }
      } else {
        // Fallback generic complete
        await new Promise((r) => setTimeout(r, 600));
        nextTask.status = "completed";
        nextTask.progress = 100;
        nextTask.completedAt = new Date().toISOString();
      }
    } catch (err: any) {
      if (nextTask.status === "processing") {
        nextTask.status = "failed";
        nextTask.error = err?.message || "An unexpected AI processing error occurred.";
        nextTask.completedAt = new Date().toISOString();
      }
    } finally {
      this.activeCount--;
      this.notify();
      // Continue queue loop
      this.processQueue();
    }
  }
}

export const AIQueueManager = new AIQueueManagerClass();
