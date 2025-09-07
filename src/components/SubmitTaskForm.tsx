import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
// Removed Supabase dependency
import { toast } from "@/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { useUserCreditsQuery } from "@/hooks/useUserCreditsQuery";
import { useInvalidateTasksOnCreate } from "@/hooks/useTasksQueries";
import { useInvalidateCreditUsage } from "@/hooks/useCreditUsageData";
import { useUser } from "@/contexts/UserContext";
import { SubscriptionPlansDialog } from "@/components/SubscriptionPlansDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useInvalidateRecentTasksOnCreate } from "@/hooks/useTasksQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { postWithAuth } from "@/utils/fetchWithAuth";
import { useTaskCounter } from "@/hooks/useTaskCounter";
import { useUrlProgress } from "@/contexts/UrlProgressContext";
import { usePendingTasks } from "@/contexts/PendingTasksContext";
import Link from "next/link";

interface SubmitTaskFormProps {
  onTaskSubmitted: () => void;
}

interface TaskFormValues {
  title: string;
  urls: string;
  type: "indexer" | "checker";
  useVip: boolean;
}

// URL validation and correction utilities
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Ensure it has a valid protocol (http or https)
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

const isUrlLike = (text: string): boolean => {
  // Check if the text looks like it might be a URL (starts with http/https)
  return /^https?:\/\//i.test(text.trim());
};

const splitConcatenatedUrls = (text: string): string[] => {
  const urls: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Find the next URL starting position
    const urlStart = text.indexOf("http", currentIndex);
    if (urlStart === -1) break;

    // Find where this URL ends (either at the start of the next URL or end of string)
    const nextUrlStart = text.indexOf("http", urlStart + 4);
    const urlEnd = nextUrlStart !== -1 ? nextUrlStart : text.length;

    // Extract the potential URL
    const potentialUrl = text.substring(urlStart, urlEnd);

    // Validate the URL
    if (isValidUrl(potentialUrl)) {
      urls.push(potentialUrl);
    }

    currentIndex = urlEnd;
  }

  return urls;
};

const extractValidUrls = (
  input: string
): {
  urls: string[];
  correctedInput: string;
  hasErrors: boolean;
  invalidLines: string[];
} => {
  const lines = input.split("\n");
  const validUrls: string[] = [];
  const correctedLines: string[] = [];
  const invalidLines: string[] = [];
  let hasErrors = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      correctedLines.push("");
      continue;
    }

    // Check for invalid strings after spaces (doesn't start with http/https)
    const parts = trimmedLine.split(" ");
    let hasInvalidAfterSpace = false;

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part && !part.startsWith("http://") && !part.startsWith("https://")) {
        hasInvalidAfterSpace = true;
        break;
      }
    }

    if (hasInvalidAfterSpace) {
      // Found invalid string after space - mark as invalid
      hasErrors = true;
      invalidLines.push(trimmedLine);
      correctedLines.push(trimmedLine);
      continue;
    }

    // Check for URLs without protocol (like "www.example.com" or "example.com")
    const hasUrlWithoutProtocol =
      /\s+(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}/.test(
        trimmedLine
      );

    if (hasUrlWithoutProtocol) {
      // Found a domain without protocol - mark as invalid
      hasErrors = true;
      invalidLines.push(trimmedLine);
      correctedLines.push(trimmedLine);
      continue;
    }

    // Check if the line contains multiple URLs concatenated together
    const concatenatedUrls = splitConcatenatedUrls(trimmedLine);

    if (concatenatedUrls.length > 1) {
      // Multiple URLs found in one line - split them
      hasErrors = true;
      validUrls.push(...concatenatedUrls);
      correctedLines.push(concatenatedUrls.join("\n"));
    } else if (concatenatedUrls.length === 1) {
      // Single URL found
      validUrls.push(concatenatedUrls[0]);
      correctedLines.push(concatenatedUrls[0]);
    } else {
      // No URLs found - check if it's a valid URL anyway
      if (isValidUrl(trimmedLine)) {
        validUrls.push(trimmedLine);
        correctedLines.push(trimmedLine);
      } else {
        // Invalid URL or plain string
        hasErrors = true;
        invalidLines.push(trimmedLine);
        correctedLines.push(trimmedLine);
      }
    }
  }

  return {
    urls: validUrls,
    correctedInput: correctedLines.join("\n"),
    hasErrors,
    invalidLines,
  };
};

// Function to clean URLs by removing invalid strings after spaces
const cleanInvalidStringsAfterSpaces = (text: string): string => {
  const lines = text.split("\n");
  const cleanedLines: string[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      cleanedLines.push(line);
      continue;
    }

    // Split by spaces and filter out invalid parts
    const parts = line.split(" ");
    const validParts: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // If this part starts with http/https, keep it
      if (part.startsWith("http://") || part.startsWith("https://")) {
        validParts.push(part);
      } else if (i === 0) {
        // First part without http/https - check if it's a valid URL
        if (isValidUrl(part)) {
          validParts.push(part);
        }
        // If not valid, skip it
      } else {
        // Part after space that doesn't start with http/https - skip it
        // This removes the invalid string until next space
      }
    }

    cleanedLines.push(validParts.join(" "));
  }

  return cleanedLines.join("\n");
};

// Function to remove duplicate URLs
const removeDuplicateUrls = (urls: string[]): string[] => {
  const seen = new Set<string>();
  return urls.filter((url) => {
    const normalized = url.toLowerCase().trim();
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
};

// Function to generate random alphanumeric string
const generateRandomId = (length: number = 9): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const SubmitTaskForm = ({ onTaskSubmitted }: SubmitTaskFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      urls: "",
      type: "indexer",
      useVip: false,
    },
    mode: "onTouched",
  });

  const type = watch("type");
  const useVip = watch("useVip");
  const urlsValue = watch("urls");
  const [urlValidationError, setUrlValidationError] = useState<string | null>(
    null
  );
  const [showUrlCorrection, setShowUrlCorrection] = useState(false);
  const [correctedUrls, setCorrectedUrls] = useState("");
  const [isNameManuallyChanged, setIsNameManuallyChanged] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const queryClient = useQueryClient();
  const { data: creditsInfo, isLoading: creditsLoading } =
    useUserCreditsQuery();
  const invalidateTasks = useInvalidateTasksOnCreate();
  const invalidateCreditUsage = useInvalidateCreditUsage();
  const invalidateRecentTasks = useInvalidateRecentTasksOnCreate();
  const { user } = useUser();
  const { getCounter } = useTaskCounter();

  const isOutOfCredits = creditsInfo && creditsInfo.creditsAvailable <= 0;
  const [showPlansDialog, setShowPlansDialog] = useState(false);

  // Global URL progress context
  const { setIsVisible } = useUrlProgress();

  // Pending tasks context
  const { addPendingTask, removePendingTask } = usePendingTasks();

  // Auto-generate task name when component mounts or type changes
  useEffect(() => {
    const generateTaskName = async () => {
      if (!isNameManuallyChanged) {
        try {
          const randomId = generateRandomId(9);
          const taskName = `${
            type === "indexer" ? "Indexer" : "Checker"
          } Task #${randomId}`;
          setValue("title", taskName);
        } catch (error) {
          console.error("Failed to generate task name:", error);
          // Fallback to a simple name if generation fails
          const randomId = generateRandomId(9);
          const taskName = `${
            type === "indexer" ? "Indexer" : "Checker"
          } Task #${randomId}`;
          setValue("title", taskName);
        }
      }
    };

    generateTaskName();
  }, [type, isNameManuallyChanged, setValue]);

  // Calculate URL statistics and credit requirements
  const urlStats = useMemo(() => {
    if (!urlsValue) {
      return {
        totalUrls: 0,
        uniqueUrls: 0,
        duplicateCount: 0,
        validUrls: [],
        requiredCredits: 0,
        hasErrors: false,
        invalidLines: [],
      };
    }

    const {
      urls: validUrls,
      hasErrors,
      invalidLines,
    } = extractValidUrls(urlsValue);
    const uniqueUrls = removeDuplicateUrls(validUrls);
    const duplicateCount = validUrls.length - uniqueUrls.length;

    // Calculate required credits (new rule: always 1 credit per URL)
    let requiredCredits = uniqueUrls.length;

    return {
      totalUrls: validUrls.length,
      uniqueUrls: uniqueUrls.length,
      duplicateCount,
      validUrls: uniqueUrls,
      requiredCredits,
      hasErrors,
      invalidLines,
    };
  }, [urlsValue, useVip, type]);

  // Check if submission should be disabled
  const isSubmissionDisabled = useMemo(() => {
    if (
      isOutOfCredits ||
      creditsLoading ||
      urlValidationError ||
      isSubmittingTask
    ) {
      return true;
    }

    if (urlStats.uniqueUrls === 0) {
      return true;
    }

    if (urlStats.duplicateCount > 0) {
      return true;
    }

    if (urlStats.uniqueUrls > 10000) {
      return true;
    }

    // VIP limit no longer applies because all indexer tasks follow same pipeline

    if (
      creditsInfo &&
      urlStats.requiredCredits > creditsInfo.creditsAvailable
    ) {
      return true;
    }

    return false;
  }, [
    isOutOfCredits,
    creditsLoading,
    urlValidationError,
    urlStats,
    useVip,
    creditsInfo,
    isSubmittingTask,
  ]);

  // Handle URL input changes for real-time validation
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    const { urls, correctedInput, hasErrors, invalidLines } =
      extractValidUrls(input);

    console.log("URL validation:", {
      input,
      urls,
      correctedInput,
      hasErrors,
      invalidLines,
    });

    if (hasErrors) {
      if (invalidLines.length > 0) {
        const invalidExamples = invalidLines.slice(0, 3).join(", ");
        setUrlValidationError(
          `Invalid URLs detected: "${invalidExamples}"${
            invalidLines.length > 3 ? " and more..." : ""
          }. All URLs must start with http:// or https:// protocol. Use "Clean URLs" to remove invalid parts.`
        );
      } else {
        setUrlValidationError(
          'Some URLs appear to be malformed. Click "Clean URLs" to auto-correct them.'
        );
      }
      setCorrectedUrls(correctedInput);
      setShowUrlCorrection(true);
    } else {
      setUrlValidationError(null);
      setShowUrlCorrection(false);
    }
  };

  // Apply URL corrections (now: clean first, then fix)
  const applyUrlCorrections = () => {
    // Step 1: Clean invalid URLs/strings after spaces
    const currentValue = watch("urls");
    const cleaned = cleanInvalidStringsAfterSpaces(currentValue);
    // Step 2: Apply fix logic (split concatenated URLs, etc.)
    const { correctedInput } = extractValidUrls(cleaned);
    setValue("urls", correctedInput);
    setUrlValidationError(null);
    setShowUrlCorrection(false);
    toast({
      title: "URLs fixed and cleaned",
      description:
        "Invalid URLs have been removed and formatting has been corrected.",
    });
  };

  // Clean URLs - remove invalid ones and keep only valid URLs
  const cleanUrls = () => {
    const currentValue = watch("urls");
    const cleanedUrls = cleanInvalidStringsAfterSpaces(currentValue);

    if (cleanedUrls.length === 0) {
      toast({
        title: "No valid URLs found",
        description:
          "No valid URLs to keep. Please add URLs with http:// or https:// protocol.",
        variant: "destructive",
      });
      return;
    }

    setValue("urls", cleanedUrls);
    setUrlValidationError(null);
    setShowUrlCorrection(false);

    toast({
      title: "URLs cleaned",
      description: `Removed invalid URLs. Kept ${
        cleanedUrls.split("\n").filter((line) => line.trim() !== "").length
      } valid URL(s).`,
    });
  };

  // Remove duplicate URLs
  const removeDuplicates = () => {
    const currentValue = watch("urls");
    const { urls: validUrls } = extractValidUrls(currentValue);
    const uniqueUrls = removeDuplicateUrls(validUrls);

    if (uniqueUrls.length === validUrls.length) {
      toast({
        title: "No duplicates found",
        description: "All URLs are already unique.",
      });
      return;
    }

    setValue("urls", uniqueUrls.join("\n"));
    toast({
      title: "Duplicates removed",
      description: `Removed ${
        validUrls.length - uniqueUrls.length
      } duplicate URL(s).`,
    });
  };

  const onSubmit = async (values: TaskFormValues) => {
    console.log("onSubmit", values);

    // Prevent multiple submissions
    if (isSubmittingTask) {
      return;
    }

    setIsSubmittingTask(true);

    // return false;
    // Validate and correct URLs before submission
    const {
      urls: validUrls,
      hasErrors,
      invalidLines,
    } = extractValidUrls(values.urls);

    if (hasErrors) {
      if (invalidLines.length > 0) {
        toast({
          title: "Invalid URLs detected",
          description: `Please ensure all URLs start with http:// or https:// protocol. Found ${invalidLines.length} invalid entries.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Malformed URLs detected",
          description: "Please fix the malformed URLs before submitting.",
          variant: "destructive",
        });
      }
      setIsSubmittingTask(false);
      return;
    }

    if (validUrls.length === 0) {
      toast({
        title: "No valid URLs",
        description:
          "Please enter at least one valid URL starting with http:// or https:// protocol.",
        variant: "destructive",
      });
      setIsSubmittingTask(false);
      return;
    }

    // Remove duplicates before submission
    const uniqueUrls = removeDuplicateUrls(validUrls);

    if (uniqueUrls.length > 10000) {
      toast({
        title: "Too many URLs",
        description: "Maximum 10,000 URLs allowed per task.",
        variant: "destructive",
      });
      setIsSubmittingTask(false);
      return;
    }

    // No VIP-specific limits now

    // VIP toggle no longer relevant

    // Check credit availability
    const requiredCredits = uniqueUrls.length; // New rule
    if (creditsInfo && requiredCredits > creditsInfo.creditsAvailable) {
      toast({
        title: "Insufficient credits",
        description: `You need ${requiredCredits} credits but only have ${creditsInfo.creditsAvailable} available.`,
        variant: "destructive",
      });
      setIsSubmittingTask(false);
      return;
    }

    // Build payload
    const payload: any = {
      title: values.title,
      urls: uniqueUrls, // Use deduplicated URLs
      type: values.type,
    };
    // New: all indexer tasks use VIP pipeline endpoint
    const endpoint =
      values.type === "indexer" ? "/vip/create" : "/proxy/speedyindex";

    console.log(`🚀 Submitting task to endpoint: ${endpoint}`, { payload });

    // Add pending task to show immediately in table
    const pendingTaskId = addPendingTask({
      title: values.title,
      type: values.type,
      urls: uniqueUrls,
    });

    // Show immediate feedback for all tasks
    if (values.type === "indexer") {
      console.log("🚀 Showing URL progress immediately for Indexer task");
      setIsVisible(true);

      // Show immediate success message
      toast({
        title: "Task submitted successfully!",
        description:
          "Task created successfully and queued for processing. You can continue with other tasks while this processes in the background.",
      });
    } else {
      // For checker tasks, show immediate success message
      toast({
        title: "Task submitted successfully!",
        description: `Your ${values.type} task has been created and is now processing.`,
      });
    }

    // Call the parent callback immediately to close dialog
    if (onTaskSubmitted) onTaskSubmitted();

    // Don't reset form - keep it as is for user convenience
    // Reset submitting state
    setIsSubmittingTask(false);

    // Make API call in background (non-blocking)
    postWithAuth<any>(endpoint, payload)
      .then((result) => {
        if (result.code === 0) {
          console.log("✅ Task created successfully:", result);
          console.log("📋 Task type:", values.type);
          console.log("🆔 Task ID:", result.task?.id);

          // For Indexer tasks, progress is already shown
          if (values.type === "indexer" && result.task?.id) {
            console.log(
              "🚀 Task ID received for Indexer task:",
              result.task.id
            );
          } else {
            console.log(
              "❌ Not showing progress - Type:",
              values.type,
              "Task ID:",
              result.task?.id
            );
          }

          console.log("🔄 Invalidating queries after task creation...");

          // Invalidate tasks for the specific type to trigger a refetch
          invalidateTasks(values.type);
          invalidateRecentTasks();

          // Invalidate credit usage to refresh data
          invalidateCreditUsage();

          // Invalidate user credits everywhere
          queryClient.invalidateQueries({ queryKey: ["userCredits"] });

          // Force refetch all task-related queries
          queryClient.refetchQueries({
            queryKey: ["indexer-tasks"],
            exact: false,
          });
          queryClient.refetchQueries({
            queryKey: ["checker-tasks"],
            exact: false,
          });
          queryClient.refetchQueries({
            queryKey: ["indexer-tasks-overview"],
            exact: false,
          });
          queryClient.refetchQueries({
            queryKey: ["checker-tasks-overview"],
            exact: false,
          });

          console.log("✅ Query invalidation completed");

          // Remove pending task since real task is now created
          removePendingTask(pendingTaskId);
        } else {
          // Handle error messages from both endpoints
          const errorMessage =
            result.message || result.error || "Failed to submit task";
          throw new Error(errorMessage);
        }
      })
      .catch((error: any) => {
        console.error("Error submitting task:", error);

        // Hide progress if there was an error for indexer tasks
        if (values.type === "indexer") {
          setIsVisible(false);
        }

        // Remove pending task since there was an error
        removePendingTask(pendingTaskId);

        toast({
          title: "Error submitting task",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });

        // Reset submitting state
        setIsSubmittingTask(false);
      });
  };

  return (
    <>
      {isOutOfCredits ? (
        <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-warning/10 to-warning/5 text-center">
          <div className="text-foreground/80 font-medium max-w-md">
            {creditsInfo?.heldCredits && creditsInfo.heldCredits > 0 ? (
              <>
                You have used all available credits ({creditsInfo.usedCredits}{" "}
                used, {creditsInfo.heldCredits} on hold). Please wait for your
                tasks to complete and credits to be released, or upgrade your
                plan.
              </>
            ) : (
              "You have reached your monthly credit limit. Please upgrade your plan or wait for the next period."
            )}
          </div>
          <Link href="/plans-billing">
            <Button variant="hero" size="lg" className="mt-2">
              View Plans
            </Button>
          </Link>
          {/* <SubscriptionPlansDialog open={showPlansDialog} onOpenChange={setShowPlansDialog} /> */}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Task Type with Tabs - Moved to top and made compact */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700 uppercase ">
              🔧 Task Type
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <ToggleGroup.Root
                  type="single"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="inline-flex w-full max-w-sm bg-muted rounded-lg p-1 h-9 ml-20"
                  aria-label="Type"
                >
                  <ToggleGroup.Item
                    value="indexer"
                    className="flex-1 flex items-center justify-center gap-1 rounded-md transition-all text-sm font-medium h-7
          data-[state=on]:bg-gradient-to-r data-[state=on]:from-primary data-[state=on]:to-secondary data-[state=on]:text-white"
                  >
                    <span>🚀</span>
                    <span>Indexer</span>
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value="checker"
                    className="flex-1 flex items-center justify-center gap-1 rounded-md transition-all text-sm font-medium h-7
          data-[state=on]:bg-gradient-to-r data-[state=on]:from-secondary data-[state=on]:to-primary data-[state=on]:text-white"
                  >
                    <span>🔍</span>
                    <span>Checker</span>
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              )}
            />

            <p className="text-xs text-muted-foreground">
              {type === "indexer"
                ? "Submit URLs for Google indexing"
                : "Check current indexing status"}{" "}
              • Uses unified credits
            </p>
          </div>

          {/* Task Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm  text-gray-700 uppercase "
            >
              📝 Task Title{" "}
              {!isNameManuallyChanged && (
                <span className="text-xs text-blue-600 ">(Auto-generated)</span>
              )}
            </Label>
            <Input
              id="title"
              placeholder="e.g., Batch April 29"
              {...register("title", {
                required: "Task title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
                onChange: (e) => {
                  // Mark as manually changed if user edits the title
                  if (e.target.value !== watch("title")) {
                    setIsNameManuallyChanged(true);
                  }
                },
              })}
              className="h-11 border-gray-200 focus:border-primary focus:ring-primary rounded-lg bg-white"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
            {!isNameManuallyChanged && (
              <p className="text-xs text-blue-600">
                💡 Task name is auto-generated. You can edit it anytime.
              </p>
            )}
          </div>

          {/* VIP toggle removed: all indexer tasks use the same pipeline now */}

          {/* URLs */}
          <div className="space-y-2">
            <Label htmlFor="urls" className="text-sm  text-gray-700 uppercase ">
              🔗 URLs
            </Label>
            <Textarea
              id="urls"
              placeholder="Enter URLs (one per line)&#10;https://example.com/page1&#10;https://example.com/page2"
              {...register("urls", {
                required: "URLs are required",
                onChange: handleUrlInputChange,
              })}
              rows={8}
              className="border-gray-200 focus:border-primary focus:ring-primary rounded-lg bg-white"
            />

            {/* URL validation error and correction */}
            {urlValidationError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-amber-700 font-medium mb-2">
                      {urlValidationError}
                    </p>
                    {/* <div className="flex space-x-2">
                      {showUrlCorrection && (
                        <Button
                          type="button"
                          onClick={applyUrlCorrections}
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Fix URLs
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={cleanUrls}
                        size="sm"
                        variant="destructive"
                      >
                        Clean URLs
                      </Button>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {errors.urls && (
              <p className="text-red-500 text-xs mt-1">{errors.urls.message}</p>
            )}
            {creditsInfo && (
              <div className="mt-3 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    Available Credits:{" "}
                    <span className="font-semibold">
                      {creditsInfo.creditsAvailable}
                    </span>
                  </span>
                  {urlStats.requiredCredits > creditsInfo.creditsAvailable ? (
                    <Badge variant="destructive" className="text-xs">
                      Insufficient Credits
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="text-xs bg-green-100 text-green-800"
                    >
                      Sufficient Credits
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {/* URL Statistics and Credit Information */}
            {urlsValue && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex justify-between flex-wrap text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-700  ">
                        <span className="text-xs text-blue-600 ">
                          Total URLs:
                        </span>{" "}
                        {urlStats.totalUrls}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-700 ">
                        <span className="text-xs text-green-600 ">
                          Unique URLs:
                        </span>{" "}
                        {urlStats.uniqueUrls}
                      </div>
                    </div>
                    {urlStats.duplicateCount > 0 && (
                      <div className="text-center">
                        <div className="font-semibold text-orange-700 ">
                          <span className="text-xs text-orange-600 ">
                            Duplicates:
                          </span>{" "}
                          {urlStats.duplicateCount}
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="font-semibold text-purple-700 ">
                        <span className="text-xs text-purple-600 ">
                          Credits Needed:
                        </span>{" "}
                        {urlStats.requiredCredits}
                      </div>
                    </div>
                  </div>

                  {/* Credit availability check */}

                  {/* Action buttons for URL management */}
                  {(urlStats.duplicateCount > 0 || urlValidationError) && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex flex-wrap gap-2">
                        {urlStats.duplicateCount > 0 && (
                          <Button
                            type="button"
                            onClick={removeDuplicates}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            🗑️ Remove Duplicates
                          </Button>
                        )}
                        {urlValidationError && (
                          <Button
                            type="button"
                            onClick={cleanUrls}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            🧹 Clean URLs
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Compact tips */}
            <div className="text-xs text-gray-500  space-y-1">
              <p>📊 Max 10,000 URLs per task • Each URL = 1 credit</p>
              <p>
                💡 URLs must start with http:// or https:// • Use "Fix URLs" for
                corrections
              </p>
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full h-12"
            disabled={isSubmissionDisabled}
          >
            {isSubmittingTask ? "⏳ Submitting..." : "🚀 Submit Task"}
          </Button>

          {/* Submission disabled reason */}
          {isSubmissionDisabled && (
            <div className="text-center text-sm text-gray-500 ">
              {urlStats.uniqueUrls === 0 &&
                "Please enter at least one valid URL"}
              {urlStats.uniqueUrls > 10000 &&
                "Maximum 10,000 URLs allowed per task"}
              {/* No VIP limit now */}
              {creditsInfo &&
                urlStats.requiredCredits > creditsInfo.creditsAvailable &&
                `Insufficient credits: need ${urlStats.requiredCredits}, have ${creditsInfo.creditsAvailable}`}
              {urlValidationError && "Please fix URL validation errors"}
            </div>
          )}
        </form>
      )}
    </>
  );
};
