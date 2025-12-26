import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Mail } from "lucide-react";

interface EmailAddressesEditorProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  title?: string;
  description?: string;
}

export function EmailAddressesEditor({
  emails,
  onChange,
  title = "Email Addresses",
  description = "Manage email addresses for the contact page",
}: EmailAddressesEditorProps) {
  // Ensure emails is always an array
  const safeEmails = Array.isArray(emails) ? emails : [];

  const addEmail = () => {
    onChange([...safeEmails, ""]);
  };

  const removeEmail = (index: number) => {
    onChange(safeEmails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    const updated = [...safeEmails];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={addEmail}>
          <Plus className="h-4 w-4 mr-2" />
          Add Email
        </Button>
      </div>

      <div className="space-y-3">
        {safeEmails.map((email, index) => (
          <div key={index} className="flex gap-2 items-end p-4 border border-border/50 rounded-lg bg-card/30">
            <div className="flex-1">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEmail(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {safeEmails.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No email addresses added. Click "Add Email" to add one.
          </p>
        )}
      </div>
    </div>
  );
}

