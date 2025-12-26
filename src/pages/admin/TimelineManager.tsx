import { useState, useEffect } from "react";
import { useTimeline, useCreateTimelineEntry, useUpdateTimelineEntry, useDeleteTimelineEntry } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Row Component
function SortableRow({ entry, onEdit, onDelete, isDeleting }: { entry: any; onEdit: (entry: any) => void; onDelete: (id: string) => void; isDeleting: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="hover:bg-white/5 border-white/5"
    >
      <TableCell>
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-bold">{entry.year}</TableCell>
      <TableCell>{entry.title}</TableCell>
      <TableCell className="text-muted-foreground truncate max-w-xs">
        {typeof entry.content === 'string' ? entry.content : 'Complex content'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(entry.id)} disabled={isDeleting}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function TimelineManager() {
  const { data: entries, isLoading } = useTimeline();
  const { mutate: createEntry, isLoading: isCreating } = useCreateTimelineEntry();
  const { mutate: updateEntry, isLoading: isUpdating } = useUpdateTimelineEntry();
  const { mutate: deleteEntry, isLoading: isDeleting } = useDeleteTimelineEntry();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [entriesList, setEntriesList] = useState<any[]>([]);

  // Initialize entries when timeline loads
  useEffect(() => {
    if (entries && entries.length > 0) {
      const sortedEntries = [...(entries as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
      setEntriesList(sortedEntries);
    }
  }, [entries]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = entriesList.findIndex((entry) => entry.id === active.id);
      const newIndex = entriesList.findIndex((entry) => entry.id === over.id);

      const newEntries = arrayMove(entriesList, oldIndex, newIndex);
      setEntriesList(newEntries);

      // Update orders in database
      try {
        const updatePromises = newEntries.map((entry, index) =>
          updateEntry(entry.id, { order: index + 1 })
        );
        await Promise.all(updatePromises);
        toast.success("Order updated successfully");
      } catch (error) {
        console.error("Error updating order:", error);
        toast.error("Failed to update order");
        // Revert on error
        if (entries && entries.length > 0) {
          const sortedEntries = [...(entries as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
          setEntriesList(sortedEntries);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse images from comma-separated string
    const imagesInput = formData.get("images") as string;
    const images = imagesInput 
      ? imagesInput.split(',').map(url => url.trim()).filter(url => url.length > 0)
      : undefined;
    
    const data = {
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string, // Storing as string for now
      images: images,
      order: parseInt(formData.get("order") as string) || 0,
      active: true,
    };

    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, data);
        toast.success("Entry updated");
      } else {
        await createEntry(data);
        toast.success("Entry created");
      }
      setIsDialogOpen(false);
      setEditingEntry(null);
    } catch (error) {
      toast.error("Failed to save");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this entry?")) {
      try {
        await deleteEntry(id);
        toast.success("Deleted");
      } catch (error) {
        toast.error("Failed to delete");
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Timeline</h1>
          <p className="text-muted-foreground">Manage your career journey milestones.</p>
        </div>
        <Button onClick={() => { setEditingEntry(null); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5 border-white/5">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : entriesList && entriesList.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={entriesList.map((entry) => entry.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {entriesList.map((entry: any) => (
                      <SortableRow
                        key={entry.id}
                        entry={entry}
                        onEdit={(entry) => { setEditingEntry(entry); setIsDialogOpen(true); }}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No entries yet. Create your first timeline entry!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Entry" : "New Entry"}</DialogTitle>
            <DialogDescription>
              {editingEntry ? "Update the timeline entry details below." : "Fill in the details to create a new timeline entry."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input name="year" defaultValue={editingEntry?.year} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Input type="number" name="order" defaultValue={editingEntry?.order || 0} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input name="title" defaultValue={editingEntry?.title} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea name="content" defaultValue={editingEntry?.content} className="h-32" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Images (comma-separated URLs)</label>
              <Textarea 
                name="images" 
                defaultValue={editingEntry?.images?.join(', ') || ''} 
                className="h-20" 
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <p className="text-xs text-muted-foreground">Enter image URLs separated by commas</p>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
