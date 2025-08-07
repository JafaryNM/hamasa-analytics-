import { z } from "zod";

const ArticleSchema = z.object({
  title: z.string().min(3, "Title is required"),
  link: z.string().url("Invalid URL"),
});

export const MediaInfoSchema = z
  .object({
    mediaChannelUuid: z.string().min(1, "Media channel is required"),

    fileMediaWork: z.union([z.instanceof(File), z.string().min(1)]).optional(),

    attachedLinks: z.array(ArticleSchema).optional(),

    editorReferences: z
      .union([
        z.instanceof(File),
        z.string().min(1, "Editor reference is required"),
      ])
      .refine((val) => val instanceof File || typeof val === "string", {
        message: "Invalid file type for editor reference",
      }),
  })
  .superRefine((data, ctx) => {
    const hasValidFile =
      data.fileMediaWork instanceof File ||
      (typeof data.fileMediaWork === "string" &&
        data.fileMediaWork.trim() !== "");

    const hasValidLinks =
      Array.isArray(data.attachedLinks) && data.attachedLinks.length > 0;

    // Require at least one of the two: file or links
    if (!hasValidFile && !hasValidLinks) {
      ctx.addIssue({
        path: ["fileMediaWork"],
        code: z.ZodIssueCode.custom,
        message: "You must upload a file or add at least one article link",
      });
    }

    // Validate each attached link
    if (Array.isArray(data.attachedLinks)) {
      data.attachedLinks.forEach((item, index) => {
        if (!item.title || item.title.trim().length < 3) {
          ctx.addIssue({
            path: ["attachedLinks", index, "title"],
            code: z.ZodIssueCode.custom,
            message: "Title is required and must be at least 3 characters",
          });
        }
        if (!item.link || !/^https?:\/\/.+/.test(item.link.trim())) {
          ctx.addIssue({
            path: ["attachedLinks", index, "link"],
            code: z.ZodIssueCode.custom,
            message: "A valid URL is required",
          });
        }
      });
    }
  });

export type MediaInfoData = z.infer<typeof MediaInfoSchema>;
