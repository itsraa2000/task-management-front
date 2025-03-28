import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";

const boardFormSchema = z.object({
  name: z.string().min(1, "Board name is required").max(255, "Board name is too long"),
});

type BoardFormValues = z.infer<typeof boardFormSchema>;

interface BoardFormProps {
  initialData?: Partial<BoardFormValues>;
  onSubmit: (data: BoardFormValues) => void;
  onCancel: () => void;
}

const BoardForm: React.FC<BoardFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BoardFormValues>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const handleSubmit = async (data: BoardFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter board name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : initialData ? "Update Board" : "Create Board"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BoardForm;