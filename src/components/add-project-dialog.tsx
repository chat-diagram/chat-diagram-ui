"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { z } from "zod";
import { useProjectsStore } from "@/store/projects";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateProject } from "@/hooks/use-projects";
import { useI18n } from "@/i18n";

export const AddProjectDialog = () => {
  const router = useRouter();
  const t = useI18n();
  const { addProjectDialogOpen, setAddProjectDialogOpen } = useProjectsStore();
  const addProjectFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    description: z.string().default(""),
  });

  const addProjectForm = useForm<z.infer<typeof addProjectFormSchema>>({
    resolver: zodResolver(addProjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const onAddProjectDialogOpenChange = (open: boolean) => {
    if (!open) {
      addProjectForm.reset();
    }
    setAddProjectDialogOpen(open);
  };

  const createProject = useCreateProject();

  const handleAddProjectSubmit = async (
    data: z.infer<typeof addProjectFormSchema>
  ) => {
    // const res = await projectsApi.createProject(data);
    const project = await createProject.mutateAsync(data);
    setAddProjectDialogOpen(false);
    router.push(`/chat/projects/${project.id}`);
  };
  return (
    <Dialog
      open={addProjectDialogOpen}
      onOpenChange={onAddProjectDialogOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("project.addDialog.title")}</DialogTitle>
        </DialogHeader>
        <Form {...addProjectForm}>
          <form
            onSubmit={addProjectForm.handleSubmit(handleAddProjectSubmit)}
            className="space-y-6"
          >
            <FormField
              control={addProjectForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("project.addDialog.name")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("project.addDialog.namePlaceholder")}
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={addProjectForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("project.addDialog.description")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "project.addDialog.descriptionPlaceholder"
                      )}
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddProjectDialogOpen(false)}
              >
                {t("cancelBtn")}
              </Button>
              <Button type="submit">{t("createBtn")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
