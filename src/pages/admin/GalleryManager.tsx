import { useState, useEffect } from "react";
import { useGalleryItems, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem, useGalleryTextSettings, useUpdateGalleryTextSettings } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
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
function SortableRow({ item, onEdit, onDelete, isDeleting }: { item: any; onEdit: (item: any) => void; onDelete: (id: string) => void; isDeleting: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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
      <TableCell className="font-medium">{item.number}</TableCell>
      <TableCell className="font-medium">{item.title || "-"}</TableCell>
      <TableCell>
        <div className="w-16 h-10 rounded overflow-hidden border border-white/10">
          <img 
            src={item.image} 
            alt={item.title || "Gallery item"}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </TableCell>
      <TableCell>{item.order}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs ${item.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {item.active ? 'Active' : 'Inactive'}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(item.id)} disabled={isDeleting}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function GalleryManager() {
  const { data: items, isLoading } = useGalleryItems(true);
  const { mutate: createItem, isLoading: isCreating } = useCreateGalleryItem();
  const { mutate: updateItem, isLoading: isUpdating } = useUpdateGalleryItem();
  const { mutate: deleteItem, isLoading: isDeleting } = useDeleteGalleryItem();
  const { data: textSettings } = useGalleryTextSettings();
  const { mutate: updateTextSettings, isLoading: isUpdatingText } = useUpdateGalleryTextSettings();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [startTextFirst, setStartTextFirst] = useState("");
  const [startTextSecond, setStartTextSecond] = useState("");
  const [endTextFirst, setEndTextFirst] = useState("");
  const [endTextSecond, setEndTextSecond] = useState("");
  const [itemsList, setItemsList] = useState<any[]>([]);

  // Initialize items when gallery items load
  useEffect(() => {
    if (items && items.length > 0) {
      const sortedItems = [...(items as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
      setItemsList(sortedItems);
    }
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = itemsList.findIndex((item) => item.id === active.id);
      const newIndex = itemsList.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(itemsList, oldIndex, newIndex);
      setItemsList(newItems);

      // Update orders in database
      try {
        const updatePromises = newItems.map((item, index) =>
          updateItem(item.id, { order: index + 1 })
        );
        await Promise.all(updatePromises);
        toast.success("Order updated successfully");
      } catch (error) {
        console.error("Error updating order:", error);
        toast.error("Failed to update order");
        // Revert on error
        if (items && items.length > 0) {
          const sortedItems = [...(items as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
          setItemsList(sortedItems);
        }
      }
    }
  };

  // Initialize text settings when component mounts or data changes
  useEffect(() => {
    if (textSettings) {
      setStartTextFirst(textSettings.startText?.first || 'Ariel');
      setStartTextSecond(textSettings.startText?.second || 'Croze');
      setEndTextFirst(textSettings.endText?.first || 'Daria');
      setEndTextSecond(textSettings.endText?.second || 'Gaita');
    }
  }, [textSettings]);

  const handleSaveTextSettings = () => {
    const settings = {
      startText: {
        first: startTextFirst || 'Ariel',
        second: startTextSecond || 'Croze'
      },
      endText: {
        first: endTextFirst || 'Daria',
        second: endTextSecond || 'Gaita'
      }
    };
    
    updateTextSettings(settings)
      .then(() => {
        toast.success("Gallery text settings saved successfully");
      })
      .catch((error) => {
        console.error("Save error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to save text settings");
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title") as string, // This will be displayed where tags are
      number: formData.get("number") as string,
      image: formData.get("image") as string,
      tags: null, // Tags are no longer used
      order: parseInt(formData.get("order") as string) || 0,
      active: formData.get("active") === "on",
    };

    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
        toast.success("Gallery item updated successfully");
      } else {
        await createItem(data);
        toast.success("Gallery item created successfully");
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save gallery item");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await deleteItem(id);
        toast.success("Gallery item deleted");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Horizontal Gallery</h1>
          <p className="text-muted-foreground">Manage the gallery items displayed on the home page.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5 border-white/5">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Title (Subtitle)</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : itemsList && itemsList.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={itemsList.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {itemsList.map((item: any) => (
                      <SortableRow
                        key={item.id}
                        item={item}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No gallery items found. Click "Add New Item" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingItem(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Gallery Item" : "Create New Gallery Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the gallery item details below." : "Fill in the details to create a new gallery item."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number</label>
                <Input name="number" defaultValue={editingItem?.number} placeholder="01, 02, 03..." required />
                <p className="text-xs text-muted-foreground">Will be displayed as &quot;Project [number]&quot;</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (Subtitle)</label>
                <Input name="title" defaultValue={editingItem?.title} placeholder="This text appears below the project number" />
                <p className="text-xs text-muted-foreground">This text appears where tags used to be displayed</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input name="image" defaultValue={editingItem?.image} placeholder="https://example.com/image.jpg" required />
              {editingItem?.image && (
                <div className="mt-2 w-full max-w-xs rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <img 
                    src={editingItem.image} 
                    alt="Preview"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Input type="number" name="order" defaultValue={editingItem?.order || 0} />
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="active" 
                    defaultChecked={editingItem?.active !== false}
                    className="w-4 h-4 rounded border-white/20"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving..." : "Save Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Gallery Text Settings */}
      <Card className="bg-card/50 border-white/5">
        <CardHeader>
          <CardTitle>Gallery Text Settings</CardTitle>
          <CardDescription>Manage the start and end text displayed in the horizontal gallery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Start Text</h3>
              <div className="space-y-2">
                <Label>First Line</Label>
                <Input
                  value={startTextFirst}
                  onChange={(e) => setStartTextFirst(e.target.value)}
                  placeholder="Ariel"
                />
              </div>
              <div className="space-y-2">
                <Label>Second Line</Label>
                <Input
                  value={startTextSecond}
                  onChange={(e) => setStartTextSecond(e.target.value)}
                  placeholder="Croze"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">End Text</h3>
              <div className="space-y-2">
                <Label>First Line</Label>
                <Input
                  value={endTextFirst}
                  onChange={(e) => setEndTextFirst(e.target.value)}
                  placeholder="Daria"
                />
              </div>
              <div className="space-y-2">
                <Label>Second Line</Label>
                <Input
                  value={endTextSecond}
                  onChange={(e) => setEndTextSecond(e.target.value)}
                  placeholder="Gaita"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveTextSettings} disabled={isUpdatingText}>
              {isUpdatingText ? "Saving..." : "Save Text Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

