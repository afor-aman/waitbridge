'use client'

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2, Eye, Loader2, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type Waitlist = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function Dashboard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const fetchWaitlists = async () => {
    try {
      const res = await fetch("/api/waitlist");
      if (res.ok) {
        const data = await res.json();
        setWaitlists(data);
      }
    } catch (error) {
      console.error("Failed to fetch waitlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStatus = async () => {
    try {
      const res = await fetch("/api/user/payment-status");
      if (res.ok) {
        const data = await res.json();
        setIsPaid(data.payment || false);
      }
    } catch (error) {
      console.error("Failed to fetch payment status:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlists();
    fetchPaymentStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Waitlist created with id ${data.id}`);
        setName("");
        setDescription("");
        setOpen(false);
        fetchWaitlists(); // Refresh the list
      } else {
        const err = await res.text();
        alert(`Error: ${err}`);
      }
    } catch (error) {
      console.error("Failed to create waitlist:", error);
      alert("Failed to create waitlist");
    } finally {
      setCreateLoading(false);
    }
  };

  // Free users can only have 1 waitlist, paid users can have unlimited
  const hasWaitlist = waitlists.length > 0;
  const isLimited = !isPaid && hasWaitlist;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/waitlist?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchWaitlists(); // Refresh the list
        fetchPaymentStatus(); // Refresh payment status in case it changed
      } else {
        const err = await res.text();
        alert(`Error: ${err}`);
      }
    } catch (error) {
      console.error("Failed to delete waitlist:", error);
      alert("Failed to delete waitlist");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Welcome to Dashboard!</h1>
          {!paymentLoading && isPaid && (
            <Badge variant="default" className="gap-1">
              <Crown className="w-3 h-3" />
              Pro
            </Badge>
          )}
        </div>
        <Dialog open={open} onOpenChange={(newOpen) => {
          // Prevent opening dialog if free user already has a waitlist
          if (newOpen && isLimited) return;
          setOpen(newOpen);
        }}>
          {isLimited ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={isLimited}>
                  Create Waitlist
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Free plan limit: You can only have one waitlist. Upgrade to create unlimited waitlists.</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <DialogTrigger asChild>
              <Button>Create Waitlist</Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Waitlist</DialogTitle>
              <DialogDescription>
                {isLimited 
                  ? "You've reached the free plan limit of one waitlist. Upgrade to create unlimited waitlists."
                  : "Enter a name and optional description."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={createLoading}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={createLoading || isLimited}>
                  {createLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Waitlists</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading waitlists...</p>
        ) : waitlists.length === 0 ? (
          <div className="space-y-2">
            <p className="text-muted-foreground">No waitlists yet. Create one to get started!</p>
            {!isPaid && (
              <p className="text-sm text-muted-foreground">
                Free plan: You can create one waitlist. <a href="#" className="text-primary underline">Upgrade</a> to create unlimited waitlists.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waitlists.map((waitlist) => (
              <Card 
                key={waitlist.id}
                className="hover:shadow-lg transition-shadow duration-200 border-border/50 hover:border-border"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{waitlist.name}</CardTitle>
                  {waitlist.description && (
                    <CardDescription className="line-clamp-2">
                      {waitlist.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="pt-3 border-t gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/${waitlist.id}/edit`)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(waitlist.id, waitlist.name)}
                    disabled={deleteLoading === waitlist.id}
                    className="flex-1"
                  >
                    {deleteLoading === waitlist.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}