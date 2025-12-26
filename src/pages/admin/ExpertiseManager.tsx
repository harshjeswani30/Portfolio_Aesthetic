import { useState, useEffect } from "react";
import { useExpertiseCards, useCreateExpertiseCard, useUpdateExpertiseCard, useDeleteExpertiseCard } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
function SortableRow({ card, onEdit, onDelete, isDeleting }: { card: any; onEdit: (card: any) => void; onDelete: (id: string) => void; isDeleting: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

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
      <TableCell className="font-medium">{card.title}</TableCell>
      <TableCell className="text-muted-foreground truncate max-w-xs">{card.description}</TableCell>
      <TableCell>{card.icon}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(card)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(card.id)} disabled={isDeleting}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ExpertiseManager() {
  const { data: cards, isLoading } = useExpertiseCards(true);
  const { mutate: createCard, isLoading: isCreating } = useCreateExpertiseCard();
  const { mutate: updateCard, isLoading: isUpdating } = useUpdateExpertiseCard();
  const { mutate: deleteCard, isLoading: isDeleting } = useDeleteExpertiseCard();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [imagesInput, setImagesInput] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);

  // Initialize items when cards load
  useEffect(() => {
    if (cards && cards.length > 0) {
      const sortedCards = [...(cards as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(sortedCards);
    }
  }, [cards]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Update orders in database
      try {
        const updatePromises = newItems.map((item, index) =>
          updateCard(item.id, { order: index + 1 })
        );
        await Promise.all(updatePromises);
        toast.success("Order updated successfully");
      } catch (error) {
        console.error("Error updating order:", error);
        toast.error("Failed to update order");
        // Revert on error
        if (cards && cards.length > 0) {
          const sortedCards = [...(cards as any[])].sort((a, b) => (a.order || 0) - (b.order || 0));
          setItems(sortedCards);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get images string and handle empty/whitespace
    const imagesString = imagesInput || (formData.get("images") as string) || "";
    const imagesArray = imagesString
      .split(",")
      .map(s => s.trim())
      .filter(Boolean); // Remove empty strings
    
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      long_description: formData.get("longDescription") as string, // Database uses snake_case
      icon: formData.get("icon") as string,
      skills: ((formData.get("skills") as string) || "").split(",").map(s => s.trim()).filter(Boolean),
      images: imagesArray, // Always send array, even if empty
      order: parseInt(formData.get("order") as string) || 0,
      active: true,
    };

    try {
      if (editingCard) {
        await updateCard(editingCard.id, data);
        toast.success("Card updated successfully");
      } else {
        await createCard(data);
        toast.success("Card created successfully");
      }
      setIsDialogOpen(false);
      setEditingCard(null);
      setImagesInput("");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save card");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      try {
        await deleteCard(id);
        toast.success("Card deleted");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const openEdit = (card: any) => {
    setEditingCard(card);
    // Initialize images input with existing images
    if (card?.images && Array.isArray(card.images) && card.images.length > 0) {
      setImagesInput(card.images.join(", "));
    } else {
      setImagesInput("");
    }
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingCard(null);
    setImagesInput("");
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Expertise Cards</h1>
          <p className="text-muted-foreground">Manage the cards displayed on the Expertise page.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Card
        </Button>
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5 border-white/5">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : items && items.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((card: any) => (
                      <SortableRow
                        key={card.id}
                        card={card}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No cards found. Click "Add New Card" to create one.
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
          // Reset state when dialog closes
          setEditingCard(null);
          setImagesInput("");
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCard ? "Edit Card" : "Create New Card"}</DialogTitle>
            <DialogDescription>
              {editingCard ? "Update the expertise card details below." : "Fill in the details to create a new expertise card."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input name="title" defaultValue={editingCard?.title} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon (Lucide Name)</label>
                <Input name="icon" defaultValue={editingCard?.icon} placeholder="e.g. Target, Users" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <Textarea name="description" defaultValue={editingCard?.description} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Long Description (Modal)</label>
              <Textarea 
                name="longDescription" 
                defaultValue={editingCard?.long_description || editingCard?.longDescription} 
                className="h-32" 
                placeholder="This detailed description appears in the modal when users click on the card..."
                required 
              />
              <p className="text-xs text-muted-foreground">
                This content appears in the detailed modal view when users click on the card.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <Input name="skills" defaultValue={editingCard?.skills?.join(", ")} placeholder="Strategy, Planning, Analysis" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URLs (comma separated)</label>
              <Input 
                name="images" 
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
              />
              <p className="text-xs text-muted-foreground">
                First image appears in the modal when clicking the card. First 2 images appear as floating previews on hover (desktop only).
              </p>
              {/* Real-time preview of images as user types */}
              {imagesInput && (
                (() => {
                  const imageUrls = imagesInput
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean)
                    .slice(0, 2); // Show max 2 previews
                  
                  if (imageUrls.length > 0) {
                    return (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {imageUrls.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5">
                            <img 
                              src={img} 
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                                      Image failed to load
                                    </div>
                                  `;
                                }
                              }}
                              onLoad={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.opacity = '1';
                              }}
                              style={{ opacity: 0, transition: 'opacity 0.3s' }}
                            />
                            <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                              {idx === 0 ? 'Modal' : 'Hover'}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <Input type="number" name="order" defaultValue={editingCard?.order || 0} />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving..." : "Save Card"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
