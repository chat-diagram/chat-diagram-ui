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
import { useDiagramsStore } from "@/store/diagrams";
import { useEffect } from "react";
import { useRenameDiagram } from "@/hooks/use-diagrams";

export const RenameDiagramDialog = () => {
  const {
    renameDiagramDialogOpen,
    setRenameDiagramDialogOpen,
    renameDiagramInfo,
  } = useDiagramsStore();
  const renameDiagramFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  });

  const renameDiagramForm = useForm<z.infer<typeof renameDiagramFormSchema>>({
    resolver: zodResolver(renameDiagramFormSchema),
    defaultValues: {
      name: renameDiagramInfo?.title || "",
    },
  });
  useEffect(() => {
    if (renameDiagramInfo) {
      renameDiagramForm.setValue("name", renameDiagramInfo.title);
    }
  }, [renameDiagramInfo, renameDiagramForm]);
  const onRenameDiagramDialogOpenChange = (open: boolean) => {
    if (!open) {
      renameDiagramForm.reset();
    }
    setRenameDiagramDialogOpen(open, renameDiagramInfo);
  };

  const { mutate: renameDiagram } = useRenameDiagram();
  const handleRenameDiagramSubmit = async (
    data: z.infer<typeof renameDiagramFormSchema>
  ) => {
    if (renameDiagramInfo) {
      await renameDiagram({
        diagramId: renameDiagramInfo.id,
        data: { title: data.name },
        projectId: renameDiagramInfo.projectId,
      });

      setRenameDiagramDialogOpen(false);
    }
  };
  return (
    <Dialog
      open={renameDiagramDialogOpen}
      onOpenChange={onRenameDiagramDialogOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Diagram</DialogTitle>
        </DialogHeader>
        <Form {...renameDiagramForm}>
          <form
            onSubmit={renameDiagramForm.handleSubmit(handleRenameDiagramSubmit)}
            className="space-y-6"
          >
            <FormField
              control={renameDiagramForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="This is a diagram name"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            {/* <FormField
              control={renameDiagramForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="This is a description"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField> */}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRenameDiagramDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Rename</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
